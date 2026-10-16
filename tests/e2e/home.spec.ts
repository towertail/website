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

  test("the waitlist form signs up with the Turnstile test key", async ({ page }, info) => {
    // One project is enough, and the Worker allows only 5 sign-ups per minute.
    test.skip(info.project.name !== "desktop-dark", "runs in desktop-dark only");
    await page.goto("/#cloud");
    await page.getByLabel("Email").fill(`e2e-${Date.now()}@example.com`);
    await page.waitForFunction(() => {
      const input = document.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]');
      return !!input?.value;
    }, undefined, { timeout: 20_000 });
    await page.getByRole("button", { name: "Join the waitlist" }).click();
    await expect(page.getByText("You are on the list.")).toBeVisible();
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
