import React from 'react';
import { getComplianceRequirements, getComplianceNotes, calculateDueDate, formatDueDate, getFilingCompletionMessage, getNextFilingMessage } from '../utils/complianceData';
import { STATE_NAMES } from '../utils/states';
import TaxCalculator from './TaxCalculator';
import LLCManagementExplanation from './LLCManagementExplanation';

type Props = {
  state: string;
  entity: string;
  speed?: string;
};

export default function CompliancePanel({ state, entity, speed = 'standard' }: Props) {
  const requirements = getComplianceRequirements(state, entity);
  const notes = getComplianceNotes(state, entity);

  const completionMessage = getFilingCompletionMessage(state, entity, speed);
  const nextFilingMessage = getNextFilingMessage(state, entity);

  if (requirements.length === 0) {
    return (
      <div className="card p-4 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Compliance Preview
        </h3>

        {/* Timeline Messages */}
        <div className="bg-white rounded-lg p-3 border border-blue-200 mb-3">
          <p className="text-sm text-blue-800">{completionMessage}</p>
        </div>

        <p className="text-sm text-blue-700">
          No ongoing compliance requirements found for this state/entity combination.
        </p>
      </div>
    );
  }

  const getRequirementIcon = (type: string) => {
    switch (type) {
      case 'filing': return '📄';
      case 'tax': return '💰';
      case 'license': return '📜';
      case 'publication': return '📰';
      case 'report': return '📊';
      default: return '📋';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'initial': return 'bg-green-100 text-green-800';
      case 'annual': return 'bg-blue-100 text-blue-800';
      case 'biennial': return 'bg-purple-100 text-purple-800';
      case 'one-time': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card p-4 bg-blue-50 border-blue-200">
      <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        Compliance Preview
      </h3>


      <div className="text-sm text-blue-800 mb-4">
        <strong>{STATE_NAMES[state]} {entity}</strong> requirements:
      </div>



      {/* LLC Management Structure Explanation */}
      <LLCManagementExplanation state={state} entity={entity} />

      {/* Tax Calculator */}
      <TaxCalculator state={state} entity={entity} />

    </div>
  );
}