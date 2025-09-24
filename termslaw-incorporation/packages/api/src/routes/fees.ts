import type { Request, Response } from 'express';
import { STATE_DATA } from '@termslaw/state-data';

export function feesHandler(_req: Request, res: Response) {
  res.json(STATE_DATA);
}
