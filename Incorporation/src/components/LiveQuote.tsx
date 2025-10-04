import React from "react";
import { type Owner } from "./OwnershipRow";
import { SPEEDS, type SpeedId } from "./SpeedSelector";
import { STATE_NAMES } from "../utils/states";
import { getProcessingTimeline } from "../utils/businessDays";
import { getComplianceRequirements, getComplianceNotes, calculateDueDate, formatDueDate } from '../utils/complianceData';

declare global {
  interface Window {
    paypal?: any;
  }
}

// Helper functions for formation documents
function getFormationDocumentName(state: string, entity: string): string {
  const stateDocuments: Record<string, Record<string, string>> = {
    'DE': { 'LLC': 'Certificate of Formation', 'Corp': 'Certificate of Incorporation', 'PBC': 'Certificate of Incorporation (PBC)', 'PC': 'Certificate of Incorporation (PC)' },
    'CA': { 'LLC': 'Articles of Organization', 'Corp': 'Articles of Incorporation', 'PBC': 'Articles of Incorporation (PBC)', 'PC': 'Articles of Incorporation (PC)' },
    'NY': { 'LLC': 'Articles of Organization', 'Corp': 'Certificate of Incorporation', 'PBC': 'Certificate of Incorporation (PBC)', 'PC': 'Certificate of Incorporation (PC)' },
    'TX': { 'LLC': 'Certificate of Formation', 'Corp': 'Certificate of Formation', 'PBC': 'Certificate of Formation (PBC)', 'PC': 'Certificate of Formation (PC)' },
    'FL': { 'LLC': 'Articles of Organization', 'Corp': 'Articles of Incorporation', 'PBC': 'Articles of Incorporation (PBC)', 'PC': 'Articles of Incorporation (PC)' },
    'WA': { 'LLC': 'Certificate of Formation', 'Corp': 'Articles of Incorporation', 'PBC': 'Articles of Incorporation (PBC)', 'PC': 'Articles of Incorporation (PC)' },
    'CO': { 'LLC': 'Articles of Organization', 'Corp': 'Articles of Incorporation', 'PBC': 'Articles of Incorporation (PBC)', 'PC': 'Articles of Incorporation (PC)' },
    'NV': { 'LLC': 'Articles of Organization', 'Corp': 'Articles of Incorporation', 'PBC': 'Articles of Incorporation (PBC)', 'PC': 'Articles of Incorporation (PC)' },
    'OR': { 'LLC': 'Articles of Organization', 'Corp': 'Articles of Incorporation', 'PBC': 'Articles of Incorporation (PBC)', 'PC': 'Articles of Incorporation (PC)' },
    'UT': { 'LLC': 'Articles of Organization', 'Corp': 'Articles of Incorporation', 'PBC': 'Articles of Incorporation (PBC)', 'PC': 'Articles of Incorporation (PC)' }
  };

  return stateDocuments[state]?.[entity] || 'Articles of Incorporation';
}

