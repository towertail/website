import { describe, expect, it } from "vitest";
import { ReleaseFeed } from "../../src/lib/releases";
import fixture from "./releases.fixture.json";

const stub = (status: number, body: unknown) =>
  (async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

describe("ReleaseFeed", () => {
  it("parses the fixture into app and server releases, newest first", async () => {
    const list = await new ReleaseFeed("x/y", undefined, stub(200, fixture)).list();
    expect(list.map((r) => [r.channel, r.tag, r.version])).toEqual([
      ["app", "v0.2.0", "0.2.0"],
      ["server", "server/v0.1.0", "0.1.0"],
      ["app", "v0.1.9", "0.1.9"],
      ["app", "v0.1.8", "0.1.8"],
      ["app", "v0.1.7", "0.1.7"],
      ["app", "v0.1.6", "0.1.6"],
    ]);
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
