import { defineConfig } from "vitest/config";
import { cloudflareTest } from "@cloudflare/vitest-plugin";

export default defineConfig({
  test: {
    projects: [
      { test: { name: "unit", include: ["tests/lib/**/*.test.ts"], environment: "node" } },
      { test: { name: "build", include: ["tests/build/**/*.test.ts"], environment: "node" } },
      {
        plugins: [
          cloudflareTest(() => ({
            wrangler: { configPath: "./wrangler.jsonc" },
            miniflare: {
              assets: { directory: "./tests/worker/assets", binding: "ASSETS", notFoundHandling: "404-page" },
            },
          })),
        ],
        test: { name: "worker", include: ["tests/worker/**/*.test.ts"] },
      },
    ],
  },
});
