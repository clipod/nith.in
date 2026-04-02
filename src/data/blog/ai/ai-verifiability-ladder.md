---
title: "The Verifiability Ladder: How AI Learned to Code, Why Developers Paid the Price, and Where the Economy Breaks"
pubDatetime: 2026-04-02T10:00:00Z
featured: true
draft: false
tags:
  - ai
  - software-engineering
  - economics
  - career
description: "AI didn't target developers because they were easy to replace. It targeted code because compilers give the cleanest feedback signal for reinforcement learning. Developers were collateral damage of a training methodology — and they're just the first rung on a ladder that climbs from verifiable to unverifiable work."
ogImage: "https://nith.in/site-og-v2.png"
---

## It Was Never About Code

When Large Language Models first arrived, they were exactly what their name promised — models of language. The entire lineage, from Google's 2017 "Attention Is All You Need" paper through BERT and the GPT series, was rooted in natural language processing. The goal was translation, summarization, text generation, conversation. The transformer architecture was designed to understand how words relate to each other across long passages of text. It was a breakthrough in reading and writing, not in programming.

GPT-3 could generate text that looked like code. But on formal benchmarks designed to test whether a model can actually write functioning programs, it solved zero percent of problems. Zero. Code was in the training corpus — the model had seen plenty of GitHub repositories — but generating plausible-looking syntax and writing software that actually works are very different things. In 2020, nobody at OpenAI was sitting in a room saying "let's go disrupt software engineers." They were building a language engine. Their paper was titled "Language Models are Few-Shot Learners" and focused on translation, question-answering, and text generation.

But then something interesting happened. People started experimenting with GPT-3's API and discovered it could produce code-like output that sometimes worked. OpenAI noticed. In 2021, they deliberately fine-tuned GPT-3 on 159 gigabytes of Python code from 54 million GitHub repositories, creating a specialized model called Codex. Codex could solve nearly 29% of programming problems that GPT-3 couldn't touch. It became the engine behind GitHub Copilot. That was the moment code shifted from an accidental capability to an intentional direction.

So what turned that intentional direction into a full-blown disruption of software engineering?

## The Gym with a Perfect Scoreboard

The answer lies in how these models get better — specifically, a training technique called Reinforcement Learning with Verifiable Rewards (RLVR).

Here's the fundamental problem with teaching an AI to improve: you need a way to tell it whether its output is right or wrong. For most of what language models do — writing essays, summarizing articles, having conversations — "right" and "wrong" are subjective. Is this paragraph good? Depends who you ask. Is this summary accurate? Partially, maybe. The reward signal is noisy, ambiguous, expensive to generate. You need humans to sit there and rank outputs, and even they disagree with each other.

But code? Code has a built-in judge. You run it. It compiles or it doesn't. The tests pass or they fail. The output matches the expected result or it's wrong. That binary signal — one or zero, pass or fail — is the cleanest possible feedback for reinforcement learning. No ambiguity. No subjectivity. No expensive human evaluation. Just a compiler telling the model, thousands of times a second, whether it got it right.

This is what researchers call "verifiable rewards." Jason Wei, who helped build OpenAI's o1 reasoning model before joining Meta's Superintelligence Labs, formalized this insight as "the Verifier's Rule": the ease of training AI to solve a task is proportional to how verifiable that task is. Math and code sit at one end of that spectrum — perfectly verifiable, perfectly trainable. Business strategy, creative vision, and human judgment sit at the other end — almost impossible to score with a binary signal.

Code wasn't chosen as AI's first target because developers were easy to replace. Code was chosen because it was the perfect gym. The compiler was the perfect coach. And developers were the collateral damage of a training methodology.

## The Product and the Pipeline Are the Same Thing

Here's where it gets uncomfortable.

When GitHub launched Copilot, powered by OpenAI, it wasn't just a product. It was a data collection engine. Every time a developer accepts a suggestion, that's a positive signal. Every time they reject one, that's a negative signal. Every modification, every bug introduced and then fixed — all of it feeds back into the model. The same is true for JetBrains AI, Claude Code, and every other AI-powered developer tool on the market.

These tools are built on frontier AI models from OpenAI, Anthropic, Google. The commercial product and the training feedback loop are the same thing. Developers aren't just customers of AI coding tools — they're the training data, the quality assurance team, and the stress testers all at once. They pay for a subscription, and in return, they improve the very system that's learning to do their job.

AI Engineer job postings grew 654% between the first half of 2024 and the second half of 2025. Companies aren't hiring that aggressively to manage a technology that's simply replacing people. They're hiring because they need humans to run AI — for now. But every interaction those humans have with the system makes the system better and the human contribution marginally less necessary.

The irony is almost too clean. The profession that understood automation best became the first to automate — not because anyone planned it, but because the nature of their work produced the cleanest signal for the machine to learn from.

## The Emergent Pattern

What's happening next isn't a strategy anyone designed. It's an emergent pattern.

