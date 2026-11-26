export const SITE_URL = "https://towertail.com";
export const OG_IMAGE = `${SITE_URL}/og/default.png`;
export const SITE_NAME = "Towertail";
export const SITE_DESCRIPTION =
  "Towertail is a macOS menu-bar monitor for your servers. It shows CPU, memory, disk and network over SSH and Tailscale. No agent to install.";

export const GITHUB_ORG = "https://github.com/towertail";
export const GITHUB_REPO = "towertail/towertail";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;
export const SITE_REPO_URL = `${GITHUB_ORG}/website`;
export const RELEASES_URL = `${GITHUB_URL}/releases`;
export const WINDOWS_BUILD_URL = `${GITHUB_URL}/tree/main/apps/windows#readme`;
export const TRADEMARK_URL = `${SITE_REPO_URL}/blob/main/TRADEMARK.md`;

export const DOWNLOAD_URL = `${RELEASES_URL}/latest/download/Towertail.zip`;
export const INSTALL_SH_URL = `${GITHUB_ORG}/sampler/releases/latest/download/install.sh`;
export const CLOUD_APP_URL = "https://app.towertail.com";
export const BREW_CMD = "brew install --cask towertail/tap/towertail";
export const MIN_MACOS = "macOS 14";

export const NAV = [
  { href: "/docs/", label: "Docs" },
  { href: "/#cloud", label: "Cloud" },
  { href: "/changelog/", label: "Changelog" },
  { href: GITHUB_URL, label: "GitHub" },
];

export const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    unit: "",
    note: "No card.",
    items: ["3 hosts", "1 user", "1 day of history", "Email alerts"],
  },
  {
    id: "solo",
    name: "Solo",
    price: "$5",
    unit: "/mo",
    note: "Or $50/yr.",
    items: ["25 hosts", "1 user", "30 days of history", "Phone push", "+$5 for each 25 more hosts, up to 100"],
  },
  {
    id: "team",
    name: "Team",
    price: "$10",
    unit: "/user/mo",
    note: "Minimum 3 users ($30).",
    items: ["100 hosts, then $1/host", "1 year of history", "Escalation and roles", "Slack and webhooks", "SMS budget of $2/mo"],
  },
];
export const PLANS_COMMON = "Read-only API and MCP on all plans.";
