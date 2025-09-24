import { describe, expect, it } from 'vitest';
import { renderCorporateBylaws, renderOperatingAgreement } from './index';

describe('templates', () => {
  it('renders an LLC agreement with manager-managed clause', () => {
    const html = renderOperatingAgreement({
      companyName: 'Demo LLC',
      state: 'Delaware',
      effectiveDate: '2024-01-01',
      managementStyle: 'manager-managed',
      members: [
        { name: 'Alex', percent: 70, issued: 700 },
        { name: 'Casey', percent: 30, issued: 300 }
      ],
      managers: ['Alex Manager']
    });
    expect(html).toContain('Demo LLC Operating Agreement');
    expect(html).toContain('The Company shall be managed by one or more Managers');
    expect(html).toContain('Alex Manager');
  });

  it('renders corporate bylaws with directors and officers', () => {
    const html = renderCorporateBylaws({
      companyName: 'Demo Inc.',
      state: 'California',
      effectiveDate: '2024-01-01',
      shareholders: [{ name: 'Alex', percent: 100, issued: 1000 }],
      directors: [{ name: 'Alex', address: '123 Main St' }],
      officers: [{ title: 'CEO', name: 'Alex' }]
    });
    expect(html).toContain('Demo Inc. Corporate Bylaws');
    expect(html).toContain('Board of Directors');
    expect(html).toContain('CEO — Alex');
  });
});
