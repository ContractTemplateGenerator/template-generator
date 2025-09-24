import { renderCorporateBylaws, renderOperatingAgreement } from './index';

const llcHtml = renderOperatingAgreement({
  companyName: 'Sample Holdings LLC',
  state: 'Delaware',
  effectiveDate: new Date().toISOString().slice(0, 10),
  managementStyle: 'member-managed',
  members: [
    { name: 'Alice Founder', percent: 60, issued: 600 },
    { name: 'Bob Builder', percent: 40, issued: 400 }
  ],
  managers: []
});

const corpHtml = renderCorporateBylaws({
  companyName: 'Sample Technologies, Inc.',
  state: 'California',
  effectiveDate: new Date().toISOString().slice(0, 10),
  shareholders: [
    { name: 'Alice Founder', percent: 55, issued: 5500 },
    { name: 'Carol Capital', percent: 45, issued: 4500 }
  ],
  directors: [
    { name: 'Alice Founder', address: '123 Market St, San Francisco, CA' },
    { name: 'Carol Capital', address: '987 Mission St, San Francisco, CA' }
  ],
  officers: [
    { title: 'Chief Executive Officer', name: 'Alice Founder' },
    { title: 'Chief Financial Officer', name: 'Carol Capital' }
  ]
});

console.log('LLC Operating Agreement Preview\n', llcHtml.slice(0, 400), '...');
console.log('\nCorporate Bylaws Preview\n', corpHtml.slice(0, 400), '...');
