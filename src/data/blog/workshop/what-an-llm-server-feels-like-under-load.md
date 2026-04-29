---
title: "What an LLM Server Feels Like Under Load"
pubDatetime: 2026-04-28T18:00:00Z
featured: false
draft: false
tags:
  - vllm
  - llm
  - benchmarking
  - workshop
description: "Two 7B models, one consumer GPU. Same hardware, very different things to use. What that actually feels like."
---

I had a couple of days, an RTX 3060 with 12 GB of VRAM running on a Proxmox node, and a question I was curious about: what does running an LLM at home actually feel like to use? Alone with the model. With five other people. With fifty. At what point does it stop feeling fast and start feeling broken?

I ran the same experiments against two 7B models — Qwen 2.5 and Llama-2, both 4-bit quantized.

## The setup

One Proxmox node with one 3060 passed through. vLLM 0.11.0 in a Docker container. 4-bit quantized weights (AWQ for Qwen, GPTQ for Llama-2). Prefix caching enabled.

```bash
docker run -d --name vllm \
    --restart unless-stopped \
    --gpus all --ipc=host \
    -v vllm-models:/root/.cache/huggingface \
    -p 8000:8000 \
    vllm/vllm-openai:v0.11.0 \
    --model <MODEL> \
    --max-model-len <CTX> \
    --gpu-memory-utilization 0.9 \
    --max-num-seqs 96 \
    --enable-prefix-caching
```

Driver scripts running from a different machine. Three benchmarks per model: single-user baseline, concurrency sweep, prefix caching test. A small dashboard on `/metrics` watched KV cache, queue depth, preemptions, and TTFT live. Full data tables in the appendix.

