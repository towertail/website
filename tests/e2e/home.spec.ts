import { expect, test } from "@playwright/test";

const DOWNLOAD = "https://github.com/towertail/towertail/releases/latest/download/Towertail.zip";
const BREW = "brew install --cask towertail/tap/towertail";

test.describe("home page", () => {
  test("loads with no horizontal scroll and the Download link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("menu bar");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await expect(page.getByRole("link", { name: "Download for Mac" })).toHaveAttribute("href", DOWNLOAD);
  });

  test("Copy puts the command on the clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.getByRole("button", { name: /Copy the command/ }).first().click();
    await expect(page.getByRole("button", { name: /Copy the command/ }).first()).toHaveText("Copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(BREW);
  });

  test("cloud section shows the plans and the sign-in steps", async ({ page }) => {
    await page.goto("/#cloud");
    const cloud = page.locator("#cloud");
    for (const [name, price] of [["Free", "$0"], ["Solo", "$5"], ["Team", "$10"]]) {
      await expect(cloud.getByRole("heading", { name, exact: true })).toBeVisible();
      await expect(cloud.getByText(price, { exact: true })).toBeVisible();
    }
    await expect(cloud.getByText("planned")).toHaveCount(0);
    await expect(cloud.getByText("Open Towertail, then choose Turn on 24/7 monitoring.")).toBeVisible();
    await expect(cloud.getByRole("link", { name: "Download" })).toHaveAttribute("href", DOWNLOAD);
    await expect(cloud.getByRole("link", { name: "Open the dashboard" })).toHaveAttribute("href", "https://app.towertail.com");
  });

  test("theme tokens follow the scheme and the toggle", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(await bg()).toBe("rgb(245, 245, 247)");
    await page.locator(".theme-toggle").first().click();
    expect(await bg()).toBe("rgb(18, 18, 20)");
    await page.locator(".theme-toggle").first().click();
    expect(await bg()).toBe("rgb(245, 245, 247)");
  });
});

test("docs, changelog and the 404 page load", async ({ page }) => {
  expect((await page.goto("/docs/"))?.status()).toBe(200);
  await page.goto("/changelog/");
  await expect(page.locator("#app .rel").first()).toBeVisible();
  const res = await page.goto("/no/such/page/");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page does not exist.");
});
