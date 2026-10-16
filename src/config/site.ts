export const SITE_URL = "https://towertail.com";
export const SITE_NAME = "Towertail";
export const SITE_DESCRIPTION =
  "Towertail is a macOS menu-bar monitor for your servers. It shows CPU, memory, disk and network over SSH and Tailscale. No agent to install.";

export const GITHUB_ORG = "https://github.com/towertail";
export const GITHUB_REPO = "towertail/towertail";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;
export const SITE_REPO_URL = `${GITHUB_ORG}/website`;
export const RELEASES_URL = `${GITHUB_URL}/releases`;
export const WINDOWS_BUILD_URL = `${GITHUB_URL}/tree/main/app/windows#readme`;
export const TRADEMARK_URL = `${SITE_REPO_URL}/blob/main/TRADEMARK.md`;

export const DOWNLOAD_URL = `${RELEASES_URL}/latest/download/Towertail.zip`;
export const BREW_CMD = "brew install --cask towertail/tap/towertail";
export const MIN_MACOS = "macOS 14";

export const NAV = [
  { href: "/docs/", label: "Docs" },
  { href: "/#cloud", label: "Cloud" },
  { href: "/changelog/", label: "Changelog" },
  { href: GITHUB_URL, label: "GitHub" },
];
