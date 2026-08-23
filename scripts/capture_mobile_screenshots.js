const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\prana\\.gemini\\antigravity-ide\\brain\\99b76f63-8b89-44e7-832f-cf2bc507beeb';

const VIEWPORTS = [
  { name: '320px', width: 320, height: 568 },
  { name: '375px', width: 375, height: 812 },
  { name: '390px', width: 390, height: 844 },
  { name: '414px', width: 414, height: 896 }
];

const PAGES_TO_CAPTURE = [
  { name: 'hub', route: '/app' },
  { name: 'marketplace', route: '/marketplace' },
  { name: 'purchases', route: '/my-purchases' },
  { name: 'profile', route: '/profile' },
  { name: 'sell', route: '/sell' }
];

async function captureScreenshots() {
  console.log('📸 Capturing mobile screenshots for visual validation...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

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
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: true, hasTouch: true });

    for (const p of PAGES_TO_CAPTURE) {
      await page.goto(`http://localhost:3000${p.route}`, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 600));

      const screenshotFilename = `mobile_${p.name}_${vp.name}.png`;
      const screenshotPath = path.join(ARTIFACTS_DIR, screenshotFilename);

      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Saved screenshot: ${screenshotFilename}`);
    }
  }

  await browser.close();
  console.log('✅ All mobile screenshots captured successfully!');
}

captureScreenshots().catch(console.error);
