import { z } from 'zod';

export const StateInfoSchema = z.object({
  filingFeeLLC: z.number().nonnegative(),
  filingFeeCorp: z.number().nonnegative(),
  expediteAvailable: z.boolean(),
  rushAvailable: z.boolean(),
  standardDays: z.number().int().positive(),
  expediteDeltaDays: z.number().int(),
  rushDeltaDays: z.number().int(),
  notes: z.string().optional(),
  sources: z.array(z.string().url())
});

export type StateInfo = z.infer<typeof StateInfoSchema>;

export const StateDataSchema = z.record(z.string(), StateInfoSchema);