function getFormationDocumentUrl(state: string, entity: string): string {
  const documentUrls: Record<string, Record<string, string>> = {
    'DE': {
      'LLC': 'https://corpfiles.delaware.gov/LLCFormation.pdf',
      'Corp': 'https://corpfiles.delaware.gov/incstk.pdf',
      'PBC': 'https://corpfiles.delaware.gov/PBC_Inc.pdf',
      'PC': 'https://corpfiles.delaware.gov/incstk.pdf'
    },
    'CA': {
      'LLC': 'https://www.sos.ca.gov/business-programs/cannabizfile/cannabis-forms-and-fees/limited-liability-companies-llc-california',
      'Corp': 'https://www.sos.ca.gov/business-programs/business-entities/forms/corporations-california-domestic',
      'PBC': 'https://www.sos.ca.gov/business-programs/business-entities/forms/corporations-california-domestic',
      'PC': 'https://bpd.dca.ca.gov/about_us/forms.shtml'
    },
    'NY': {
      'LLC': 'https://dos.ny.gov/system/files/documents/2023/03/1336-f.pdf',
      'Corp': 'https://dos.ny.gov/system/files/documents/2023/03/1239-f.pdf',
      'PBC': 'https://dos.ny.gov/benefit-corporation-certificate-incorporation-domestic-business-corporations',
      'PC': 'https://dos.ny.gov/system/files/documents/2023/03/1319-f.pdf'
    },
    'TX': {
      'LLC': 'https://www.sos.state.tx.us/corp/forms/205_boc.pdf',
      'Corp': 'https://www.sos.state.tx.us/corp/forms/201_boc.pdf',
      'PBC': 'https://www.sos.state.tx.us/corp/forms/201_boc.pdf',
      'PC': 'https://www.sos.state.tx.us/corp/forms/301_boc.pdf'
    },
    'FL': {
      'LLC': 'https://files.floridados.gov/media/703329/cr2e047.pdf',
      'Corp': 'https://files.floridados.gov/media/703307/articlesofincorporation.pdf',
      'PBC': 'https://dos.myflorida.com/sunbiz/forms/miscellaneous-forms/',
      'PC': 'https://floridasupremecourt.org/content/download/526238/5952134/AOSC13-24.pdf'
    },
    'CO': {
      'LLC': 'https://www.coloradosos.gov/pubs/business/sampleForms/ARTINC_PCPBC.pdf',
      'Corp': 'https://www.coloradosos.gov/pubs/business/sampleForms/ARTINC_PCPBC.pdf',
      'PBC': 'https://www.coloradosos.gov/pubs/business/sampleForms/ARTINC_PCPBC.pdf',
      'PC': 'https://www.coloradosos.gov/pubs/business/sampleForms/ARTINC_PCPBC.pdf'
    },
    'NV': {
      'LLC': 'https://www.nvsos.gov/sos/businesses/start-a-business/limited-liability-company',
      'Corp': 'https://www.nvsos.gov/sos/businesses/start-a-business/corporation',
      'PBC': 'https://www.leg.state.nv.us/nrs/NRS-078B.html',
      'PC': 'https://www.nvsos.gov/sos/businesses/start-a-business/professional-corporation'
    },
    'WY': {
      'LLC': 'https://sos.wyo.gov/forms/business/llc/llc-articlesorganization.pdf',
      'Corp': 'https://sos.wyo.gov/forms/default.aspx',
      'PBC': 'https://sos.wyo.gov/forms/default.aspx',
      'PC': 'https://sos.wyo.gov/Forms/WyoBiz/17-29-403.pdf'
    },
    'GA': {
      'LLC': 'https://sos.ga.gov/sites/default/files/forms/filing_template_-_articles_of_organization_for_llc_cd_030.pdf',
      'Corp': 'https://sos.ga.gov/sites/default/files/forms/Filing%20Procedure%20-%20Corporation.pdf',
      'PBC': 'https://sos.ga.gov/sites/default/files/forms/Filing%20Procedure%20-%20Corporation.pdf',
      'PC': 'https://sos.ga.gov/sites/default/files/forms/Filing%20Procedure%20-%20Corporation.pdf'
    },
    'AZ': {
      'LLC': 'https://www.azcc.gov/docs/default-source/corps-files/forms/l010-articles-of-organization.pdf',
      'Corp': 'https://azcc.gov/docs/default-source/corps-files/forms/c010-articles-of-incorporation-for-profit3ae99388b11040309af797ff41729563.pdf',
      'PBC': 'https://assets.ctfassets.net/l575jm7617lt/5WTEbBShMXikU7Zl8EILy/1380965794936d9c8393645e6856bdb0/Arizona_B_Corp_How-to-Guide.pdf',
      'PC': 'https://azcc.gov/docs/default-source/corps-files/forms/pc010-articles-of-incorporation-professional-corporationc8bfc6fb63c84e32b3c6b8e8d7bb6ce6.pdf'
    },
    'MT': {
      'LLC': 'https://biz.sosmt.gov/forms',
      'Corp': 'https://d2l2jhoszs7d12.cloudfront.net/state/Montana/Secretary%20of%20State/www.sos.mt.gov/Business%20Services/Business%20Forms/Domestic%20Profit%20Corporation/34-Domestic_Profit_Corporation_Articles_of_Incorporation.pdf',
      'PBC': 'https://d2l2jhoszs7d12.cloudfront.net/state/Montana/Secretary%20of%20State/www.sos.mt.gov/Business%20Services/Business%20Forms/Domestic%20Profit%20Corporation/34-Domestic_Profit_Corporation_Articles_of_Incorporation.pdf',
      'PC': 'https://biz.sosmt.gov/forms'
    }
  };

  return documentUrls[state]?.[entity] || 'https://terms.law';
}

type Props = {
  state: string;
  entity: string;
  primaryName: string;
  alts: string[];
  owners: Owner[];
  speed: SpeedId;
  onSpeedChange: (speed: SpeedId) => void;
  registeredAgent: boolean;
  einAssistance: boolean;
  expeditedProcessing: boolean;
  resalePermit: boolean;
  bankingResolution: boolean;
  consultation: boolean;
  sCorpElection: boolean;
  customDocuments: boolean;
  authorizedShares: number;
  issuedShares: number;
  totalGrossAssets: number;
  onIssuedSharesChange: (shares: number) => void;
  onTotalGrossAssetsChange: (assets: number) => void;
  onAuthorizedSharesChange?: (shares: number) => void;
  delawareTax: any;
};

