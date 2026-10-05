const { chromium } = require('playwright-core');
const SHELL = '/home/mda079018/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
(async () => {
  const browser = await chromium.launch({ executablePath: SHELL, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  await ctx.addCookies([{ name: 'cholti_admin_session', value: 'gallerytoken1234567890ab', domain: 'localhost', path: '/' }]);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 150)));
  await page.goto('http://localhost:3001/products', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(8000);
  await page.getByRole('button', { name: /Add product/ }).click({ timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.locator('input[name="slug"]').fill('gallery-test');
  await page.locator('input[name="name"]').fill('Gallery Test');
  await page.locator('input[name="old"]').fill('1000');
  await page.locator('input[name="now"]').fill('800');
  // open gallery manager
  await page.getByRole('button', { name: /Tap to add photos/ }).click({ timeout: 15000 });
  await page.waitForTimeout(1500);
  let t = await page.evaluate(() => document.body.innerText);
  console.log('picker:', /Tap to select pictures/.test(t) ? 'PASS' : 'FAIL');
  // multi-select 2 files at once
  await page.locator('input[type=file]').setInputFiles(['/tmp/t.png', '/tmp/t2.png']);
  await page.waitForTimeout(2500);
  t = await page.evaluate(() => document.body.innerText);
  const m = t.match(/Done \((\d+)\)/);
  console.log('multi-staged:', m ? 'PASS(' + m[1] + ')' : 'FAIL');
  await page.screenshot({ path: '/tmp/gallery.png' });
  if (m) {
    await page.getByRole('button', { name: new RegExp('Done \\(' + m[1] + '\\)') }).click({ timeout: 15000 });
    await page.waitForTimeout(1500);
  }
  await page.getByRole('button', { name: /^Save$/ }).click({ timeout: 15000 });
  await page.waitForTimeout(6000);
  t = await page.evaluate(() => document.body.innerText);
  console.log('saved:', /Gallery Test/.test(t) ? 'PASS' : 'FAIL');
  console.log('ERRS:', errs.length ? errs.join(' | ') : 'none');
  await browser.close();
})().catch((e) => { console.error('FAIL', e.message.split('\n')[0]); process.exit(1); });
