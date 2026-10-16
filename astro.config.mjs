// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";

const OG_IMAGE = "https://towertail.com/og/default.png";
// Cloudflare Web Analytics. Leave it out when the token is not set (local and preview builds).
const beacon = process.env.PUBLIC_CF_BEACON_TOKEN;

/** @type {import("@astrojs/starlight/types").StarlightUserConfig["head"]} */
const head = [
  { tag: "link", attrs: { rel: "apple-touch-icon", href: "/apple-touch-icon.png" } },
  { tag: "link", attrs: { rel: "manifest", href: "/manifest.webmanifest" } },
  { tag: "meta", attrs: { property: "og:image", content: OG_IMAGE } },
  { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
  { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
  { tag: "meta", attrs: { name: "twitter:image", content: OG_IMAGE } },
];
if (beacon) {
  head.push({
    tag: "script",
    attrs: {
      defer: true,
      src: "https://static.cloudflareinsights.com/beacon.min.js",
      "data-cf-beacon": JSON.stringify({ token: beacon }),
    },
  });
}

export default defineConfig({
  site: "https://towertail.com",
  output: "static",
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "Towertail Docs",
      description: "The user docs for Towertail: install, add hosts, thresholds, the sampler and self-host.",
      favicon: "/favicon.svg",
      head,
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