const PRICING = {
  packages: {
    basic: 299,
    standard: 449,
    premium: 649
  },
  stateFees: {
    DE: { LLC: 90, Corp: 89, PBC: 89, PC: 89 },
    CA: { LLC: 70, Corp: 100, PBC: 100, PC: 100 },
    NV: { LLC: 75, Corp: 75, PBC: 75, PC: 75 },
    WY: { LLC: 100, Corp: 100, PBC: 100, PC: 100 },
    TX: { LLC: 300, Corp: 300, PBC: 300, PC: 300 },
    FL: { LLC: 125, Corp: 70, PBC: 70, PC: 70 },
    NY: { LLC: 200, Corp: 125, PBC: 125, PC: 125 },
    GA: { LLC: 100, Corp: 100, PBC: 100, PC: 100 },
    CO: { LLC: 50, Corp: 50, PBC: 50, PC: 50 },
    AZ: { LLC: 50, Corp: 60, PBC: 60, PC: 60 },
    MT: { LLC: 70, Corp: 70, PBC: 70, PC: 70 }
  } as Record<string, Record<string, number>>,
  services: {
    registeredAgent: 149, // Default for most states, DE is $99
    einAssistance: 89,
    expeditedProcessing: 200,
    resalePermit: 99,
    bankingResolution: 79,
    consultation: 125,
    sCorpElection: 150,
    customDocuments: 299
  }
};