Companies replace developers with AI tools to cut costs. Then they discover that AI-generated code needs oversight — it hallucinates plausible-looking functions that don't work, it introduces security vulnerabilities that pass surface-level review, it creates architectures that nobody can maintain. So they need senior engineers to govern the system, audit its outputs, and build the guardrails that keep it from drifting.

The data backs this up. Research from Forrester predicts that roughly half the companies that cut workers citing AI in 2025 will quietly rehire — often at lower salaries, often offshore, often in different roles. The traditional hiring pyramid is collapsing. Entry-level and mid-level positions disappear because AI handles the routine execution. But senior roles become more critical than ever because someone has to be accountable for the machine's decisions.

This creates a feedback loop that nobody explicitly designed but everyone is now riding. Displace developers. Discover you need experts to manage what the AI builds. Those experts interact with the system, generating the feedback that makes it better. The system improves. The bar for what constitutes "routine execution" rises. More roles become automatable. Repeat.

Whether companies intended this or not, the effect is the same: each wave of displacement refines the AI further, pushing its capabilities from domains where the output is easily verifiable toward domains where it isn't.

## The Verifiability Ladder

This is the core of my hypothesis. AI isn't climbing from "simple" to "complex" work. It's climbing from verifiable to unverifiable output.

**Fully verifiable.** Code compiles or it doesn't. A math proof is correct or it isn't. The compiler, the test suite, the theorem prover — these are objective judges. AI learns fastest here because the reward signal is binary and instant. This is why software development and quantitative analysis were disrupted first. Not because they're easy — they're not — but because the machine can tell, on its own, whether it got the answer right.

**Partially verifiable.** A data analysis can be checked for numerical accuracy, but was the interpretation correct? A legal document can be verified for factual citations, but is the argument persuasive? A financial model can be tested against historical data, but does the forecast make sense? Here, you can verify the output but not the insight. AI can function in this zone, but it starts to drift. You need domain experts to catch the errors that no automated check can find.

**Barely verifiable.** Is this business strategy sound? Is this product vision right? Is this negotiation approach going to work? Will this organizational restructure improve performance? There's no compiler for judgment. No binary pass/fail. The reward signal is noisy, subjective, and delayed — you might not know if the strategy was right for years. AI can generate plausible-sounding recommendations in this zone, but "plausible-sounding" and "correct" are dangerously different things.

The ladder AI is climbing runs from the first category toward the third. And at each rung, the same pattern repeats: AI enters the domain, displaces the routine work, and then stalls at the boundary where verifiability breaks down. That boundary is where humans remain essential — not because they're faster or cheaper, but because they're the only ones who can evaluate quality when there's no objective test.

This also explains a phenomenon that's been widely documented but poorly understood: AI-washing. When you're in the fully verifiable zone, it's easy to prove whether AI is actually working. The code runs or it doesn't. But in the barely verifiable zone, companies can claim AI is doing the job even when it isn't. If nobody can objectively measure quality, nobody can objectively call out the gap.

In 2025, U.S. employers announced roughly 1.2 million job cuts — the highest since the pandemic — according to outplacement firm Challenger, Gray & Christmas. Of those, AI was explicitly cited in about 55,000, or roughly 4.5%. That gap between the headline and the data tells you something important.

Here's what I think is actually happening, and it's more structural than cynical. When a company needs to cut thousands of people, the executive team needs an anchor — a narrative that explains the cuts as strategic rather than reactive. "We overhired during the pandemic" is an admission of failure. "Our strategy was wrong" gets the CEO fired. But "we're leaning into AI to become more efficient" is a growth story. It says we're not shrinking, we're evolving. The stock goes up. The board nods. The remaining employees feel like they're on a winning team rather than a sinking ship.

AI has become the perfect narrative anchor because it's almost impossible to argue against. If you push back, you sound anti-innovation. Nobody in an earnings call wants to be the person asking "but is the AI actually doing those people's jobs?" because the implication is that you don't believe in the future. Even Sam Altman, the CEO of OpenAI — the person building the technology — has acknowledged that "there's some AI washing where people are blaming AI for layoffs that they would otherwise do." Marc Andreessen went further, saying the current wave reflects pandemic-era overstaffing, not AI capability.

So it's less that companies are lying about AI and more that AI provides the most investor-friendly, least embarrassing framing for cuts that were already coming. The technology is real. The narrative utility is also real. And the two are being conflated in a way that makes it nearly impossible to measure AI's actual impact on employment. Which brings us to a much bigger problem.

## The Arithmetic Problem

Now we arrive at the part that keeps me up at night. And I want to be clear — I'm a software architect, not an economist. But you don't need an economics degree to follow this math.

The economy runs on a loop. People work. They earn wages. They spend those wages on products and services. That spending becomes revenue for companies. Companies use that revenue to hire people and invest. The loop continues.

AI disrupts this loop in a specific way. When a company replaces workers with AI, it sees an immediate benefit: lower costs, higher margins, the same output with fewer salaries. On any individual balance sheet, this looks great. The stock price jumps. Executives get rewarded.

