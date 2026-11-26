# towertail.com

The source of [towertail.com](https://towertail.com): the landing page, the docs (`/docs`), and the changelog.

The site uses [Astro](https://astro.build) and [Starlight](https://starlight.astro.build). One Cloudflare Worker serves the static build and the `/api/*` routes.

## Develop

You need Node 22.22 or later and pnpm 10.

```sh
pnpm install
pnpm dev              # Astro dev server on http://localhost:4321
pnpm build            # static build to dist/
pnpm wrangler dev     # the Worker and the build, on http://localhost:8787
```

The build reads GitHub Releases for the changelog. Set `GITHUB_TOKEN` to avoid the rate limit.

## Test

```sh
pnpm check            # Worker types, astro check and tsc
pnpm test             # unit and Worker tests (Vitest)
pnpm test:build       # tests on dist/ (run after pnpm build)
pnpm test:e2e         # Playwright (starts wrangler dev)
```

## Layout

| Path | What it is |
| --- | --- |
| `src/pages/` | The landing pages. |
| `src/content/docs/docs/` | The user docs (Starlight). |
| `src/worker/` | The Worker: `/api/*` routes, else the static assets. |
| `src/styles/tokens.css` | The color tokens. The values come from the macOS app. |
| `src/config/site.ts` | The links: download, Homebrew, GitHub. |
| `migrations/` | The D1 migrations. |

## License

The site code is under the [MIT license](LICENSE).

The Towertail name, the logo and the app screenshots are not under the MIT license. See [TRADEMARK.md](TRADEMARK.md).
