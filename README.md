# nith.in

Personal website and blog for Venkat Nithin Chinni. Built with [Astro](https://astro.build/) and the [AstroPaper](https://github.com/satnaing/astro-paper) theme, deployed to GitHub Pages.

## Local Development

```bash
pnpm install
pnpm run dev       # starts dev server at localhost:4321
pnpm run build     # production build to dist/
```

## Publishing a New Post

Add a markdown file to `src/data/blog/<category>/` with frontmatter, commit, and push. GitHub Actions handles the rest.