But every person removed from the income side of the economy is also removed from the spending side. They're the same people. The workers who earned the wages are the customers who bought the products. You can't optimize one side of that equation and expect the other side to hold.

Scale this up across an entire economy and the arithmetic gets stark. If AI displaces a significant percentage of the workforce — or even suppresses wages broadly enough — aggregate consumer spending declines. Companies produce more efficiently but sell less. Revenue drops. Investment slows. The loop stalls.

Research from the EU's Futurium project puts it bluntly: while AI generates substantial productivity gains at the firm level, only 3 to 7 percent of those improvements translate into higher worker earnings. The rest gets absorbed by capital owners. The productivity gains are real. The sharing of those gains is not.

Some economists push back on this. They argue new jobs will emerge, monetary policy can compensate, and the transition will be gradual enough for markets to adjust. They point to history — every previous technological revolution eventually created more jobs than it destroyed. These are serious arguments and I don't dismiss them.

But here's what's different this time. Previous revolutions automated physical labor and created cognitive work. The spinning jenny eliminated hand weavers but created factory managers, logistics coordinators, and a vast clerical workforce. There was somewhere for displaced workers to go — up the complexity ladder to work that machines couldn't do.

AI doesn't work that way. It enters at the cognitive layer. It climbs the verifiability ladder, automating not muscles but judgment. And it does so across domains simultaneously — code, analysis, writing, design, customer service — rather than one industry at a time. The historical escape valve of "move to higher-complexity work" may not function when the machine is climbing toward that same complexity.

## The Fork

This is where the future splits.

**Path A: Self-correction.** Governments and businesses recognize the arithmetic. Not because they're moral — because their own survival depends on it. If consumer spending collapses, there's no market for what AI produces. Companies can't sell to people who don't have income. So policy intervenes. AI productivity gains get taxed to fund retraining programs, education, workforce transition. Companies redesign AI as a force multiplier for human workers rather than a replacement. Nobel laureate Daron Acemoglu has been making this case forcefully — AI creates enormous possibilities for expanding human capabilities, but only if organizations develop and implement the technology intentionally. Left to market forces alone, automation is the default, and the default leads to the arithmetic problem.

This isn't charity. It's economic self-preservation. The businesses that figure this out first — using AI to make their workers more effective rather than making their workers unnecessary — will build the most durable competitive advantage. The ones that chase short-term margin improvements through headcount cuts will find themselves selling into a shrinking market.

**Path B: The Hunger Games.** The correction doesn't happen. Or it happens too slowly. The verifiability ladder keeps climbing. Each rung displaces another wave of workers. The wealth gap between the people who own AI infrastructure and everyone else becomes a chasm. A handful of entities own production. A shrinking technical class maintains the machinery. Everyone else becomes economically irrelevant — not a customer base to be engaged, but a population to be managed.

This isn't science fiction. It's the logical endpoint of the arithmetic if nothing interrupts it. A world where production is fully automated and consumption is fully concentrated isn't capitalism anymore. It's feudalism with better technology. A Capitol that produces everything. Districts that participate in nothing.

The uncomfortable truth is that which path we take isn't determined by technology. It's determined by choices — corporate choices about how to deploy AI, policy choices about how to distribute its gains, and individual choices about what we demand from the institutions that shape our lives.

## What I Think Will Happen

I believe the correction will come, but not cleanly and not quickly. Companies will overshoot on replacement, discover the demand problem the hard way, and course-correct after damage has been done. Governments will be late, as they always are with technology. Some industries will get the balance right early. Others won't.

The developers who are being displaced right now are the canary in the coal mine. Not because software engineering is uniquely vulnerable — but because it sat at the most verifiable end of the ladder, where AI learns fastest. What's happening to them will eventually happen to every profession as AI climbs from verifiable to unverifiable output. The only question is the timeline.

If you're a business leader reading this, the implication is clear: the companies that survive the next decade will be the ones that use AI to make their people extraordinary rather than expendable. Not because it's the right thing to do — although it is — but because the alternative is selling into an economy that can no longer afford what you produce.

If you're a policymaker, the arithmetic demands action before the loop breaks. Tax AI productivity gains. Fund workforce transition. Create incentives for augmentation over replacement. Not because workers deserve protection — although they do — but because the economy doesn't function without them as participants.

And if you're a developer who just got laid off because an AI tool can now write the boilerplate you used to write — understand what happened. You weren't replaced because you were bad at your job. You were replaced because your job produced the cleanest signal for the machine to learn from. That's not a reflection of your value. It's a reflection of your profession's unfortunate position on the verifiability ladder.

The ladder keeps climbing. What we build at the top of it is still up to us.

---

*I'm not an economist. I'm a software architect who has been watching how technology reshapes the people who build it. This was a hypothesis born out of observation and a fair amount of late-night reading — stress-tested against research, but offered with a grain of salt. I welcome corrections and counterarguments.*

