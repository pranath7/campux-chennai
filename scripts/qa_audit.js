/**
 * Comprehensive End-to-End Production Readiness & QA Audit Test Suite
 */

const BASE_URL = 'http://localhost:3000';

async function runAudit() {
  console.log('================================================================================');
  console.log('🚀 CAMPUX CHENNAI — AUTOMATED PRODUCTION SECURITY & E2E QA AUDIT');
  console.log('================================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // TEST 1: Public Landing Page & Headers
  // ---------------------------------------------------------------------------
  console.log('▶ [1/10] Testing Public Landing Page & Security Headers...');
  const resHome = await fetch(`${BASE_URL}/`);
  assert(resHome.status === 200, 'Public landing page returns 200 OK');
  assert(resHome.headers.get('x-frame-options') === 'SAMEORIGIN', 'Security Header X-Frame-Options configured');
  assert(resHome.headers.get('x-content-type-options') === 'nosniff', 'Security Header X-Content-Type-Options is nosniff');

  // ---------------------------------------------------------------------------
  // TEST 2: Student Registration & Validation
  // ---------------------------------------------------------------------------
  console.log('\n▶ [2/10] Testing Student Registration & Validation...');
  const uniqueMobile = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Aravind Swaminathan',
      mobile: uniqueMobile,
      password: 'StrongStudentPass123!',
      collegeId: 'dgvaishnav',
      courseId: 'dgvc_bcom_gen',
      year: 2,
      section: 'B',
    }),
  });
  const regData = await regRes.json();
  assert(regRes.status === 200 && regData.success, 'Student registration succeeds with valid data');
  const rawBuyerCookie = regRes.headers.get('set-cookie');
  const buyerCookie = rawBuyerCookie ? rawBuyerCookie.split(';')[0] : '';
  assert(!!buyerCookie, 'Session cookie issued upon registration');

  // ---------------------------------------------------------------------------
  // TEST 3: Student Login & Bad Password Defense
  // ---------------------------------------------------------------------------
  console.log('\n▶ [3/10] Testing Authentication Defense (Invalid Password)...');
  const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: uniqueMobile,
      password: 'WrongPassword!',
    }),
  });
  assert(badLoginRes.status === 401, 'Login correctly rejects incorrect password with 401 Unauthorized');

  // ---------------------------------------------------------------------------
  // TEST 4: Student Session Verification (/api/auth/me)
  // ---------------------------------------------------------------------------
  console.log('\n▶ [4/10] Testing Session Verification (/api/auth/me)...');
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: buyerCookie || '' },
  });
  const meData = await meRes.json();
  assert(meRes.status === 200 && meData.user?.mobile === uniqueMobile, 'Session verified and user profile retrieved');

  // ---------------------------------------------------------------------------
  // TEST 5: Admin Route Protection (Denying Normal Students)
  // ---------------------------------------------------------------------------
  console.log('\n▶ [5/10] Testing Admin API Protection (Student cannot perform admin actions)...');
  const studentAdminRes = await fetch(`${BASE_URL}/api/admin/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: buyerCookie || '' },
    body: JSON.stringify({ action: 'APPROVE_PAYMENT', targetId: 'sub_test' }),
  });
  assert(studentAdminRes.status === 401, 'Admin API rejects non-admin student request with 401');

  // ---------------------------------------------------------------------------
  // TEST 6: Master Admin Authentication
  // ---------------------------------------------------------------------------
  console.log('\n▶ [6/10] Testing Master Admin Authentication (/api/admin/auth/login)...');
  const adminLoginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@campux.in',
      password: 'admin123',
    }),
  });
  const adminLoginData = await adminLoginRes.json();
  assert(adminLoginRes.status === 200 && adminLoginData.success, 'Master admin logs in successfully');
  const rawAdminCookie = adminLoginRes.headers.get('set-cookie');
  const adminCookie = rawAdminCookie ? rawAdminCookie.split(';')[0] : '';
  assert(!!adminCookie, 'Admin session cookie issued');

  // ---------------------------------------------------------------------------
  // TEST 7: Marketplace Listing Retrieval & Catalog Filtering
  // ---------------------------------------------------------------------------
  console.log('\n▶ [7/10] Testing Marketplace Query & Catalog Filtering...');
  const listingsRes = await fetch(`${BASE_URL}/api/listings`);
  const listingsData = await listingsRes.json();
  assert(listingsRes.status === 200 && listingsData.listings?.length > 0, 'Marketplace returns verified listings');
  const sampleListing = listingsData.listings[0];

  // ---------------------------------------------------------------------------
  // TEST 8: Purchase Order Creation & Payment Submission
  // ---------------------------------------------------------------------------
  console.log('\n▶ [8/10] Testing Purchase Creation & UTR Submission...');
  const utrTest = `UTR${Date.now().toString().slice(-8)}`;
  const checkoutRes = await fetch(`${BASE_URL}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: buyerCookie || '' },
    body: JSON.stringify({
      listingId: sampleListing.id,
      utrId: utrTest,
      screenshotUrl: 'https://images.unsplash.com/photo-sample-proof.png',
    }),
  });
  const checkoutData = await checkoutRes.json();
  assert(checkoutRes.status === 200 && checkoutData.success, 'Payment submitted with UTR and awaiting admin verification');
  const submissionId = checkoutData.submissionId || checkoutData.submission?.id;

  // ---------------------------------------------------------------------------
  // TEST 9: Resource Download Authorization (Locked before Approval)
  // ---------------------------------------------------------------------------
  console.log('\n▶ [9/10] Testing Resource Access Control (Locked before verification)...');
  const lockedDownloadRes = await fetch(`${BASE_URL}/api/resources/${sampleListing.id}/download`, {
    headers: { Cookie: buyerCookie || '' },
  });
  assert(lockedDownloadRes.status === 403, 'Resource remains locked (403 Forbidden) before admin approves payment');

  // ---------------------------------------------------------------------------
  // TEST 10: Admin Idempotent Approval & Resource Unlock
  // ---------------------------------------------------------------------------
  console.log('\n▶ [10/10] Testing Admin Payment Approval & Immediate Resource Unlock...');
  console.log('  Debug submissionId:', submissionId);
  const approveRes = await fetch(`${BASE_URL}/api/admin/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie || '' },
    body: JSON.stringify({
      action: 'APPROVE_PAYMENT',
      targetId: submissionId,
    }),
  });
  const approveData = await approveRes.json();
  console.log('  Debug approve status:', approveRes.status, 'approveData:', approveData);
  assert(approveRes.status === 200 && approveData.success, 'Admin approved payment successfully');

  // Re-verify resource download now unlocked
  const unlockedDownloadRes = await fetch(`${BASE_URL}/api/resources/${sampleListing.id}/download`, {
    headers: { Cookie: buyerCookie || '' },
  });
  assert(unlockedDownloadRes.status === 200, 'Resource is unlocked (200 OK) with student license delivery');

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n================================================================================');
  console.log(`📊 AUDIT RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
