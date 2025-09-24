import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { IntakeSchema } from '../types/intake';

export async function generateHandler(req: Request, res: Response) {
  try {
    // Validate intake for future processing
    IntakeSchema.parse(req.body);
    const jobId = randomUUID();
    res.json({ jobId, status: 'pending', message: 'Stripe integration TODO' });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid payload' });
  }
}
