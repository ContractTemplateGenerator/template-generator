import { z } from 'zod';

const OwnerSchema = z.object({
  name: z.string().min(1),
  percent: z.number().nonnegative(),
  issued: z.union([z.number(), z.string()])
});

const AlternateNamesSchema = z
  .array(z.string().trim())
  .max(3)
  .optional()
  .default([])
  .transform(names => names.filter(name => name.length > 0));

const DirectorSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional()
});

const OfficerSchema = z.object({
  title: z.string().optional(),
  name: z.string().optional()
});

export const IntakeSchema = z.object({
  state: z.string().length(2),
  entityType: z.enum(['LLC', 'C-Corp', 'S-Corp']),
  companyName: z.string().min(1),
  alternateNames: AlternateNamesSchema,
  managementStyle: z.enum(['member-managed', 'manager-managed']).optional(),
  directors: z.array(DirectorSchema).default([]),
  officers: z.array(OfficerSchema).default([]),
  owners: z.array(OwnerSchema).min(1),
  packageId: z.enum(['basic', 'pro', 'complete']),
  processingSpeed: z.enum(['standard', 'expedited', 'rush']),
  registeredAgent: z.boolean().default(true)
});

export type Intake = z.infer<typeof IntakeSchema>;

export function asTemplateKind(entityType: Intake['entityType']): 'llc' | 'corp' {
  return entityType === 'LLC' ? 'llc' : 'corp';
}