export default function LiveQuote(props: Props) {
  const [showDelawareTaxCalc, setShowDelawareTaxCalc] = React.useState(false);
  const [showCaliforniaTaxCalc, setShowCaliforniaTaxCalc] = React.useState(false);
  const [showCALLCFeeCalc, setShowCALLCFeeCalc] = React.useState(false);
  const [caIncomeAmount, setCaIncomeAmount] = React.useState(250000);
  const [showAllRequirements, setShowAllRequirements] = React.useState(false);
  const [showFDAPHelp, setShowFDAPHelp] = React.useState(false);
  const [showECIHelp, setShowECIHelp] = React.useState(false);
  const [showBOIDetails, setShowBOIDetails] = React.useState(false);
  const [showBOIAccessInfo, setShowBOIAccessInfo] = React.useState(false);
  const timeline = getProcessingTimeline(props.speed);
  const requirements = getComplianceRequirements(props.state, props.entity);
  const notes = getComplianceNotes(props.state, props.entity);

  // Helper to determine if entity is domestic (formed in US) vs foreign (formed abroad, registering in US)
  const isDomesticEntity = () => {
    // For now, assume all selections are domestic US entities
    // This could be enhanced with a foreign entity checkbox/selector
    return true;
  };

  // Standardized compliance metadata helpers
  const getReportRequired = (state: string, entity: string) => {
    if (state === 'TX') return 'No (SOS reports)';
    return 'Yes';
  };

  const getReportName = (state: string, entity: string) => {
    const reportNames: Record<string, string> = {
      'DE': 'Annual Report',
      'CA': entity === 'Corp' ? 'Statement of Information' : 'Statement of Information',
      'NV': 'Annual List',
      'WY': 'Annual Report',
      'TX': 'No SOS report',
      'FL': 'Annual Report',
      'NY': 'Biennial Statement',
      'GA': 'Annual Registration',
      'CO': 'Periodic Report',
      'AZ': 'Annual Report',
      'MT': 'Annual Report'
    };
    return reportNames[state] || 'Annual Report';
  };

  const getReportFrequency = (state: string, entity: string) => {
    if (state === 'TX') return 'N/A';
    if (state === 'CA') return entity === 'Corp' ? 'Annual' : 'Biennial';
    if (state === 'NY') return 'Biennial';
    return 'Annual';
  };

  const getDueDateRule = (state: string, entity: string) => {
    const dueDates: Record<string, string> = {
      'DE': 'March 1st',
      'CA': 'End of anniversary month',
      'NV': 'Last day of anniversary month',
      'WY': 'First day of anniversary month',
      'TX': 'N/A',
      'FL': 'May 1st',
      'NY': 'Biennial anniversary',
      'GA': 'April 1st',
      'CO': 'End of anniversary month',
      'AZ': 'April 15th',
      'MT': 'April 15th'
    };
    return dueDates[state] || 'Anniversary month';
  };

  const getFilingFee = (state: string, entity: string) => {
    const fees: Record<string, Record<string, string>> = {
      'DE': { LLC: '$300', Corp: '$50' },
      'CA': { LLC: '$20', Corp: '$25' },
      'NV': { LLC: '$350', Corp: '$350' },
      'WY': { LLC: '$50-60', Corp: '$50-60' },
      'TX': { LLC: 'N/A', Corp: 'N/A' },
      'FL': { LLC: '$138.75', Corp: '$138.75' },
      'NY': { LLC: '$9', Corp: '$9' },
      'GA': { LLC: '$50', Corp: '$50' },
      'CO': { LLC: '$10', Corp: '$10' },
      'AZ': { LLC: '$45-150', Corp: '$45-150' },
      'MT': { LLC: '$20', Corp: '$20' }
    };
    return fees[state]?.[entity] || '$50';
  };

  const getAnnualTax = (state: string, entity: string) => {
    if (state === 'DE') {
      return entity === 'Corp' ? '$175+ (varies)' : '$300';
    }
    if (state === 'CA') {
      return entity === 'Corp' ? '$800 min (1st yr waived)' : '$800 (no waiver)';
    }
    if (state === 'NV') return 'None';
    if (state === 'WY') return 'None';
    if (state === 'TX') return 'None (if <$2.47M revenue)';
    if (state === 'FL') return 'None';
    if (state === 'NY') return 'Varies';
    if (state === 'GA') return 'Varies';
    if (state === 'CO') return 'Varies';
    if (state === 'AZ') return 'Varies';
    if (state === 'MT') return 'Varies';
    return 'Varies';
  };

  const getOtherNotes = (state: string, entity: string) => {
    if (state === 'CA' && entity === 'LLC') return 'Additional LLC fee based on gross receipts';
    if (state === 'NY' && entity === 'LLC') return 'Publication requirement ($1,500+ in NYC)';
    if (state === 'TX') return 'Public Information Report (PIR) filing required even if no tax due';
    if (state === 'NV') return 'Commerce tax if revenue >$4M';
    if (state === 'DE' && entity === 'Corp') return 'Franchise tax calculation varies by method';
    return 'Standard compliance requirements';
  };

  // California LLC fee calculation (corrected tiers)
  const calculateCALLCFee = (income: number) => {
    if (income < 250000) return 0;
    if (income < 500000) return 900;
    if (income < 1000000) return 2500;  // Corrected from 2250 to 2500
    if (income < 5000000) return 6000;
    return 11790;
  };

  const getCAFeeTier = (income: number) => {
    if (income < 250000) return 'Below $250,000 (no fee)';
    if (income < 500000) return '$250,000 - $499,999';
    if (income < 1000000) return '$500,000 - $999,999';
    if (income < 5000000) return '$1,000,000 - $4,999,999';
    return '$5,000,000+';
  };

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

  const calculateCosts = () => {
    const packageType = props.owners.some(o => o.name.trim()) ? 'standard' : 'basic';
    const packageFee = PRICING.packages[packageType];
    const stateFee = PRICING.stateFees[props.state]?.[props.entity] || 100;
    // Calculate dynamic speed pricing based on state
    const getSpeedPrice = (speedId: SpeedId) => {
      if (speedId === 'standard') return 0;

      const STATE_EXPEDITED_FEES: Record<string, { expedited: number; rush: number }> = {
        'CA': { expedited: 350, rush: 500 }, // 24hr: $350, 4hr: $500
        'NY': { expedited: 25, rush: 75 },   // 24hr: $25, same day: $75
        'TX': { expedited: 25, rush: 50 },   // Next day: $25, estimated same day: $50
        'DE': { expedited: 50, rush: 100 },  // 24hr: $50, faster options available
        'AZ': { expedited: 35, rush: 70 },   // Expedited: $35, estimated rush: $70
        'MT': { expedited: 20, rush: 40 },   // 24hr: $20, estimated rush: $40
        'NV': { expedited: 50, rush: 100 },  // Estimated based on typical fees
        'WY': { expedited: 50, rush: 100 },  // Estimated based on typical fees
        'GA': { expedited: 50, rush: 100 },  // Estimated based on typical fees
        'FL': { expedited: 50, rush: 100 },  // Limited expedited options
        'CO': { expedited: 50, rush: 100 },  // Estimated based on typical fees
      };

      const fees = STATE_EXPEDITED_FEES[props.state] || { expedited: 50, rush: 100 };
      const stateFee = speedId === 'expedite' ? fees.expedited : fees.rush;
      return stateFee + 49; // State fee + $49 profit
    };

    const speedFee = getSpeedPrice(props.speed);

    const serviceFees = {
      registeredAgent: props.registeredAgent ? (props.state === 'DE' ? 99 : PRICING.services.registeredAgent) : 0,
      einAssistance: props.einAssistance ? PRICING.services.einAssistance : 0,
      expeditedProcessing: props.expeditedProcessing ? PRICING.services.expeditedProcessing : 0,
      resalePermit: props.resalePermit ? PRICING.services.resalePermit : 0,
      bankingResolution: props.bankingResolution ? PRICING.services.bankingResolution : 0,
      consultation: props.consultation ? PRICING.services.consultation : 0,
      sCorpElection: props.sCorpElection ? PRICING.services.sCorpElection : 0,
      customDocuments: props.customDocuments ? PRICING.services.customDocuments : 0
    };

    const subtotal = packageFee + stateFee + speedFee + Object.values(serviceFees).reduce((sum, fee) => sum + fee, 0);

    return {
      packageFee,
      stateFee,
      speedFee,
      ...serviceFees,
      subtotal,
      total: subtotal
    };
  };

  const costs = calculateCosts();

  const handlePayPalCheckout = () => {
    // Send form data to owner@terms.law
    const emailBody = `
New Incorporation Order:

Company: ${props.primaryName || 'Not specified'}
State: ${STATE_NAMES[props.state] || props.state}
Entity: ${props.entity}
Alternative Names: ${props.alts.filter(Boolean).join(', ') || 'None'}

Owners:
${props.owners.map((o, i) => `${i + 1}. ${o.name || 'Unnamed'} - ${o.percent}%`).join('\n')}

Services:
- Processing Speed: ${SPEEDS[props.speed].label} (+$${costs.speedFee})
${props.registeredAgent ? `- Registered Agent Service ($${props.state === 'DE' ? 99 : 149})` : ''}
${props.einAssistance ? '- EIN Application ($89)' : ''}
${props.consultation ? '- 30-Min Consultation ($125)' : ''}
${props.sCorpElection ? '- S-Corp Tax Election ($150)' : ''}
${props.customDocuments ? '- Custom OA/Bylaws ($299)' : ''}

Total: $${costs.total}
    `.trim();

    // Create PayPal modal
    createPayPalModal(costs.total, props.primaryName || 'Company', emailBody);
  };

  const createPayPalModal = (amount: number, companyName: string, emailBody: string) => {
    // Remove any existing modal
    const existingModal = document.getElementById('paypal-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create itemized breakdown for display
    const breakdownItems = [];

    breakdownItems.push(`Service Package: $${costs.packageFee}`);
    breakdownItems.push(`${STATE_NAMES[props.state]} ${props.entity} Filing Fee: $${costs.stateFee}`);

    if (costs.speedFee > 0) {
      breakdownItems.push(`${SPEEDS[props.speed].label} Processing: $${costs.speedFee}`);
    }

    if (props.registeredAgent) {
      breakdownItems.push(`Registered Agent Service: $${costs.registeredAgent}`);
    }

    if (props.einAssistance) {
      breakdownItems.push(`EIN Application: $${costs.einAssistance}`);
    }

    if (props.expeditedProcessing) {
      breakdownItems.push(`Expedited Processing: $${costs.expeditedProcessing}`);
    }

    if (props.resalePermit) {
      breakdownItems.push(`Resale Permit: $${costs.resalePermit}`);
    }

    if (props.bankingResolution) {
      breakdownItems.push(`Banking Resolution: $${costs.bankingResolution}`);
    }

    if (props.consultation) {
      breakdownItems.push(`30-Min Consultation: $${costs.consultation}`);
    }

    if (props.sCorpElection) {
      breakdownItems.push(`S-Corp Tax Election: $${costs.sCorpElection}`);
    }

    if (props.customDocuments) {
      breakdownItems.push(`Custom OA/Bylaws: $${costs.customDocuments}`);
    }

    // Create modal HTML
    const modalHTML = `
      <div id="paypal-modal" class="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Complete Payment</h3>
            <button id="close-paypal-modal" class="text-gray-400 hover:text-gray-600 text-xl">×</button>
          </div>
          <div class="mb-4">
            <h4 class="font-medium text-gray-900 mb-2">Order Summary</h4>
            <div class="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
              ${breakdownItems.map(item => `<div class="flex justify-between"><span>${item.split(': $')[0]}</span><span>$${item.split(': $')[1]}</span></div>`).join('')}
            </div>
            <div class="border-t border-gray-200 mt-2 pt-2">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-900">Total:</span>
                <span class="font-semibold text-xl text-gray-900">$${amount}</span>
              </div>
            </div>
          </div>
          <div id="paypal-button-container" class="mb-4"></div>
          <p class="text-xs text-gray-500 text-center">Secure payment powered by PayPal</p>
        </div>
      </div>
    `;

    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add close functionality
    const closeBtn = document.getElementById('close-paypal-modal');
    const modal = document.getElementById('paypal-modal');

    const closeModal = () => {
      if (modal) modal.remove();
    };

    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Initialize PayPal
    initializePayPal(amount, companyName, emailBody);
  };

  const initializePayPal = (amount: number, companyName: string, emailBody: string) => {
    // Load PayPal SDK if not already loaded
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=ASmwKug6zVE_78S-152YKAzzh2iH8VgSjs-P6RkrWcfqdznNjeE_UYwKJkuJ3BvIJrxCotS8GtXEJ2fx&currency=USD';
      script.onload = () => renderPayPalButton(amount, companyName, emailBody);
      document.head.appendChild(script);
    } else {
      renderPayPalButton(amount, companyName, emailBody);
    }
  };

  const renderPayPalButton = (amount: number, companyName: string, emailBody: string) => {
    const container = document.getElementById('paypal-button-container');
    if (!container || !window.paypal) return;

    // Clear container
    container.innerHTML = '';

    // Create itemized breakdown for PayPal receipt
    const items = [];

    // Service Package
    items.push({
      name: 'Service Package',
      unit_amount: {
        currency_code: 'USD',
        value: costs.packageFee.toString()
      },
      quantity: '1'
    });

    // State Filing Fee
    items.push({
      name: `${STATE_NAMES[props.state]} ${props.entity} Filing Fee`,
      unit_amount: {
        currency_code: 'USD',
        value: costs.stateFee.toString()
      },
      quantity: '1'
    });

    // Speed Processing
    if (costs.speedFee > 0) {
      items.push({
        name: `${SPEEDS[props.speed].label} Processing`,
        unit_amount: {
          currency_code: 'USD',
          value: costs.speedFee.toString()
        },
        quantity: '1'
      });
    }

    // Additional Services
    if (props.registeredAgent) {
      items.push({
        name: 'Registered Agent Service',
        unit_amount: {
          currency_code: 'USD',
          value: costs.registeredAgent.toString()
        },
        quantity: '1'
      });
    }

    if (props.einAssistance) {
      items.push({
        name: 'EIN Application Assistance',
        unit_amount: {
          currency_code: 'USD',
          value: costs.einAssistance.toString()
        },
        quantity: '1'
      });
    }

    if (props.expeditedProcessing) {
      items.push({
        name: 'Expedited Processing',
        unit_amount: {
          currency_code: 'USD',
          value: costs.expeditedProcessing.toString()
        },
        quantity: '1'
      });
    }

    if (props.resalePermit) {
      items.push({
        name: 'Resale Permit',
        unit_amount: {
          currency_code: 'USD',
          value: costs.resalePermit.toString()
        },
        quantity: '1'
      });
    }

    if (props.bankingResolution) {
      items.push({
        name: 'Banking Resolution',
        unit_amount: {
          currency_code: 'USD',
          value: costs.bankingResolution.toString()
        },
        quantity: '1'
      });
    }

    if (props.consultation) {
      items.push({
        name: '30-Min Consultation',
        unit_amount: {
          currency_code: 'USD',
          value: costs.consultation.toString()
        },
        quantity: '1'
      });
    }

    if (props.sCorpElection) {
      items.push({
        name: 'S-Corp Tax Election',
        unit_amount: {
          currency_code: 'USD',
          value: costs.sCorpElection.toString()
        },
        quantity: '1'
      });
    }

    if (props.customDocuments) {
      items.push({
        name: 'Custom Operating Agreement/Bylaws',
        unit_amount: {
          currency_code: 'USD',
          value: costs.customDocuments.toString()
        },
        quantity: '1'
      });
    }

    window.paypal.Buttons({
      createOrder: function(data: any, actions: any) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: amount.toString(),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: amount.toString()
                }
              }
            },
            items: items,
            description: `Terms.law Business Incorporation - ${companyName} - ${STATE_NAMES[props.state]} ${props.entity}`
          }]
        });
      },
      onApprove: function(data: any, actions: any) {
        return actions.order.capture().then(function(details: any) {
          // Automatically submit form data
          submitFormData(details.id);

          // Close modal and show success
          const modal = document.getElementById('paypal-modal');
          if (modal) modal.remove();

          alert('Payment successful! Your incorporation order has been submitted.');
        });
      },
      onError: function(err: any) {
        console.error('PayPal error:', err);
        alert('Payment failed. Please try again.');
      },
      onCancel: function() {
        console.log('Payment cancelled');
      }
    }).render('#paypal-button-container');
  };

  const submitFormData = async (transactionId: string) => {
    const formData = {
      transactionId,
      company: props.primaryName || 'Not specified',
      state: props.state,
      stateName: STATE_NAMES[props.state] || props.state,
      entity: props.entity,
      alternativeNames: props.alts.filter(Boolean),
      owners: props.owners.filter(o => o.name.trim()),
      processing: {
        speed: props.speed,
        label: SPEEDS[props.speed].label
      },
      services: {
        registeredAgent: props.registeredAgent,
        einAssistance: props.einAssistance,
        expeditedProcessing: props.expeditedProcessing,
        resalePermit: props.resalePermit,
        bankingResolution: props.bankingResolution,
        consultation: props.consultation,
        sCorpElection: props.sCorpElection,
        customDocuments: props.customDocuments
      },
      costs: costs,
      timestamp: new Date().toISOString(),
      timeline: getProcessingTimeline(props.speed)
    };

    try {
      console.log('Attempting to submit incorporation form data:', formData);

      // Send to a webhook or email service - Replace 'your-form-id' with actual Formspree form ID
      const response = await fetch('https://formspree.io/f/your-form-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        // Fallback to email if webhook fails
        const emailBody = `
NEW INCORPORATION ORDER

Transaction ID: ${transactionId}
Company: ${formData.company}
State: ${formData.stateName}
Entity: ${formData.entity}
Alternative Names: ${formData.alternativeNames.join(', ') || 'None'}

OWNERS:
${formData.owners.map((o, i) => `${i + 1}. ${o.name} - ${o.percent}%`).join('\n')}

SERVICES:
- Processing Speed: ${formData.processing.label} (+$${formData.costs.speedFee})
${formData.services.registeredAgent ? `- Registered Agent Service ($${formData.costs.registeredAgent})` : ''}
${formData.services.einAssistance ? `- EIN Application ($${formData.costs.einAssistance})` : ''}
${formData.services.expeditedProcessing ? `- Expedited Processing ($${formData.costs.expeditedProcessing})` : ''}
${formData.services.resalePermit ? `- Resale Permit ($${formData.costs.resalePermit})` : ''}
${formData.services.bankingResolution ? `- Banking Resolution ($${formData.costs.bankingResolution})` : ''}
${formData.services.consultation ? `- 30-Min Consultation ($${formData.costs.consultation})` : ''}
${formData.services.sCorpElection ? `- S-Corp Tax Election ($${formData.costs.sCorpElection})` : ''}
${formData.services.customDocuments ? `- Custom OA/Bylaws ($${formData.costs.customDocuments})` : ''}

TOTAL: $${formData.costs.total}

TIMELINE:
${formData.timeline.description}
${formData.timeline.estimatedCompletion}

Order submitted: ${new Date(formData.timestamp).toLocaleString()}
        `.trim();

        // Create hidden form and submit
        const form = document.createElement('form');
        form.style.display = 'none';
        form.action = 'mailto:owner@terms.law';
        form.method = 'post';
        form.enctype = 'text/plain';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'subject';
        input.value = `New Incorporation Order - ${formData.company}`;

        const textarea = document.createElement('textarea');
        textarea.name = 'body';
        textarea.value = emailBody;

        form.appendChild(input);
        form.appendChild(textarea);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const testFormSubmission = () => {
    const formData = {
      transactionId: 'TEST_' + Date.now(),
      company: props.primaryName || 'Not specified',
      state: props.state,
      stateName: STATE_NAMES[props.state] || props.state,
      entity: props.entity,
      alternativeNames: props.alts.filter(Boolean),
      owners: props.owners.filter(o => o.name.trim()),
      processing: {
        speed: props.speed,
        label: SPEEDS[props.speed].label
      },
      services: {
        registeredAgent: props.registeredAgent,
        einAssistance: props.einAssistance,
        expeditedProcessing: props.expeditedProcessing,
        resalePermit: props.resalePermit,
        bankingResolution: props.bankingResolution,
        consultation: props.consultation,
        sCorpElection: props.sCorpElection,
        customDocuments: props.customDocuments
      },
      costs: costs,
      timestamp: new Date().toISOString(),
      timeline: getProcessingTimeline(props.speed)
    };

    // Show the data in a modal for inspection
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';

    const content = document.createElement('div');
    content.style.cssText = 'background:white;border-radius:8px;padding:20px;max-width:600px;max-height:80vh;overflow-y:auto;';

    content.innerHTML = `
      <h3 style="margin:0 0 15px 0;color:#333;">Test Form Submission Data</h3>
      <p style="color:#666;margin-bottom:15px;">This is what would be sent to you after payment:</p>
      <pre style="background:#f5f5f5;padding:15px;border-radius:4px;overflow-x:auto;font-size:12px;">${JSON.stringify(formData, null, 2)}</pre>
      <div style="margin-top:15px;text-align:right;">
        <button onclick="this.closest('.test-modal').remove()" style="background:#3b82f6;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;">Close</button>
      </div>
    `;

    modal.className = 'test-modal';
    modal.appendChild(content);
    document.body.appendChild(modal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    // Also log to console for debugging
    console.log('Test Form Submission Data:', formData);
  };

  const previewData = [
    `State: ${STATE_NAMES[props.state] || props.state}`,
    `Entity: ${props.entity}`,
    `Company: ${props.primaryName || "—"}`,
    `Alternatives: ${props.alts.filter(Boolean).join(", ") || "—"}`,
    `Owners: ${props.owners.filter(o => o.name.trim()).map(o => `${o.name} (${o.percent}%)`).join("; ") || "Standard form"}`,
    `Processing: ${SPEEDS[props.speed].label} (${SPEEDS[props.speed].timeline})`,
    `Registered Agent: ${props.registeredAgent ? "Yes" : "No"}`
  ];

  return (
    <div className="w-96 space-y-6 quote-container">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Live Quote
        </h3>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service Package</span>
            <span className="font-medium">${costs.packageFee}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">State Filing Fee</span>
            <span className="font-medium">${costs.stateFee}</span>
          </div>

          {costs.speedFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{SPEEDS[props.speed].label}</span>
              <span className="font-medium">${costs.speedFee}</span>
            </div>
          )}

          {props.registeredAgent && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Registered Agent</span>
              <span className="font-medium">${costs.registeredAgent}</span>
            </div>
          )}

          {props.einAssistance && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">EIN Application</span>
              <span className="font-medium">${costs.einAssistance}</span>
            </div>
          )}

          {props.expeditedProcessing && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Expedited Processing</span>
              <span className="font-medium">${costs.expeditedProcessing}</span>
            </div>
          )}

          {props.resalePermit && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Resale Permit</span>
              <span className="font-medium">${costs.resalePermit}</span>
            </div>
          )}

          {props.bankingResolution && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Banking Resolution</span>
              <span className="font-medium">${costs.bankingResolution}</span>
            </div>
          )}

          {props.consultation && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Consultation</span>
              <span className="font-medium">${costs.consultation}</span>
            </div>
          )}

          {props.sCorpElection && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">S-Corp Election</span>
              <span className="font-medium">${costs.sCorpElection}</span>
            </div>
          )}

          {props.customDocuments && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Custom OA/Bylaws</span>
              <span className="font-medium">${costs.customDocuments}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>${costs.total}</span>
          </div>
        </div>

        {/* Processing Speed & Timeline */}
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h5 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Processing Speed & Timeline
          </h5>

          {/* Speed Selector */}
          <div className="mb-4">
            <div className="text-xs font-medium text-green-900 mb-2">Choose Processing Speed:</div>
            <div className="space-y-2">
              {(['standard', 'expedite', 'rush'] as SpeedId[]).map((speedId) => {
                const speed = SPEEDS[speedId];
                const active = speedId === props.speed;

                // Calculate dynamic pricing for expedited speeds
                const getStatePrice = (type: 'expedite' | 'rush') => {
                  const STATE_EXPEDITED_FEES: Record<string, { expedited: number; rush: number }> = {
                    'CA': { expedited: 350, rush: 500 },
                    'NY': { expedited: 25, rush: 75 },
                    'TX': { expedited: 25, rush: 50 },
                    'DE': { expedited: 50, rush: 100 },
                    'AZ': { expedited: 35, rush: 70 },
                    'MT': { expedited: 20, rush: 40 },
                    'NV': { expedited: 50, rush: 100 },
                    'WY': { expedited: 50, rush: 100 },
                    'GA': { expedited: 50, rush: 100 },
                    'FL': { expedited: 50, rush: 100 },
                    'CO': { expedited: 50, rush: 100 },
                  };
                  const fees = STATE_EXPEDITED_FEES[props.state] || { expedited: 50, rush: 100 };
                  const stateFee = type === 'expedite' ? fees.expedited : fees.rush;
                  return stateFee + 49;
                };

                const price = speedId === 'standard' ? 0 :
                             speedId === 'expedite' ? getStatePrice('expedite') :
                             getStatePrice('rush');

                return (
                  <button
                    key={speedId}
                    type="button"
                    onClick={() => props.onSpeedChange(speedId)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                      active
                        ? "border-green-500 bg-white"
                        : "border-green-200 hover:border-green-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{speed.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{speed.timeline}</div>
                      </div>
                      <div className="text-xs font-medium text-green-600 ml-2">
                        {price > 0 ? `+$${price}` : "Included"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline Display */}
          <div className="text-sm text-green-800 bg-white rounded-lg p-3 border border-green-200">
            <div className="font-medium">{timeline.estimatedCompletion}</div>
            <div className="text-xs mt-1">{timeline.description}</div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button
            className="btn-primary w-full"
            onClick={() => handlePayPalCheckout()}
          >
            Proceed to Payment - ${costs.total}
          </button>
          <button
            className="btn-secondary w-full text-sm"
            onClick={() => testFormSubmission()}
          >
            🧪 Test Form Submission (for debugging)
          </button>
        </div>
      </div>


    </div>
  );
}