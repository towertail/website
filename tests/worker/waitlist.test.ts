import { env } from "cloudflare:workers";
import { beforeEach, describe, expect, it } from "vitest";
import { WaitlistHandler } from "../../src/worker/waitlist";

const turnstile = (success: boolean) => (async () => Response.json({ success })) as unknown as typeof fetch;

const json = (body: Record<string, string>) =>
  new Request("https://towertail.com/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const form = (body: Record<string, string>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(body)) fd.append(k, v);
  return new Request("https://towertail.com/api/waitlist", { method: "POST", body: fd });
};

const valid = { email: "Ada@Example.com", hosts: "6-20", "cf-turnstile-response": "tok", source: "/" };
const rows = async () => (await env.DB.prepare("SELECT email, hosts, source FROM waitlist").all()).results;

describe("WaitlistHandler", () => {
  beforeEach(async () => {
    await env.DB.prepare("DELETE FROM waitlist").run();
  });

  it("inserts one row for a valid sign-up and returns 200", async () => {
    const res = await new WaitlistHandler(env.DB, "s", turnstile(true)).handle(json(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(await rows()).toEqual([{ email: "Ada@Example.com", hosts: "6-20", source: "/" }]);
  });

  it("returns 200 for a duplicate email in other letter case and keeps one row", async () => {
    const h = new WaitlistHandler(env.DB, "s", turnstile(true));
    await h.handle(json(valid));
    const res = await h.handle(json({ ...valid, email: "ada@example.COM", hosts: "1-5" }));
    expect(res.status).toBe(200);
    expect(await rows()).toHaveLength(1);
  });

  it.each([
    ["a bad email", { ...valid, email: "not-an-email" }],
    ["a long email", { ...valid, email: `${"a".repeat(250)}@x.io` }],
    ["a bad hosts value", { ...valid, hosts: "lots" }],
    ["no Turnstile token", { ...valid, "cf-turnstile-response": "" }],
  ])("returns 400 for %s and inserts no row", async (_name, body) => {
    const res = await new WaitlistHandler(env.DB, "s", turnstile(true)).handle(json(body));
    expect(res.status).toBe(400);
    expect(await res.json()).toHaveProperty("error");
    expect(await rows()).toHaveLength(0);
  });

  it("returns 400 when the Turnstile check fails and inserts no row", async () => {
    const res = await new WaitlistHandler(env.DB, "s", turnstile(false)).handle(json(valid));
    expect(res.status).toBe(400);
    expect(await rows()).toHaveLength(0);
  });

  it("sends the secret and the token to Turnstile", async () => {
    let sent: FormData | undefined;
    const fetcher = (async (_u: string, init: RequestInit) => {
      sent = init.body as FormData;
      return Response.json({ success: true });
    }) as unknown as typeof fetch;
    await new WaitlistHandler(env.DB, "the-secret", fetcher).handle(json(valid));
    expect(sent?.get("secret")).toBe("the-secret");
    expect(sent?.get("response")).toBe("tok");
  });

  it("returns 303 to the thanks page for a form POST", async () => {
    const res = await new WaitlistHandler(env.DB, "s", turnstile(true)).handle(form(valid));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/waitlist/thanks/");
    expect(await rows()).toHaveLength(1);
  });

  it("returns 400 text for a bad form POST", async () => {
    const res = await new WaitlistHandler(env.DB, "s", turnstile(true)).handle(form({ ...valid, hosts: "x" }));
    expect(res.status).toBe(400);
    expect(await res.text()).toContain("host count");
  });

  it("returns 405 for GET", async () => {
    const res = await new WaitlistHandler(env.DB, "s").handle(new Request("https://towertail.com/api/waitlist"));
    expect(res.status).toBe(405);
  });
});
