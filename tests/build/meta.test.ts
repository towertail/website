import { existsSync, readFileSync } from "node:fs";
import { parse } from "node-html-parser";
import { describe, expect, it } from "vitest";

const dist = new URL("../../dist/", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, dist), "utf8");

describe.skipIf(!existsSync(dist))("built pages", () => {
  it.each(["index.html", "docs/install/index.html", "changelog/index.html"])("%s has the SEO tags", (file) => {
    const doc = parse(read(file));
    const meta = (sel: string) => doc.querySelector(sel)?.getAttribute("content");
    expect(doc.querySelector("title")?.text.trim()).toBeTruthy();
    expect(meta('meta[name="description"]')).toBeTruthy();
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toMatch(/^https:\/\/towertail\.com\//);
    expect(meta('meta[property="og:image"]')).toBe("https://towertail.com/og/default.png");
    expect(meta('meta[name="twitter:card"]')).toBe("summary_large_image");
  });

  it("lists /, /docs/ and /changelog/ in the sitemap", () => {
    const index = read("sitemap-index.xml");
    const locs = [...index.matchAll(/<loc>https:\/\/towertail\.com\/(.+?)<\/loc>/g)].map((m) => m[1]);
    const urls = locs.map((f) => read(f)).join("");
    for (const u of ["https://towertail.com/", "https://towertail.com/docs/", "https://towertail.com/changelog/"]) {
      expect(urls).toContain(`<loc>${u}</loc>`);
    }
  });

  it("leaves out the analytics beacon when the token is not set", () => {
    if (process.env.PUBLIC_CF_BEACON_TOKEN) return;
    expect(read("index.html")).not.toContain("cloudflareinsights");
    expect(read("docs/install/index.html")).not.toContain("cloudflareinsights");
  });

  it("has the icons, the manifest and robots.txt", () => {
    for (const f of ["favicon.svg", "apple-touch-icon.png", "manifest.webmanifest", "robots.txt", "og/default.png"]) {
      expect(existsSync(new URL(f, dist)), f).toBe(true);
    }
  });
});
