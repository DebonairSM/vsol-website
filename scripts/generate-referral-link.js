#!/usr/bin/env node
/**
 * Generate referral links for VSol Software referral program
 * 
 * Usage:
 *   node scripts/generate-referral-link.js "John" "Smith"
 *   node scripts/generate-referral-link.js "John" "Smith" "https://custom-domain.com"
 */

const firstName = process.argv[2];
const lastName = process.argv[3];
const baseUrl = process.argv[4] || 'https://vsol.software';

if (!firstName || !lastName) {
  console.error('Error: First name and last name are required');
  console.error('\nUsage:');
  console.error('  node scripts/generate-referral-link.js "FirstName" "LastName"');
  console.error('  node scripts/generate-referral-link.js "FirstName" "LastName" "https://custom-domain.com"');
  console.error('\nExample:');
  console.error('  node scripts/generate-referral-link.js "John" "Smith"');
  process.exit(1);
}

// Generate the encoded referral data
const referrerData = `VSOL:${firstName}:${lastName}`;
const encoded = Buffer.from(referrerData).toString('base64');
const referralUrl = `${baseUrl}/referral?ref=${encoded}`;

console.log('\n✓ Referral link generated successfully!\n');
console.log('Referrer:', `${firstName} ${lastName}`);
console.log('Encoded:', encoded);
console.log('\nReferral URL:');
console.log(referralUrl);
console.log('\n');

