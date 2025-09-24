import type { CorporateBylawsInput, OperatingAgreementInput } from '@termslaw/templates';
import type { Intake } from '../types/intake';

export function buildOperatingAgreementPayload(intake: Intake): OperatingAgreementInput {
  const effectiveDate = new Date().toISOString().slice(0, 10);
  return {
    companyName: intake.companyName,
    state: intake.state,
    effectiveDate,
    managementStyle: intake.managementStyle ?? 'member-managed',
    members: intake.owners.map(owner => ({
      name: owner.name,
      percent: owner.percent,
      issued: owner.issued
    })),
    managers: intake.managementStyle === 'manager-managed'
      ? intake.owners.map(owner => owner.name)
      : []
  };
}

export function buildCorporateBylawsPayload(intake: Intake): CorporateBylawsInput {
  const effectiveDate = new Date().toISOString().slice(0, 10);
  return {
    companyName: intake.companyName,
    state: intake.state,
    effectiveDate,
    shareholders: intake.owners.map(owner => ({
      name: owner.name,
      percent: owner.percent,
      issued: owner.issued
    })),
    directors: intake.directors,
    officers: intake.officers
  };
}
