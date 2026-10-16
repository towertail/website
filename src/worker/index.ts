import { WaitlistHandler } from "./waitlist";

const APEX = "towertail.com";

export default {
  async fetch(req, env): Promise<Response> {
    const url = new URL(req.url);
    if (url.hostname === `www.${APEX}`) {
      url.hostname = APEX;
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname.startsWith("/api/")) return api(req, env, url);
    return env.ASSETS.fetch(req);
  },
} satisfies ExportedHandler<Env>;

async function api(req: Request, env: Env, url: URL): Promise<Response> {
  switch (url.pathname) {
    case "/api/health":
      return Response.json({ ok: true });
    case "/api/waitlist": {
      const ip = req.headers.get("cf-connecting-ip") ?? "unknown";
      const { success } = await env.WAITLIST_LIMIT.limit({ key: ip });
      if (!success) return Response.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
      return new WaitlistHandler(env.DB, env.TURNSTILE_SECRET).handle(req);
    }
    default:
      return Response.json({ error: "not found" }, { status: 404 });
  }
}
