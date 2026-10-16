// Render public/og/default.png from og.html. Run: node scripts/og/render.mjs
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";

const here = new URL(".", import.meta.url);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(new URL("og.html", here).href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: fileURLToPath(new URL("../../public/og/default.png", here)) });
await browser.close();