Scripts at [github.com/clipod/vllm-probe](https://github.com/clipod/vllm-probe) if you want to clone and run them against your own vLLM instance.

## One user, no one else around

The first word appears in about 40 ms; tokens then stream at 60–80 per second, faster than reading speed. Both models feel instant. Qwen baselines at 59 tok/s decode with 43 ms TTFT. Llama-2 GPTQ at 79 tok/s with 37 ms TTFT. From the user's chair, indistinguishable.

## The wait before the first word

Time-to-first-token grows as concurrent users go up. Under 200 ms feels responsive; up to a second is fine for an LLM (ChatGPT routinely sits there). Past three seconds users start to wonder; past ten, some give up.

| Concurrent users | Qwen TTFT p95 | Llama-2 TTFT p95 |
|---|---|---|
| 1 | 40 ms | 30 ms |
| 8 | 140 ms | 120 ms |
| 32 | 280 ms | 340 ms |
| 64 | 570 ms | 590 ms |
| 96 | **770 ms** | **740 ms** |

Both models stay under a second even at 96 concurrent users. Users notice the wait at peak load but don't reload.

## The text starts typing slower

Per-user decode rate is the perceived typing speed. Above 10 tok/s feels conversational; below 5 feels like buffering.

| Concurrent users | Qwen per-user tok/s | Llama-2 per-user tok/s |
|---|---|---|
| 1 | 59 | 79 |
| 8 | 54 | 65 |
| 32 | 33 | 32 |
| 64 | 19 | 17 |
| 96 | 13 | 10 |

At 96, Llama-2 has crossed the buffering line. Qwen is right at the edge. Total throughput climbs with concurrency, but per-user throughput drops to make room for the new arrivals.

## The silent pause

Tokens are arriving, you're reading along, and then... nothing. Five seconds. Ten seconds. The cursor is still there, no error. Then tokens resume mid-sentence as if nothing happened.

This is preemption. vLLM holds each user's KV cache in GPU memory. When the pool fills and an active user needs more memory, the scheduler evicts the youngest active user to free room. The evicted user waits, then re-prefills from scratch when there's space. Tokens already on screen stay; new tokens just stop flowing for the duration.

It's a hard symptom to operate around:

- **No error is raised.** The HTTP connection stays open. Monitoring sees a healthy server.
- **Client timeouts misdiagnose it.** Many libraries hang up after 30 seconds of silence. Your user sees an error from a healthy server.
- **It hides in averages.** Most users still get fine responses; some randomly get the pause.

I forced this state on Llama-2 — long prompts, climbing concurrency, watching the KV gauge:

| Concurrent users | KV cache | Preemptions | What users feel |
|---|---|---|---|
| 4 | 28% | 0 | Smooth |
| 8 | 45% | 0 | Smooth |
| 16 | 65% | 0 | Smooth |
| 24 | **97%** | 0 | Still smooth — but on the edge |
| 32 | **100%** | **11** | **Random pauses for some** |

The dangerous spot is 24, where the pool is at 97% with zero preemptions. Everything still feels fine. One more user and the pool tips over. **Capacity planning needs to design for the cliff at 32, not the comfort at 24.**

The two models diverge sharply here. Qwen never produces the pause on this card — even at 48 concurrent users with 12,000-token prompts, its KV pool peaked at 47%. Llama-2 produces it at modest concurrency. The reason is in the section after next.

## The cold-user problem

Two users hit your service in the same minute. Identical questions, identical system prompt. The first user waits 2.5 seconds for the first word. The second waits 0.15 seconds.

That's a 16x gap in perceived speed for an identical request.

The reason is prefix caching. vLLM stores K/V vectors for sequences it's recently processed. When the second user's request arrives with the same system prompt, vLLM reuses the cached vectors instead of recomputing them.

| | Cold user TTFT | Warm user TTFT | Speedup |
|---|---|---|---|
| Qwen 2.5 | 2.48 s | 0.15 s | **17x** |
| Llama-2 GPTQ | 1.40 s | 0.12 s | **12x** |

Product implication: **the order of content in your system prompt determines whether caching helps you.** Static instructions at the front, per-user data at the end → most users feel like the second user. Per-user data at the front (user name, today's date, session token) → every user is the first user.

Prompt design earns or burns the speedup. It's a UX decision living in the prompt template, not in the infrastructure.

## Why two 7B models behave differently to users

Same card. Same 12 GB. Same 4-bit quantization. Same Marlin kernel. Both ~7B parameters. But Qwen serves 96 concurrent users smoothly; Llama-2 falls over at 32. The gap traces to one architectural choice — **how the model stores its key-value memory.**

Qwen 2.5 uses Grouped Query Attention. Its attention layers share K and V across groups of query heads. 4 KV heads across 28 layers, ~56 KB per token in fp16.

Llama-2 uses full Multi-Head Attention. Each query head gets its own K and V. 32 KV heads across 32 layers, ~512 KB per token. About 9x more memory per token.

The 6.6 GB KV pool on this card holds either ~120,000 tokens for Qwen or ~13,200 for Llama-2. Same physical memory, ~9x fewer concurrent slots for Llama-2. That's the entire user-experience gap, packed into one architectural decision.

The lesson: **architecture decides UX more than hardware on consumer cards.** Two 7B models that look interchangeable on a spec sheet have different walls. Choosing your serving model is a UX decision, not just a quality decision.

## The numbers, for engineers

Full data for verification.

**Single-user baseline** (200 output tokens, 10 kept after warmup):

| | Qwen 2.5 7B AWQ | Llama-2 7B GPTQ |
|---|---|---|
| TTFT mean | 43 ms | 37 ms |
| Total time mean | 3.41 s | 2.55 s |
| Decode tok/s mean | 59.1 | 79.3 |

**Throughput vs concurrency** (200 max output tokens, varied prompts):

| Concurrency | Qwen tok/s | Qwen per-user | Qwen TTFT p95 | Llama tok/s | Llama per-user | Llama TTFT p95 |
|---|---|---|---|---|---|---|
| 1 | 58.5 | 58.9 | 0.04 s | 78.8 | 79.4 | 0.03 s |
| 2 | 102.0 | 57.7 | 0.07 s | 150.9 | 76.5 | 0.05 s |
| 4 | 217.6 | 55.7 | 0.10 s | 284.8 | 72.7 | 0.08 s |
| 8 | 410.1 | 53.6 | 0.14 s | 505.5 | 65.2 | 0.12 s |
| 16 | 760.8 | 49.9 | 0.17 s | 810.4 | 53.1 | 0.21 s |
| 32 | 999.0 | 32.5 | 0.28 s | 971.0 | 31.7 | 0.34 s |
| 64 | 1157.5 | 18.8 | 0.57 s | 1009.9 | 16.6 | 0.59 s |
| 96 | 1184.7 | 12.9 | 0.77 s | **869.8** | 10.4 | 0.74 s |

Qwen plateaus around 1185 tok/s. Llama-2 peaks at 1010 at concurrency 64 and **drops to 870 at 96** — preemption overhead becoming visible.

**Memory-wall test** (Llama-2 GPTQ, ~2,000-token prompts, 500 max output tokens):

| Concurrency | Peak KV % | Preemptions | Wait queue | Total throughput |
|---|---|---|---|---|
| 4 | 28% | 0 | 0 | 137 tok/s |
| 8 | 45% | 0 | 0 | 179 |
| 16 | 65% | 0 | 0 | 212 |
| 24 | 97% | 0 | 0 | 217 |
| 32 | **100%** | **11** | **6** | 215 |

Qwen on a comparable long-prompt workload (12,000-token prompts at concurrency 48) peaked at 47% KV with zero preemptions. The wall is architectural.

**Prefix caching** (30 requests, concurrency 8, ~2,000-character system prompt):

| | Qwen unique | Qwen shared | Llama-2 unique | Llama-2 shared |
|---|---|---|---|---|
| TTFT p50 | 2.48 s | 0.15 s | 1.40 s | 0.12 s |
| Prefix hit rate | 0% | 94.3% | 0% | 94.3% |

Caveat on the GPTQ Llama-2 prefix run: the shared-prompt requests produced only 52 output tokens across 30 requests, while the unique-prompt requests produced 1,251. At temperature 0, decoding is deterministic, and the GPTQ-quantized weights happen to land on a "short polite answer plus EOS" output for that specific shared prefix — same architecture as the AWQ build but slightly different rounding, different greedy path. Hit rate and TTFT improvement are valid; the throughput speedup is not, since the two scenarios generated very different amounts of output.

## What this doesn't cover

Two specific models on one 12 GB card. Different model, quantization, prompts, or hardware would shift the boundaries.

Production deployments touch a longer list this didn't: failure modes, multi-tenant isolation, model upgrades, autoscaling, cost, monitoring discipline. Each is its own question.

## What I take from it

**Capacity planning is not "tokens per second peak." It's "how many users feel served."** The peak number is an upper bound on a different question than the one a product owner is asking.

**When self-hosting LLMs for production, model architecture caps your concurrency as much as the GPU does.** Two 7B models on the same card with the same quantization can support very different numbers of concurrent users. Pick the model with capacity planning in mind, not just answer quality.

**Watch the silent symptoms.** Preemption-as-pause and cold-user latency don't show up as errors. They show up as weird user feedback that's hard to reproduce. Instrument for them — preemption counts and prefix cache hit rates over time save weeks of debugging.

**Prefix caching is leverage, but only if you design for it.** Static prefixes earn their keep. Per-user data at the front of the prompt makes every user cold.

**Running this changed what I'd ask in a design review.** "Can our hardware serve N users?" sounded like a single question; now it sounds like four — first-token latency, decode rate, preemption frequency, cold-user gap. Each has a different threshold, none of them visible on a peak-throughput chart.
