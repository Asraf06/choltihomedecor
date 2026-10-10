const { chromium } = require("playwright-core");
const SHELL = "/home/mda079018/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const slowActions = async (page, urlPart, ms = 4000) => {
  await page.route("**/" + urlPart, async (route) => {
    if (route.request().method() !== "POST") { await route.continue(); return; }
    await new Promise((r) => setTimeout(r, ms));
    await route.continue();
  });
};
const clickVisible = async (page, name) => {
  await page.evaluate((n) => {
    const b = [...document.querySelectorAll("button")].find((x) => x.innerText.trim() === n && x.getBoundingClientRect().width > 0);
    b?.click();
  }, name);
};
(async () => {
  const browser = await chromium.launch({ executablePath: SHELL, args: ["--no-sandbox"] });
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  await ctx.addCookies([{ name: "cholti_admin_session", value: "loadinge2efinal1", domain: "localhost", path: "/" }]);
  const out = {};
  const errs = [];
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
  await slowActions(page, "/options");
  await page.goto("http://localhost:3001/options", { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(11000);
  await clickVisible(page, "Edit");
  await page.waitForTimeout(1500);
  await page.evaluate(() => { [...document.querySelectorAll("form button")].find((x) => x.innerText.trim() === "Save" && x.getBoundingClientRect().width > 0)?.click(); });
  await page.waitForTimeout(1500);
  console.log("URL:", page.url());
  console.log("BODY:", (await page.evaluate(() => document.body.innerText)).slice(0, 600));
  const s = await page.evaluate(() => ({
    saving: /Saving/.test(document.body.innerText),
    modalOpen: [...document.querySelectorAll("button")].some((x) => x.innerText.trim() === "Cancel" && x.getBoundingClientRect().width > 0),
    formBtns: [...document.querySelectorAll("form button")].map((x) => x.innerText.trim() + (x.disabled ? "[disabled]" : "")),
    disabled: (() => { const b = [...document.querySelectorAll("form button")].find((x) => /Save|Saving/.test(x.innerText)); return b ? b.disabled : "nobutton"; })(),
  }));
  console.log("DBG:", JSON.stringify(s));
  out.optionsModal = "dbg";
  console.log(JSON.stringify(out));
  console.log("ERRS:", errs.length ? errs.join(" | ") : "none");
  await browser.close();
})().catch((e) => { console.error("FAIL", e.message.split("\n")[0]); process.exit(1); });
