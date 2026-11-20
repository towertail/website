import { expect, test } from "@playwright/test";

const DOWNLOAD = "https://github.com/towertail/towertail/releases/latest/download/Towertail.zip";
const BREW = "brew install --cask towertail/tap/towertail";

test.describe("home page", () => {
  test("loads with no horizontal scroll", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("menu bar");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("has the correct Download link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Download for Mac" })).toHaveAttribute("href", DOWNLOAD);
  });

  test("Copy puts the command on the clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.getByRole("button", { name: /Copy the command/ }).first().click();
    await expect(page.getByRole("button", { name: /Copy the command/ }).first()).toHaveText("Copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(BREW);
  });

  test("cloud section shows three plans", async ({ page }) => {
    await page.goto("/#cloud");
    const cloud = page.locator("#cloud");
    for (const [name, price] of [["Free", "$0"], ["Solo", "$5"], ["Team", "$10"]]) {
      await expect(cloud.getByRole("heading", { name, exact: true })).toBeVisible();
      await expect(cloud.getByText(price, { exact: true })).toBeVisible();
    }
    await expect(cloud.getByText("planned")).toHaveCount(0);
  });

  test("cloud section has no waitlist form", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("form[data-wl]")).toHaveCount(0);
  });

  test("sign in from the app", async ({ page }) => {
    await page.goto("/#cloud");
    const cloud = page.locator("#cloud");
    await expect(cloud.getByText("Open Towertail, then choose Turn on 24/7 monitoring.")).toBeVisible();
    await expect(cloud.getByRole("link", { name: "Download" })).toHaveAttribute("href", DOWNLOAD);
    await expect(cloud.getByRole("link", { name: "Open the dashboard" })).toHaveAttribute("href", "https://app.towertail.com");
  });
});

test("an unknown path returns the 404 page with status 404", async ({ page }) => {
  const res = await page.goto("/no/such/page/");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page does not exist.");
});

test("docs and changelog load", async ({ page }) => {
  expect((await page.goto("/docs/"))?.status()).toBe(200);
  await page.goto("/changelog/");
  await expect(page.locator("#app .rel").first()).toBeVisible();
});
