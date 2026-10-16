// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";

export default defineConfig({
  site: "https://towertail.com",
  output: "static",
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "Towertail Docs",
      disable404Route: true,
      plugins: [starlightLinksValidator()],
      customCss: ["./src/styles/starlight.css"],
      components: {
        Header: "./src/components/starlight/Header.astro",
        Footer: "./src/components/starlight/Footer.astro",
      },
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/towertail/towertail" }],
      editLink: { baseUrl: "https://github.com/towertail/website/edit/main/" },
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
          label: "Self-host",
          items: ["docs/self-host/quick-start", "docs/self-host/tokens", "docs/self-host/configuration"],
        },
      ],
    }),
  ],
});
