export type Channel = "app" | "server";

export interface Release {
  channel: Channel;
  tag: string;
  version: string;
  name: string;
  url: string;
  publishedAt: string;
  body: string;
}

interface ApiRelease {
  tag_name: string;
  name: string | null;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  body: string | null;
}

const APP_TAG = /^v(\d+\.\d+\.\d+)$/;
const SERVER_TAG = /^server\/v(\d+\.\d+\.\d+)$/;

export class ReleaseFeed {
  constructor(
    private repo: string,
    private token?: string,
    private fetcher: typeof fetch = fetch,
  ) {}

  // Throws when the API fails, so a build never ships an empty changelog.
  async list(): Promise<Release[]> {
    const headers: Record<string, string> = {
      accept: "application/vnd.github+json",
      "user-agent": "towertail-website",
    };
    if (this.token) headers.authorization = `Bearer ${this.token}`;
    const res = await this.fetcher(`https://api.github.com/repos/${this.repo}/releases?per_page=50`, { headers });
    if (!res.ok) throw new Error(`GitHub releases for ${this.repo}: HTTP ${res.status}`);
    return ReleaseFeed.parse((await res.json()) as ApiRelease[]);
  }

  static parse(items: ApiRelease[]): Release[] {
    const out: Release[] = [];
    for (const r of items) {
      if (r.draft || r.prerelease || !r.published_at) continue;
      const app = APP_TAG.exec(r.tag_name);
      const server = SERVER_TAG.exec(r.tag_name);
      const m = app ?? server;
      if (!m) continue;
      out.push({
        channel: app ? "app" : "server",
        tag: r.tag_name,
        version: m[1],
        name: r.name || r.tag_name,
        url: r.html_url,
        publishedAt: r.published_at,
        body: r.body ?? "",
      });
    }
    return out.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }
}

// One fetch for each build, shared by all pages.
let cached: Promise<Release[]> | undefined;
export function buildReleases(): Promise<Release[]> {
  cached ??= new ReleaseFeed("towertail/towertail", process.env.GITHUB_TOKEN).list();
  return cached;
}
