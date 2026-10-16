import { defineConfig } from "vitest/config";
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";

export default defineConfig({
  test: {
    projects: [
      { test: { name: "unit", include: ["tests/lib/**/*.test.ts"], environment: "node" } },
      { test: { name: "build", include: ["tests/build/**/*.test.ts"], environment: "node" } },
      {
        plugins: [
          cloudflareTest(async () => ({
            wrangler: { configPath: "./wrangler.jsonc" },
            miniflare: {
              bindings: {
                TURNSTILE_SECRET: "test-secret",
                TEST_MIGRATIONS: await readD1Migrations("./migrations"),
              },
              assets: { directory: "./tests/worker/assets", binding: "ASSETS", notFoundHandling: "404-page" },
            },
          })),
        ],
        test: { name: "worker", include: ["tests/worker/**/*.test.ts"], setupFiles: ["./tests/worker/setup.ts"] },
      },
    ],
  },
});
