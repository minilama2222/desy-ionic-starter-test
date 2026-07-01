/**
 * Mobile-width screenshots of every page in the desy-ionic-starter-test fork.
 * Uses Playwright (already installed in node_modules). Output: /root/shots/<name>.png.
 *
 * iPhone 12 viewport: 390x844. We use 375x812 (iPhone X) for tighter mobile feel.
 */
import { chromium, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';

const PAGES = [
  { name: '01-home', url: 'http://localhost:4200/' },
  { name: '02-tramites-list', url: 'http://localhost:4200/tramites' },
  { name: '03-tramite-detail-subsanacion', url: 'http://localhost:4200/tramites/EX-2026-0042' },
  { name: '04-tramite-detail-finalizado', url: 'http://localhost:4200/tramites/EX-2026-0078' },
  { name: '05-solicitud-form-step1', url: 'http://localhost:4200/tramites/nueva' },
  { name: '06-forms-example', url: 'http://localhost:4200/forms-example' },
  { name: '07-list-example', url: 'http://localhost:4200/list-example' },
  { name: '08-tabs-example-home', url: 'http://localhost:4200/tabs-example/home' }
];

const VIEWPORT = { width: 375, height: 812 };

async function main() {
  await mkdir('/root/shots', { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/snap/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const context = await browser.newContext({
    ...devices['iPhone X'],
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: devices['iPhone X'].userAgent
  });
  const page = await context.newPage();

  // Surface console errors so we can flag them in the diagnostic.
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(`pageerror: ${err.message}`);
  });

  for (const target of PAGES) {
    process.stdout.write(`→ ${target.name} (${target.url}) ... `);
    try {
      await page.goto(target.url, { waitUntil: 'networkidle', timeout: 30000 });
      // Give Angular a beat to settle and lazy chunks to mount.
      await page.waitForTimeout(800);
      const file = `/root/shots/${target.name}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log(`OK (${file})`);
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
    }
  }

  // Capture the solicitud-form on step 2 and step 3 too (different visuals).
  try {
    process.stdout.write('→ 05b-solicitud-form-step2 ... ');
    await page.goto('http://localhost:4200/tramites/nueva', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /continuar/i }).first().click({ trial: false }).catch(() => {});
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/root/shots/05b-solicitud-form-step2.png', fullPage: true });
    console.log('OK');
  } catch (err) {
    console.log(`FAIL: ${err.message}`);
  }

  try {
    process.stdout.write('→ 05c-solicitud-form-step3 ... ');
    // Re-navigate and walk to step 3
    await page.goto('http://localhost:4200/tramites/nueva', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /continuar/i }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /continuar/i }).first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/root/shots/05c-solicitud-form-step3.png', fullPage: true });
    console.log('OK');
  } catch (err) {
    console.log(`FAIL: ${err.message}`);
  }

  // Also try the tabs-example/search tab
  try {
    process.stdout.write('→ 09-tabs-example-search ... ');
    await page.goto('http://localhost:4200/tabs-example/search', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: '/root/shots/09-tabs-example-search.png', fullPage: true });
    console.log('OK');
  } catch (err) {
    console.log(`FAIL: ${err.message}`);
  }

  await browser.close();

  if (consoleErrors.length > 0) {
    console.log('\n=== Console errors detected ===');
    for (const e of consoleErrors) console.log(' - ' + e);
  } else {
    console.log('\nNo console errors.');
  }
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});