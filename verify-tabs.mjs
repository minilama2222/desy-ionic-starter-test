import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: true,
  executablePath: '/snap/bin/chromium',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});

const ctx = await browser.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
});
const page = await ctx.newPage();

// Visit each tab and screenshot at a slightly shorter wait
for (const tab of ['home', 'search', 'favorites', 'profile']) {
  await page.goto(`http://localhost:4200/tabs-example/${tab}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `/root/.openclaw/workspace/shots/10-tab-${tab}-verify.png`, fullPage: false });
  console.log(`OK: /root/.openclaw/workspace/shots/10-tab-${tab}-verify.png`);
}

await browser.close();