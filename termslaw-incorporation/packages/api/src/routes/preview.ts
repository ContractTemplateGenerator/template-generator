import type { Request, Response } from 'express';
import { renderCorporateBylaws, renderOperatingAgreement } from '@termslaw/templates';
import { IntakeSchema, asTemplateKind } from '../types/intake';
import { buildCorporateBylawsPayload, buildOperatingAgreementPayload } from '../lib/transformers';
import { generatePreview } from '../lib/preview';

export async function previewHandler(req: Request, res: Response) {
  try {
    const intake = IntakeSchema.parse(req.body);
    const templateKind = asTemplateKind(intake.entityType);
    const html =
      templateKind === 'llc'
        ? renderOperatingAgreement(buildOperatingAgreementPayload(intake))
        : renderCorporateBylaws(buildCorporateBylawsPayload(intake));

    const preview = await generatePreview(html);
    res.json(preview);
  } catch (error) {
    console.error('Preview generation failed', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid payload' });
  }
}
