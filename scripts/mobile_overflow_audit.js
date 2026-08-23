const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORTS = [
  { name: '320px (iPhone SE 1st gen)', width: 320, height: 568 },
  { name: '360px (Galaxy S8/S9/Android)', width: 360, height: 800 },
  { name: '375px (iPhone X/11 Pro/12 Mini)', width: 375, height: 812 },
  { name: '390px (iPhone 12/13/14 Pro)', width: 390, height: 844 },
  { name: '414px (iPhone XR/11/Plus)', width: 414, height: 896 },
];

const ROUTES = [
  '/',
  '/app',
  '/marketplace',
  '/profile',
  '/my-purchases',
  '/seller',
  '/sell',
  '/study-groups',
  '/announcements',
  '/login',
  '/coming-soon'
];

async function runAudit() {
  console.log('================================================================================');
  console.log('🔍 RUNNING LIVE HEADLESS CHROME MOBILE OVERFLOW AUDIT');
  console.log('================================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const results = [];

  // Set mock logged in cookies/localStorage
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const mockUser = {
      id: 'usr_mock_123',
      fullName: 'Pranath Jain',
      email: 'pranath.jain@dgvaishnav.edu.in',
      mobile: '9876543210',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      profile: {
        collegeId: 'dgvaishnav',
        collegeName: 'DG Vaishnav College',
        courseId: 'dgvc_bcom_gen',
        courseName: 'B.Com General',
        year: 1,
        section: 'B',
        verifiedBadge: true,
        credibilityScore: 85,
        rating: 4.9,
        reviewCount: 12,
        resourcesSoldCount: 8,
        totalEarnings: 1450,
      },
      college: {
        id: 'dgvaishnav',
        name: 'DG Vaishnav College',
        shortName: 'DG Vaishnav',
        domain: 'dgvaishnav.edu.in',
      }
    };
    localStorage.setItem('campux_user_cache', JSON.stringify(mockUser));
  });

  for (const vp of VIEWPORTS) {
    console.log(`\n📱 TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
    console.log('--------------------------------------------------------------------------------');

    await page.setViewport({ width: vp.width, height: vp.height, isMobile: true, hasTouch: true });

    for (const route of ROUTES) {
      const url = `http://localhost:3000${route}`;
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
        await new Promise(r => setTimeout(r, 600)); // Allow render

        const audit = await page.evaluate((vpWidth) => {
          const scrollWidth = document.documentElement.scrollWidth;
          const innerWidth = window.innerWidth;
          const bodyWidth = document.body.scrollWidth;

          // Helper to check if an element is inside an overflow-clipped ancestor
          function isClippedByAncestor(el) {
            let parent = el.parentElement;
            while (parent && parent !== document.body && parent !== document.documentElement) {
              const style = window.getComputedStyle(parent);
              const ox = style.overflowX;
              const pRect = parent.getBoundingClientRect();
              if ((ox === 'auto' || ox === 'hidden' || ox === 'scroll' || ox === 'clip') && pRect.width <= innerWidth + 1 && pRect.right <= innerWidth + 1) {
                return true;
              }
              parent = parent.parentElement;
            }
            return false;
          }

          // Find every uncontained overflowing element
          const overflowing = [];
          const allEls = document.querySelectorAll('*');
          for (const el of allEls) {
            const rect = el.getBoundingClientRect();
            if (rect.right > innerWidth + 1 || rect.left < -1 || el.scrollWidth > innerWidth + 1) {
              if (!isClippedByAncestor(el)) {
                overflowing.push({
                  tagName: el.tagName.toLowerCase(),
                  id: el.id || '',
                  className: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
                  textContent: (el.textContent || '').trim().slice(0, 40),
                  rectWidth: Math.round(rect.width),
                  rectLeft: Math.round(rect.left),
                  rectRight: Math.round(rect.right),
                  scrollWidth: el.scrollWidth,
                });
              }
            }
          }

          const hasOverflow = scrollWidth > innerWidth + 1 || bodyWidth > innerWidth + 1 || overflowing.length > 0;

          return {
            scrollWidth,
            innerWidth,
            bodyWidth,
            hasOverflow,
            overflowingElements: overflowing.slice(0, 10),
          };
        }, vp.width);

        const status = audit.hasOverflow ? '❌ OVERFLOW' : '✅ PASS';
        console.log(`  ${status} Route: ${route.padEnd(18)} | scrollWidth: ${audit.scrollWidth}px vs innerWidth: ${audit.innerWidth}px`);

        if (audit.hasOverflow) {
          console.log(`     🚨 Found ${audit.overflowingElements.length} uncontained overflowing elements:`);
          for (const item of audit.overflowingElements) {
            console.log(`       - <${item.tagName}> class="${item.className}" width=${item.rectWidth}px, right=${item.rectRight}px, scrollWidth=${item.scrollWidth}px ("${item.textContent}")`);
          }
        }

        results.push({
          viewport: vp.name,
          route,
          ...audit,
        });
      } catch (err) {
        console.log(`  ⚠️ ERROR on ${route}: ${err.message}`);
      }
    }
  }

  await browser.close();

  const totalTests = results.length;
  const failedTests = results.filter(r => r.hasOverflow).length;
  console.log('\n================================================================================');
  console.log(`📊 LIVE AUDIT SUMMARY: ${totalTests - failedTests}/${totalTests} Passed | ${failedTests} Failed`);
  console.log('================================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
