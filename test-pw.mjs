import { chromium } from 'playwright';
const b = await chromium.launch({
  headless: true,
  executablePath: '/snap/bin/chromium',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});
console.log('launched ok');
const ctx = await b.newContext();
const p = await ctx.newPage();
await p.goto('http://localhost:4200/', { waitUntil: 'networkidle' });
await p.screenshot({ path: '/root/shots/test.png', fullPage: true });
console.log('shot saved');
await b.close();
