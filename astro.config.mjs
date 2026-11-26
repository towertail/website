// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";
import { GITHUB_URL, SITE_REPO_URL, SITE_URL } from "./src/config/site.ts";

export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "Towertail Docs",
      description: "The user docs for Towertail: install, add hosts, thresholds, the sampler and self-host.",
      favicon: "/favicon.svg",
      disable404Route: true,
      plugins: [starlightLinksValidator()],
      customCss: ["./src/styles/starlight.css"],
      components: {
        Header: "./src/components/starlight/Header.astro",
        Footer: "./src/components/starlight/Footer.astro",
        Head: "./src/components/starlight/Head.astro",
      },
      social: [{ icon: "github", label: "GitHub", href: GITHUB_URL }],
      editLink: { baseUrl: `${SITE_REPO_URL}/edit/main/` },
      sidebar: [
        { label: "Overview", link: "/docs/" },
        {
          label: "Start",
          items: ["docs/install", "docs/add-hosts", "docs/tailscale", "docs/thresholds"],
        },
        {
          label: "Sampler",
          items: ["docs/sampler/how-it-works", "docs/sampler/service-install"],
        },
        {
          label: "Cloud",
          items: ["docs/cloud/api", "docs/cloud/mcp"],
        },
        {
          label: "Self-host",
          items: ["docs/self-host/quick-start", "docs/self-host/tokens", "docs/self-host/configuration"],
        },
      ],
    }),
  ],
});
