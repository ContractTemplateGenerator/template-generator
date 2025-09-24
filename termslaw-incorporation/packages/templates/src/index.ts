import { z } from 'zod';
import { loadTemplate } from './lib/handlebars';

const ownerSchema = z.object({
  name: z.string().min(1).optional(),
  percent: z.number().nonnegative().optional(),
  issued: z.union([z.number(), z.string()]).optional()
});

const llcSchema = z.object({
  companyName: z.string().min(1),
  state: z.string().min(1),
  effectiveDate: z.string().min(1),
  managementStyle: z.enum(['member-managed', 'manager-managed']),
  members: z.array(ownerSchema),
  managers: z.array(z.string()).optional()
});

type LlcSchema = z.infer<typeof llcSchema>;

const corpSchema = z.object({
  companyName: z.string().min(1),
  state: z.string().min(1),
  effectiveDate: z.string().min(1),
  shareholders: z.array(ownerSchema),
  directors: z
    .array(
      z.object({
        name: z.string().optional(),
        address: z.string().optional()
      })
    )
    .default([]),
  officers: z
    .array(
      z.object({
        title: z.string().optional(),
        name: z.string().optional()
      })
    )
    .default([])
});

type CorpSchema = z.infer<typeof corpSchema>;

const llcTemplate = loadTemplate('oa/llc.hbs');
const bylawsTemplate = loadTemplate('bylaws/corp.hbs');

export function renderOperatingAgreement(input: LlcSchema): string {
  const data = llcSchema.parse(input);
  return llcTemplate({
    ...data,
    effectiveDate: data.effectiveDate,
    isManagerManaged: data.managementStyle === 'manager-managed',
    governingBody: data.managementStyle === 'manager-managed' ? 'Managers' : 'Members',
    memberNames: data.members.map(member => member.name ?? '[Name]')
  });
}

export function renderCorporateBylaws(input: CorpSchema): string {
  const data = corpSchema.parse(input);
  return bylawsTemplate({
    ...data,
    directorNames: data.directors.map(director => director.name ?? '[Director Name]')
  });
}

export type OperatingAgreementInput = LlcSchema;
export type CorporateBylawsInput = CorpSchema;

export type TemplateKind = 'llc' | 'corp';

export function renderTemplate(kind: TemplateKind, payload: LlcSchema | CorpSchema): string {
  if (kind === 'llc') {
    return renderOperatingAgreement(payload as LlcSchema);
  }
  return renderCorporateBylaws(payload as CorpSchema);
}
