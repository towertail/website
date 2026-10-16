import { describe, expect, it } from "vitest";
import { ReleaseFeed } from "../../src/lib/releases";
import fixture from "../../src/lib/releases.fixture.json";

const stub = (status: number, body: unknown) =>
  (async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

describe("ReleaseFeed", () => {
  it("splits app and server tags", async () => {
    const list = await new ReleaseFeed("towertail/towertail", undefined, stub(200, fixture)).list();
    const app = list.filter((r) => r.channel === "app").map((r) => r.tag);
    const server = list.filter((r) => r.channel === "server").map((r) => r.tag);
    expect(app).toContain("v0.2.0");
    expect(server).toEqual(["server/v0.1.0"]);
    expect(list.find((r) => r.tag === "server/v0.1.0")?.version).toBe("0.1.0");
  });

  it("sorts newest first", async () => {
    const list = await new ReleaseFeed("x/y", undefined, stub(200, fixture)).list();
    const dates = list.map((r) => r.publishedAt);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(list[0].tag).toBe("v0.2.0");
  });

  it("drops drafts and pre-releases", async () => {
    const list = await new ReleaseFeed("x/y", undefined, stub(200, fixture)).list();
    const tags = list.map((r) => r.tag);
    expect(tags).not.toContain("v9.9.9");
    expect(tags).not.toContain("server/v0.1.0-rc.1");
  });

  it("sends the token when set", async () => {
    let auth: string | null = null;
    const fetcher = (async (_url: string, init?: RequestInit) => {
      auth = new Headers(init?.headers).get("authorization");
      return new Response("[]");
    }) as unknown as typeof fetch;
    await new ReleaseFeed("x/y", "t0k", fetcher).list();
    expect(auth).toBe("Bearer t0k");
  });

  it("throws when the API fails", async () => {
    await expect(new ReleaseFeed("x/y", undefined, stub(403, { message: "rate limit" })).list()).rejects.toThrow(
      "HTTP 403",
    );
  });
});
