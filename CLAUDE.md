# CLAUDE.md

The towertail.com site: Astro + Starlight, served by one Cloudflare Worker.

- Use Node 22.22 or later and pnpm.
- Run `pnpm check`, `pnpm test` and `pnpm build` before a commit.
- Put the colors in `src/styles/tokens.css` only. Use the `--tt-*` variables in components.
- Put the links in `src/config/site.ts` only.
- Write the docs in ASD-STE100 Simplified Technical English.
- Copy only our own screenshots (`towertail-*.png`). Do not copy third-party screenshots.
