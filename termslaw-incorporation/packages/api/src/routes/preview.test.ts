import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import { previewHandler } from './preview';

vi.mock('../lib/preview', () => ({
  generatePreview: vi.fn(async () => ({
    pages: [{ pngBase64: 'ZmFrZQ==', width: 800, height: 600 }],
    pageCount: 1
  }))
}));

const basePayload = {
  state: 'DE',
  entityType: 'LLC',
  companyName: 'Test LLC',
  alternateNames: ['Alt 1'],
  managementStyle: 'member-managed',
  directors: [],
  officers: [],
  owners: [{ name: 'Owner One', percent: 100, issued: 100 }],
  packageId: 'basic',
  processingSpeed: 'standard',
  registeredAgent: true
};

describe('preview handler', () => {
  it('returns preview payload', async () => {
    const req = { body: basePayload } as unknown as Request;
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const res = { json, status } as unknown as Response;

    await previewHandler(req, res);

    expect(json).toHaveBeenCalledWith({
      pages: [{ pngBase64: 'ZmFrZQ==', width: 800, height: 600 }],
      pageCount: 1
    });
  });
});
