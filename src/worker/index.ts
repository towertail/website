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

async function api(_req: Request, _env: Env, url: URL): Promise<Response> {
  switch (url.pathname) {
    case "/api/health":
      return Response.json({ ok: true });
    default:
      return Response.json({ error: "not found" }, { status: 404 });
  }
}
