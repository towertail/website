import { INSTALL_SH_URL } from "../config/site";

const APEX = "towertail.com";

export default {
  async fetch(req, env): Promise<Response> {
    const url = new URL(req.url);
    if (url.hostname === `www.${APEX}`) {
      url.hostname = APEX;
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === "/install.sh" && req.method === "GET") {
      return new Response(null, { status: 302, headers: { location: INSTALL_SH_URL, "cache-control": "max-age=300" } });
    }
    if (url.pathname.startsWith("/api/")) return api(url);
    return env.ASSETS.fetch(req);
  },
} satisfies ExportedHandler<Env>;

function api(url: URL): Response {
  if (url.pathname === "/api/health") return Response.json({ ok: true });
  return Response.json({ error: "not found" }, { status: 404 });
}
