import { exports } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

const get = (url: string) => exports.default.fetch(new Request(url, { redirect: "manual" }));

describe("worker routes", () => {
  it("returns 200 on /api/health", async () => {
    const res = await get("https://towertail.com/api/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("returns 404 JSON on an unknown API path", async () => {
    const res = await get("https://towertail.com/api/nope");
    expect(res.status).toBe(404);
  });

  it("serves the static home page", async () => {
    const res = await get("https://towertail.com/");
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("home");
  });

  it("serves the 404 page with status 404", async () => {
    const res = await get("https://towertail.com/no/such/page/");
    expect(res.status).toBe(404);
    expect(await res.text()).toContain("404");
  });

  it("redirects www to the apex with 301", async () => {
    const res = await get("https://www.towertail.com/docs/?q=1");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://towertail.com/docs/?q=1");
  });
});
