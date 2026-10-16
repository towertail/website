export const HOST_RANGES = ["1-5", "6-20", "21-100", "100+"] as const;

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const THANKS = "/waitlist/thanks/";

interface SignUp {
  email: string;
  hosts: string;
  token: string;
  source: string | null;
}

class InputError extends Error {}

export class WaitlistHandler {
  constructor(
    private db: D1Database,
    private turnstileSecret: string,
    // Bind fetch: the Workers runtime rejects a fetch that is called on another object.
    private fetcher: typeof fetch = fetch.bind(globalThis),
  ) {}

  async handle(req: Request): Promise<Response> {
    if (req.method !== "POST") return Response.json({ error: "Use POST." }, { status: 405 });
    const isForm = !(req.headers.get("content-type") ?? "").includes("application/json");
    try {
      const s = await this.read(req, isForm);
      this.validate(s);
      if (!(await this.verify(s.token, req.headers.get("cf-connecting-ip")))) {
        throw new InputError("The spam check failed. Reload the page and try again.");
      }
      const country = (req.cf?.country as string | undefined) ?? null;
      // A duplicate gets the same reply, so the form does not tell if an email is on the list.
      await this.db
        .prepare(
          "INSERT INTO waitlist (email, hosts, source, country) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO NOTHING",
        )
        .bind(s.email, s.hosts, s.source, country)
        .run();
    } catch (err) {
      if (!(err instanceof InputError)) throw err;
      return isForm
        ? new Response(err.message, { status: 400, headers: { "content-type": "text/plain; charset=utf-8" } })
        : Response.json({ error: err.message }, { status: 400 });
    }
    if (isForm) return new Response(null, { status: 303, headers: { location: THANKS } });
    return Response.json({ ok: true });
  }

  private async read(req: Request, isForm: boolean): Promise<SignUp> {
    let data: Record<string, unknown>;
    try {
      data = isForm ? Object.fromEntries(await req.formData()) : await req.json();
    } catch {
      throw new InputError("The request body is not valid.");
    }
    const str = (k: string) => (typeof data[k] === "string" ? (data[k] as string).trim() : "");
    return {
      email: str("email"),
      hosts: str("hosts"),
      token: str("cf-turnstile-response"),
      source: str("source").slice(0, 200) || null,
    };
  }

  private validate(s: SignUp): void {
    if (s.email.length > 254 || !EMAIL.test(s.email)) throw new InputError("Enter a valid email address.");
    if (!(HOST_RANGES as readonly string[]).includes(s.hosts)) {
      throw new InputError(`Select a host count: ${HOST_RANGES.join(", ")}.`);
    }
    if (!s.token) throw new InputError("The spam check is missing. Reload the page and try again.");
  }

  private async verify(token: string, ip: string | null): Promise<boolean> {
    const body = new FormData();
    body.append("secret", this.turnstileSecret);
    body.append("response", token);
    if (ip) body.append("remoteip", ip);
    const res = await this.fetcher(SITEVERIFY, { method: "POST", body });
    if (!res.ok) return false;
    const out = (await res.json()) as { success?: boolean };
    return out.success === true;
  }
}
