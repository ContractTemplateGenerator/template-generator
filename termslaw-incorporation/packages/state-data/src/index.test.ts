import { describe, expect, it } from 'vitest';
import { DEFAULT_STATE, getStateInfo, STATE_CODES } from './index';

describe('state data', () => {
  it('includes default state', () => {
    expect(DEFAULT_STATE).toBe('DE');
    const info = getStateInfo(DEFAULT_STATE);
    expect(info.standardDays).toBeGreaterThan(0);
  });

  it('has 50 state codes', () => {
    expect(STATE_CODES.length).toBe(50);
  });
});
