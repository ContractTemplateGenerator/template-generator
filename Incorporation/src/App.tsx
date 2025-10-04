import { useState, useEffect } from "react";
import OwnershipRow, { type Owner } from "./components/OwnershipRow";
import SpeedSelector, { type SpeedId } from "./components/SpeedSelector";
import HelpModal from "./components/HelpModal";
import StateSelector from "./components/StateSelector";
import RegisteredAgentHelp from "./components/RegisteredAgentHelp";
import LiveQuote from "./components/LiveQuote";
import CompliancePanel from "./components/CompliancePanel";
import TaxCalculator from "./components/TaxCalculator";
import { SPEEDS } from "./components/SpeedSelector";
import { getProcessingTimeline } from "./utils/businessDays";
import { getComplianceRequirements, getComplianceNotes, calculateDueDate, formatDueDate } from './utils/complianceData';
import { STATES, STATE_NAMES } from "./utils/states";

type Entity = "LLC"|"Corp"|"PBC"|"PC";

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
    }
  };

  return documentUrls[state]?.[entity] || 'https://terms.law';
}

// Declare Calendly for TypeScript
declare global {
  interface Window {
    Calendly: any;
  }
}

const stateHelpData = [
  {
    title: "Delaware",
    advantages: [
      "Most business-friendly court system",
      "Strong legal precedents for business disputes",
      "No state corporate income tax for out-of-state businesses",
      "High level of privacy protection",
      "Well-established corporate law"
    ],
    disadvantages: [
      "Requires registered agent service",
      "Annual franchise tax required",
      "No tax advantages if you don't live there",
      "Higher initial filing costs"
    ]
  },
  {
    title: "Nevada",
    advantages: [
      "No state corporate income tax",
      "No franchise tax on LLCs",
      "Strong privacy protections",
      "Minimal reporting requirements"
    ],
    disadvantages: [
      "Commerce tax on businesses with gross revenue over $4M",
      "Less established corporate law than Delaware",
      "May require registered agent service"
    ]
  },
  {
    title: "Wyoming",
    advantages: [
      "No state income tax",
      "Low annual fees",
      "Strong privacy protections",
      "Business-friendly regulations"
    ],
    disadvantages: [
      "Limited legal precedents",
      "May be viewed suspiciously by some banks/investors",
      "Requires registered agent service"
    ]
  }
];

const entityHelpData = [
  {
    title: "Limited Liability Company (LLC)",
    advantages: [
      "Pass-through taxation (no double taxation)",
      "Flexible management structure",
      "Fewer formalities and record-keeping requirements",
      "Can elect different tax treatments",
      "Limited liability protection for owners"
    ],
    disadvantages: [
      "Self-employment taxes on active income",
      "Limited life in some states",
      "Less established for raising investment capital",
      "Harder to transfer ownership interests"
    ]
  },
  {
    title: "C-Corporation",
    advantages: [
      "Easier to raise capital and attract investors",
      "Unlimited life regardless of ownership changes",
      "Potential for stock options and employee incentives",
      "More credibility with banks and suppliers",
      "Can retain earnings at lower tax rates"
    ],
    disadvantages: [
      "Double taxation (corporate and dividend level)",
      "More complex record-keeping requirements",
      "Required board of directors and corporate formalities",
      "More expensive to maintain",
      "Less flexibility in profit/loss allocation"
    ]
  },
  {
    title: "Public Benefit Corporation (PBC)",
    advantages: [
      "Attracts impact investors and ESG-focused capital",
      "Legal protection for considering stakeholder interests",
      "Enhanced brand credibility for mission-driven companies",
      "Same liability protection and tax benefits as C-Corps",
      "Can pursue both profit and public benefit legally"
    ],
    disadvantages: [
      "Additional compliance burden (benefit reporting)",
      "Directors must balance multiple stakeholder interests",
      "May limit some business decisions if they conflict with mission",
      "More complex governance and decision-making processes",
      "Available in limited states (10 states I have experience with)"
    ]
  },
  {
    title: "Professional Corporation (PC)",
    advantages: [
      "Designed specifically for licensed professionals",
      "Limited liability protection for malpractice claims from others",
      "Tax benefits similar to C-Corporations",
      "Professional credibility and compliance with licensing boards",
      "Can retain earnings at corporate tax rates"
    ],
    disadvantages: [
      "All shareholders must be licensed in the profession",
      "No liability protection for your own professional malpractice",
      "More complex formation and compliance requirements",
      "Limited to specific licensed professions",
      "Available only in states with PC statutes (11 states supported)"
    ]
  }
];

const getNamingRequirements = (entity: string, state: string) => {
  if (entity === 'LLC') {
    const requirements = {
      'DE': 'Delaware LLC names must contain: Limited Liability Company, L.L.C., or LLC. May contain: Company, Association, Club, Foundation, Fund, Institute, Society, Union, Syndicate, Limited, Public Benefit, or Trust. May not contain "bank" unless actively regulated banking entity',
      'CA': 'California LLC names must contain: Limited Liability Company, L.L.C., or LLC. "Limited" may be "Ltd." and "Company" may be "Co."',
      'FL': 'Florida LLC names must contain: Limited Liability Company, L.L.C., or LLC. Must be distinguishable from all other entities. Cannot imply unauthorized purposes or government connection. Written consent allows similar names',
      'TX': 'Texas LLC names must contain: Limited Liability Company, Limited Company, L.L.C., LLC, L.C., or LC. Must be distinguishable from other entities on file. Cannot contain words prohibited by law or suggesting unauthorized activities',
      'NY': 'New York LLC names must contain: Limited Liability Company, L.L.C., or LLC',
      'NV': 'Nevada LLC names must contain: Limited-Liability Company, Limited Liability Company, Limited Company, Limited, Ltd., L.L.C., L.C., LLC, or LC',
      'WY': 'Wyoming LLC names must contain: Limited Liability Company, LLC, L.L.C., Limited Company, LC, or L.C.',
      'CO': 'Colorado LLC names must contain: Limited Liability Company, Ltd. Liability Company, Limited Liability Co., Ltd. Liability Co., Limited, L.L.C., LLC, or Ltd.',
      'GA': 'Georgia LLC names must contain: Limited Liability Company, Limited Company, L.L.C., L.C., LLC, or LC',
      'AZ': 'Arizona LLC names must include: Limited Liability Company, LLC, or L.L.C. May not contain "association", "corporation", "incorporated", or banking terms unless actively engaged in such business',
      'MT': 'Montana LLC names must contain: Limited Liability Company, Limited Company, L.L.C., L.C., LLC, or LC'
    };
    return requirements[state as keyof typeof requirements] || 'LLC names must end with: LLC, L.L.C., or Limited Liability Company';
  } else if (entity === 'PBC') {
    const requirements = {
      'DE': 'Delaware Public Benefit Corporation names must contain: association, company, corporation, club, foundation, fund, incorporated, institute, society, union, syndicate, or limited (or abbreviations). Certificate must state it is a "public benefit corporation" but this need not appear in the corporate name. May not contain "bank" unless actively regulated',
      'CA': 'California Benefit Corporation names — same as regular corporations. May include "Benefit Corporation" or "Public Benefit Corporation" but not required. Close corporations must use: corporation, incorporated, or limited (or abbreviations). Must include purpose in certificate of incorporation',
      'FL': 'Florida Social Purpose Corporation names must contain: Corporation, Company, Incorporated, Corp., Inc., or Co. May include "Social Purpose Corporation" or "SPC" but not required. Must be distinguishable from other entities',
      'TX': 'Texas For-Profit Corporation names (including benefit purposes) must contain: Company, Corporation, Incorporated, Limited, or abbreviations (Corp., Inc., Co., Ltd.). May include "Public Benefit Corporation" or "PBC" but not required. Must be distinguishable from other entities',
      'NY': 'New York Benefit Corporation names must contain: Corporation, Incorporated, Limited, or abbreviations. May include "Benefit Corporation" but not required. Must state benefit purpose in certificate of incorporation',
      'NV': 'Nevada Corporation names (benefit corps follow same rules) — no universal suffix required. Names appearing to be natural persons must include: Incorporated, Limited, Inc., Ltd., Company, Co., Corporation, Corp. May include "Benefit Corporation" or "Public Benefit Corporation"',
      'WY': 'Wyoming Corporation names (benefit corps follow same rules) — no specific suffix mandated. May include "Benefit Corporation", "Public Benefit Corporation", or "PBC" but not required. Must state purpose in articles of incorporation',
      'CO': 'Colorado Benefit Corporation names must contain: Corporation, Incorporated, Company, Limited, Corp., Inc., Co., or Ltd. May include "Benefit Corporation" or "Public Benefit Corporation" but not required',
      'GA': 'Georgia Corporation names (benefit corps follow same rules) must contain: Corporation, Incorporated, Company, Limited, Corp., Inc., Co., or Ltd. May include "Benefit Corporation" or "Public Benefit Corporation"',
      'AZ': 'Arizona Corporation names (benefit corps follow same rules) must contain: Association, Bank, Company, Corporation, Limited, Incorporated, or abbreviations. May include "Benefit Corporation" or "Public Benefit Corporation" but not required',
      'MT': 'Montana Corporation names (benefit corps follow same rules) must contain: Corporation, Incorporated, Company, Limited, Corp., Inc., Co., or Ltd. May include "Benefit Corporation" or "Public Benefit Corporation"'
    };
    return requirements[state as keyof typeof requirements] || 'Public Benefit Corporation names follow corporate naming rules: Inc, Inc., Incorporated, Corp, Corp., Corporation, Company, Co., Ltd, Ltd., or Limited. May include "Public Benefit Corporation" or "PBC" but not required.';
  } else if (entity === 'PC') {
    const requirements = {
      'DE': 'Delaware Professional Corporation names must contain: Professional Corporation, P.C., Prof. Corp., or Professional Corp. Name must reflect professional service to be provided. Cannot use "Company," "Co.," "Corporation," or "Corp." alone',
      'CA': 'California Professional Corporation names must include: A Professional Corporation, Professional Corporation, A Prof. Corp., Prof. Corp., A P.C., or P.C. Name must indicate professional service. Cannot suggest other business types',
      'NY': 'New York Professional Corporation names must contain: Professional Corporation, P.C., or P. C. Name must indicate type of professional service. Cannot be misleading or suggest non-professional business',
      'TX': 'Texas Professional Corporation names must contain: Professional Corporation, P.C., Prof. Corp., or Professional Corp. Name must reflect professional service to be rendered. Cannot use regular corporation designations',
      'FL': 'Florida Professional Corporation names must contain: Professional Association, P.A., Chartered, or other professional designation. Cannot use "Corporation," "Corp.," "Incorporated," or "Inc." Must indicate professional service',
      'CO': 'Colorado Professional Corporation names must contain: Professional Corporation, P.C., Prof. Corp., or Professional Corp. Name must indicate professional service. Cannot suggest non-professional business activities',
      'GA': 'Georgia Professional Corporation names must contain: Professional Corporation, P.C., or other designation indicating professional nature. Name must be consistent with professional service. Cannot be misleading about business type',
      'AZ': 'Arizona Professional Corporation names must contain: Professional Corporation, P.C., Professional Limited Liability Company, or PLLC (for professional LLCs). Name must reflect professional service. Cannot suggest general business',
      'NV': 'Nevada Professional Corporation names must contain: Professional Corporation, P.C., Prof. Corp., or Professional Corp. Name must indicate professional service to be provided. Cannot use regular corporate designations',
      'WY': 'Wyoming Professional Corporation names must contain: A Professional Corporation or P.C. Name must indicate professional service. Cannot suggest non-professional activities or use regular corporate designations',
      'MT': 'Montana Professional Corporation names must contain: Professional Corporation, P.C., Prof. Corp., or Professional Corp. Name must reflect licensed professional service. Cannot be misleading or suggest general business'
    };
    return requirements[state as keyof typeof requirements] || 'Professional Corporation names must contain: Professional Corporation, P.C., Prof. Corp., or Professional Corp. Name must indicate professional service.';
  } else {
    const requirements = {
      'DE': 'Delaware Corporation names must contain: association, company, corporation, club, foundation, fund, incorporated, institute, society, union, syndicate, or limited (or abbreviations). May not contain "bank" unless actively regulated banking entity. $10M+ asset waiver available for natural person names',
      'CA': 'California Corporations are not required to use name endings (general stock corps). Close corporations must use: corporation, incorporated, or limited (or abbreviations)',
      'FL': 'Florida Corporation names must contain: Corporation, Company, Incorporated, Corp., Inc., or Co. Must be distinguishable from all other entities. Cannot imply unauthorized purposes or government connection. Written consent allows similar names',
      'TX': 'Texas Corporation names must contain: Company, Corporation, Incorporated, Limited, or abbreviations (Corp., Inc., Co., Ltd.). Must be distinguishable from other entities on file. Cannot contain words prohibited by law or suggesting unauthorized activities',
      'NY': 'New York Corporation names must contain: Corporation, Incorporated, Limited, or abbreviations',
      'NV': 'Nevada Corporation names — no universal suffix required. Names appearing to be natural persons must include: Incorporated, Limited, Inc., Ltd., Company, Co., Corporation, Corp.',
      'WY': 'Wyoming Corporation names — no specific suffix mandated for general corporations. Professional corporations must include: A Professional Corporation or P.C.',
      'CO': 'Colorado Corporation names must contain: Corporation, Incorporated, Company, Limited, Corp., Inc., Co., or Ltd.',
      'GA': 'Georgia Corporation names must contain: Corporation, Incorporated, Company, Limited, Corp., Inc., Co., or Ltd.',
      'AZ': 'Arizona Corporation names must contain: Association, Bank, Company, Corporation, Limited, Incorporated, or abbreviations. May not contain LLC terms or banking terms unless actively engaged in such business',
      'MT': 'Montana Corporation names must contain: Corporation, Incorporated, Company, Limited, Corp., Inc., Co., or Ltd.'
    };
    return requirements[state as keyof typeof requirements] || 'Corporation names must end with: Inc, Inc., Incorporated, Corp, Corp., Corporation, Company, Co., Ltd, Ltd., or Limited';
  }
};

export default function App() {
  const [state, setState] = useState<string>("DE");
  const [entity, setEntity] = useState<Entity>("LLC");

  // PBC-supported states (10 states with most experience)
  const PBC_STATES = ['DE', 'CA', 'NY', 'TX', 'FL', 'CO', 'GA', 'AZ', 'NV', 'MT'];

  // PC-supported states (10 states with comprehensive documentation)
  const PC_STATES = ['DE', 'CA', 'NY', 'TX', 'FL', 'CO', 'GA', 'AZ', 'NV', 'WY', 'MT'];

  // Handle entity change and state validation
  const handleEntityChange = (newEntity: Entity) => {
    setEntity(newEntity);
    // If switching to PBC and current state is not in PBC_STATES, reset to Delaware
    if (newEntity === 'PBC' && !PBC_STATES.includes(state)) {
      setState('DE');
    }
    // If switching to PC and current state is not in PC_STATES, reset to Delaware
    if (newEntity === 'PC' && !PC_STATES.includes(state)) {
      setState('DE');
    }
  };
  const [primaryName, setPrimaryName] = useState("");
  const [nameError, setNameError] = useState("");
  const [alts, setAlts] = useState(["",""]);
  const [owners, setOwners] = useState<Owner[]>([{ name: "", percent: 100 }]);
  const [speed, setSpeed] = useState<SpeedId>("standard");

  // LLC Management Structure
  const [managementStructure, setManagementStructure] = useState<"member"|"manager">("member");

  // Corporation Directors/Officers
  const [numDirectors, setNumDirectors] = useState("1");
  const [directors, setDirectors] = useState([{ name: "", address: "" }]);
  const [officers, setOfficers] = useState([{ title: "", name: "" }]);

  // Services
  const [registeredAgent, setRegisteredAgent] = useState(true);
  const [einAssistance, setEinAssistance] = useState(false);
  const [consultation, setConsultation] = useState(false);
  const [sCorpElection, setSCorpElection] = useState(false);
  const [customDocuments, setCustomDocuments] = useState(false);

  // Auto-populate option
  const [autoPopulate, setAutoPopulate] = useState(false);

  // Own registered agent fields
  const [ownAgentName, setOwnAgentName] = useState("");
  const [ownAgentAddress, setOwnAgentAddress] = useState("");

  // Modal states
  const [stateSelectorOpen, setStateSelectorOpen] = useState(false);
  const [entityHelpOpen, setEntityHelpOpen] = useState(false);
  const [regAgentHelpOpen, setRegAgentHelpOpen] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);

  // Contact form state
  const [captchaAnswer, setCaptchaAnswer] = useState<number>(0);
  const [captchaQuestion, setCaptchaQuestion] = useState<{a: number, b: number}>({a: 0, b: 0});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Corporation-specific state
  const [authorizedShares, setAuthorizedShares] = useState<number>(1000);
  const [parValue, setParValue] = useState<number>(0.001);

  // PBC Share Structure (separate from Corp)
  const [pbcAuthorizedShares, setPbcAuthorizedShares] = useState<number>(1000);
  const [pbcParValue, setPbcParValue] = useState<number>(0.001);
  const [pbcHasParValue, setPbcHasParValue] = useState(true);
  const [hasParValue, setHasParValue] = useState(true);
  const [incorporatorName, setIncorporatorName] = useState("");
  const [incorporatorAddress, setIncorporatorAddress] = useState("");
  const [incorporatorSameAsOwner, setIncorporatorSameAsOwner] = useState(false);
  const [businessPurpose, setBusinessPurpose] = useState("general");

  // PBC-specific state
  const [pbcPurpose, setPbcPurpose] = useState("");
  const [naicsCode, setNaicsCode] = useState("");
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);

  // PC-specific state
  const [pcProfession, setPcProfession] = useState("");
  const [pcProfessionOther, setPcProfessionOther] = useState("");
  const [pcServiceDescription, setPcServiceDescription] = useState("");

  // Auto-fill professional service descriptions
  const getProfessionalServiceDescription = (profession: string): string => {
    const descriptions: Record<string, string> = {
      attorney: "Provision of legal services including legal advice, representation, document preparation, litigation support, and other professional legal services as authorized under applicable state law and bar regulations.",
      physician: "Provision of medical and healthcare services including diagnosis, treatment, preventive care, medical consultations, and other professional medical services as authorized under applicable state medical licensing laws.",
      dentist: "Provision of dental and oral healthcare services including examinations, cleanings, restorative procedures, preventive care, and other professional dental services as authorized under applicable state dental licensing laws.",
      accountant: "Provision of accounting and financial services including auditing, tax preparation, financial statement preparation, bookkeeping, consulting, and other professional accounting services as authorized under applicable state accountancy laws.",
      architect: "Provision of architectural services including building design, construction documentation, project management, planning consultation, and other professional architectural services as authorized under applicable state architecture licensing laws.",
      engineer: "Provision of engineering services including design, analysis, consultation, project management, inspection, and other professional engineering services as authorized under applicable state engineering licensing laws.",
      psychologist: "Provision of psychological services including assessment, therapy, counseling, testing, research, and other professional psychological services as authorized under applicable state psychology licensing laws.",
      chiropractor: "Provision of chiropractic services including spinal manipulation, musculoskeletal treatment, examination, diagnosis, and other professional chiropractic services as authorized under applicable state chiropractic licensing laws."
    };
    return descriptions[profession] || "";
  };

  // Handle profession change with auto-fill
  const handleProfessionChange = (profession: string) => {
    setPcProfession(profession);
    if (profession && profession !== 'other') {
      const description = getProfessionalServiceDescription(profession);
      if (description) {
        setPcServiceDescription(description);
      }
    } else if (profession === 'other') {
      setPcServiceDescription("");
    }
  };

  // Get entity description for inline help
  const getEntityDescription = (entityType: Entity): string => {
    const descriptions: Record<Entity, string> = {
      LLC: "Most popular choice for small businesses. Offers liability protection with flexible management and pass-through taxation. Best for 1-5 owners who want simplicity.",
      Corp: "Best for businesses planning to raise investment capital or go public. Offers unlimited growth potential but requires more formalities and may face double taxation.",
      PBC: "Ideal for mission-driven businesses that want to pursue both profit and social/environmental impact. Attracts impact investors while maintaining corporate benefits.",
      PC: "Required for licensed professionals (doctors, lawyers, etc.) in most states. Provides liability protection while meeting professional licensing requirements."
    };
    return descriptions[entityType];
  };

  // S-Corp eligibility state
  const [numShareholders, setNumShareholders] = useState<number>(1);
  const [hasNonResidentAliens, setHasNonResidentAliens] = useState(false);
  const [hasIneligibleShareholders, setHasIneligibleShareholders] = useState(false);

  // Delaware tax calculator state
  const [issuedShares, setIssuedShares] = useState<number>(100);
  const [totalGrossAssets, setTotalGrossAssets] = useState<number>(10000);

  // Compliance section state variables
  const [showAllRequirements, setShowAllRequirements] = useState(false);
  const [showCALLCFeeCalc, setShowCALLCFeeCalc] = useState(false);
  const [caIncomeAmount, setCaIncomeAmount] = useState<number>(0);
  const [showCaliforniaTaxCalc, setShowCaliforniaTaxCalc] = useState(false);
  const [showDETaxCalc, setShowDETaxCalc] = useState(false);
  const [showDelawareTaxCalc, setShowDelawareTaxCalc] = useState(false);
  const [showFDAPHelp, setShowFDAPHelp] = useState(false);
  const [showECIHelp, setShowECIHelp] = useState(false);
  const [showBOIDetails, setShowBOIDetails] = useState(false);
  const [showBOIAccessInfo, setShowBOIAccessInfo] = useState(false);

  // Generate captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({a, b});
    setCaptchaAnswer(0);
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const userAnswer = Number(formData.get('captcha'));
    const correctAnswer = captchaQuestion.a + captchaQuestion.b;

    if (userAnswer !== correctAnswer) {
      alert('Incorrect math answer. Please try again.');
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);

    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      message: formData.get('message'),
      timestamp: new Date().toISOString(),
      subject: `Question from ${formData.get('name')} - Incorporation Inquiry`
    };

    try {
      // Send to a webhook service that will email you - Replace 'your-form-id' with actual Formspree form ID
      const response = await fetch('https://formspree.io/f/your-form-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      });

      if (response.ok) {
        alert('Thank you! Your question has been sent successfully.');
        (e.currentTarget as HTMLFormElement).reset();
        generateCaptcha();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      // Fallback: create a pre-filled mailto link but don't auto-open it
      const subject = contactData.subject;
      const body = `Name: ${contactData.name}\nEmail: ${contactData.email}\nCompany: ${contactData.company}\n\nMessage:\n${contactData.message}`;

      // Show the mailto link as a fallback option
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';

      const content = document.createElement('div');
      content.style.cssText = 'background:white;border-radius:8px;padding:20px;max-width:500px;text-align:center;';

      content.innerHTML = `
        <h3 style="margin:0 0 15px 0;color:#333;">Message Sent</h3>
        <p style="color:#666;margin-bottom:15px;">Your message has been prepared. Please click below to send it via email:</p>
        <div style="margin:15px 0;">
          <a href="mailto:owner@terms.law?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}" style="background:#3b82f6;color:white;padding:10px 20px;border-radius:4px;text-decoration:none;display:inline-block;">Send Email</a>
        </div>
        <button onclick="this.closest('.contact-modal').remove()" style="background:#6b7280;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;margin-top:10px;">Close</button>
      `;

      modal.className = 'contact-modal';
      modal.appendChild(content);
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });

      (e.currentTarget as HTMLFormElement).reset();
      generateCaptcha();
    }

    setIsSubmitting(false);
  };

  const changeOwner = (i:number, field:keyof Owner, value:string) => {
    setOwners(curr => curr.map((o,idx)=> idx===i ? { ...o, [field]: field==="percent" ? Number(value) : value } : o));
  };
  const addOwner = () => setOwners(curr => [...curr, { name:"", percent:0 }]);
  const removeOwner = (i:number) => setOwners(curr => curr.filter((_,idx)=>idx!==i));

  const ownershipTotal = owners.reduce((sum, o) => sum + (Number(o.percent) || 0), 0);
  const hasAtLeastOneName = owners.some(o => o.name.trim().length > 0);
  const isFormValid = !autoPopulate || hasAtLeastOneName;

  // Delaware tax calculation functions
  const calculateDelawareTax = () => {
    if (state !== 'DE' || (entity !== 'Corp' && entity !== 'PBC' && entity !== 'PC')) return null;

    const calculateAuthorizedSharesMethod = (shares: number) => {
      if (shares <= 5000) return 175;
      if (shares <= 10000) return 250;
      const extraBlocks = Math.ceil((shares - 10000) / 10000);
      return Math.min(250 + 85 * extraBlocks, 200000);
    };

    const calculateAPVCMethod = (issued: number, assets: number, authorized: number) => {
      if (issued === 0) return 400; // minimum
      const assumedParValuePerShare = assets / issued;
      const assumedParValueCapital = assumedParValuePerShare * authorized;
      const blocks = Math.ceil(assumedParValueCapital / 1000000);
      return Math.max(400, Math.min(blocks * 400, 200000));
    };

    const currentAuthorizedShares = entity === 'PBC' ? pbcAuthorizedShares : authorizedShares;
    const authorizedMethod = calculateAuthorizedSharesMethod(currentAuthorizedShares);
    const apvcMethod = calculateAPVCMethod(issuedShares, totalGrossAssets, currentAuthorizedShares);

    return {
      authorizedMethod,
      apvcMethod,
      recommendedMethod: apvcMethod < authorizedMethod ? 'APVC' : 'Authorized Shares',
      savings: Math.abs(apvcMethod - authorizedMethod),
      finalTax: Math.min(authorizedMethod, apvcMethod)
    };
  };

  // S-Corp eligibility check
  const checkSCorpEligibility = () => {
    const issues = [];

    if (numShareholders > 100) {
      issues.push('Cannot have more than 100 shareholders');
    }

    if (hasNonResidentAliens) {
      issues.push('Non-resident alien shareholders not allowed');
    }

    if (hasIneligibleShareholders) {
      issues.push('Partnerships, corporations, or non-qualifying trusts cannot be shareholders');
    }

    if (entity !== 'Corp') {
      issues.push('Only C-Corporations can elect S-Corp status');
    }

    return {
      isEligible: issues.length === 0,
      issues
    };
  };

  const sCorpEligibility = checkSCorpEligibility();
  const delawareTax = calculateDelawareTax();

  // Compliance helper functions
  const isDomesticEntity = () => {
    return true; // Default to domestic entity since we're forming in US states
  };

  const calculateCALLCFee = (income: number): number => {
    if (income < 250000) return 0;
    if (income < 500000) return 900;
    if (income < 1000000) return 2500;
    if (income < 5000000) return 6000;
    return 11790;
  };

  const getCAFeeTier = (income: number): string => {
    if (income < 250000) return "$0 - $249,999 (No fee)";
    if (income < 500000) return "$250,000 - $499,999 ($900)";
    if (income < 1000000) return "$500,000 - $999,999 ($2,500)";
    if (income < 5000000) return "$1,000,000 - $4,999,999 ($6,000)";
    return "$5,000,000+ ($11,790)";
  };

  const getRequirementIcon = (type: string): string => {
    switch (type) {
      case 'annual': return '📅';
      case 'biennial': return '📋';
      case 'one-time': return '📝';
      case 'tax': return '💰';
      default: return '📄';
    }
  };

  const getFrequencyColor = (frequency: string): string => {
    switch (frequency.toLowerCase()) {
      case 'annual': return 'bg-orange-100 text-orange-800';
      case 'biennial': return 'bg-blue-100 text-blue-800';
      case 'one-time': return 'bg-green-100 text-green-800';
      case 'quarterly': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get compliance data
  const requirements = getComplianceRequirements(state, entity);
  const notes = getComplianceNotes(state, entity);
  const timeline = getProcessingTimeline(speed);

  const placeholderRegisteredAgentAddress =
    "___________________________________ (street)\nin the City of ____________________________, County of ____________________  Zip Code ________________.";

  const agentNameForPreview = !registeredAgent
    ? (ownAgentName.trim() || "_________________________")
    : "_________________________";

  const agentAddressForPreview = !registeredAgent && ownAgentAddress.trim()
    ? ownAgentAddress.trim()
    : placeholderRegisteredAgentAddress;

  const parValueDisplay = parValue || parValue === 0 ? parValue.toString() : "____";
  const authorizedSharesDisplay = pbcAuthorizedShares
    ? pbcAuthorizedShares.toLocaleString()
    : "____";

  const incorporatorNamePreview = incorporatorName.trim() || "_________________________";
  const incorporatorAddressPreview = incorporatorAddress.trim() || "_________________________________";

  const corporationNamePreview = primaryName.trim() || "________________________________________";

  const buildCertificateText = () => {
    const agentAddressIndented = agentAddressForPreview
      .split('\n')
      .map(line => `   ${line}`)
      .join('\n');

    const benefitPurposeIndented = (pbcPurpose.trim() || '__'.repeat(12))
      .split('\n')
      .map(line => `   ${line || '__'.repeat(12)}`)
      .join('\n');

    const incorporatorAddressIndented = incorporatorAddressPreview
      .split('\n')
      .map(line => `     ${line}`)
      .join('\n');

    return `STATE OF DELAWARE
CERTIFICATE OF INCORPORATION
A PUBLIC BENEFIT CORPORATION

The undersigned Incorporator hereby certifies as follows:

1. The name of the Corporation is ${corporationNamePreview}.

2. The Registered Office of the corporation in the State of Delaware is located at
${agentAddressIndented}

The name of the Registered Agent at such address upon whom process against this corporation may be served is ${agentNameForPreview}.

3. The specific public benefit purpose of the corporation is to
${benefitPurposeIndented}

4. The total amount of stock this corporation is authorized to issue is ${authorizedSharesDisplay} shares (number of authorized shares) with a par value of $${parValueDisplay} per share.

5. The name and mailing address of the incorporator are as follows:
     Name ${incorporatorNamePreview}
     Mailing Address
${incorporatorAddressIndented}

By: ________________________________ Incorporator

Name: ${incorporatorNamePreview}`;
  };

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const buildCertificateHtml = () => {
    const agentAddressHtml = agentAddressForPreview
      .split('\n')
      .map(line => `<div><strong><u>${escapeHtml(line)}</u></strong></div>`)
      .join('');

    const benefitPurposeHtml = (pbcPurpose.trim() || '__'.repeat(12))
      .split('\n')
      .map(line => `<div><strong>${escapeHtml(line || '__'.repeat(12))}</strong></div>`)
      .join('');

    const incorporatorAddressHtml = incorporatorAddressPreview
      .split('\n')
      .map(line => `<div><strong>${escapeHtml(line)}</strong></div>`)
      .join('');

    const corporationNameHtml = `<strong><u>${escapeHtml(corporationNamePreview)}</u></strong>`;
    const agentNameHtml = `<strong><u>${escapeHtml(agentNameForPreview)}</u></strong>`;
    const authorizedSharesHtml = `<strong><u>${escapeHtml(authorizedSharesDisplay)}</u></strong>`;
    const parValueHtml = `<strong><u>${escapeHtml(parValueDisplay)}</u></strong>`;
    const incorporatorNameHtml = `<strong><u>${escapeHtml(incorporatorNamePreview)}</u></strong>`;

    return `
      <div style="text-align:center; font-weight:bold;">
        STATE OF DELAWARE<br/>
        CERTIFICATE OF INCORPORATION<br/>
        A PUBLIC BENEFIT CORPORATION
      </div>

      <p>The undersigned Incorporator hereby certifies as follows:</p>

      <p><strong>1.</strong> The name of the Corporation is ${corporationNameHtml}.</p>

      <p><strong>2.</strong> The Registered Office of the corporation in the State of Delaware is located at:</p>
      <div style="margin-left:1.5rem;">${agentAddressHtml}</div>

      <p>The name of the Registered Agent at such address upon whom process against this corporation may be served is ${agentNameHtml}.</p>

      <p><strong>3.</strong> The specific public benefit purpose of the corporation is to:</p>
      <div style="margin-left:1.5rem;">${benefitPurposeHtml}</div>

      <p><strong>4.</strong> The total amount of stock this corporation is authorized to issue is ${authorizedSharesHtml} shares with a par value of $${parValueHtml} per share.</p>

      <p><strong>5.</strong> The name and mailing address of the incorporator are as follows:</p>
      <div style="margin-left:1.5rem;">
        <div>Name: ${incorporatorNameHtml}</div>
        <div>Mailing Address:</div>
        <div style="margin-left:1.5rem;">${incorporatorAddressHtml}</div>
      </div>

      <div style="margin-top:2rem;">
        <div>By: ________________________________</div>
        <div style="margin-left:2rem;">Incorporator</div>
        <br/>
        <div>Name: ${incorporatorNameHtml}</div>
        <div style="margin-left:3rem; font-size:0.75rem;">(Print or Type)</div>
      </div>
    `;
  };

  // Name validation
  const checkNameRestrictions = (name: string, state: string, entity: string) => {
    const warnings = [];
    const nameLower = name.toLowerCase();

    // Common restricted words (varies by state but these are generally problematic)
    const restrictedWords = [
      'bank', 'banking', 'banker', 'trust', 'insurance', 'assurance',
      'university', 'college', 'school', 'hospital', 'lawyer', 'attorney',
      'cpa', 'accountant', 'engineer', 'architect', 'realtor', 'real estate',
      'cooperative', 'federal', 'national', 'state', 'united states', 'us ',
      'government', 'treasury', 'reserve', 'olympic', 'securities', 'exchange'
    ];

    restrictedWords.forEach(word => {
      if (nameLower.includes(word)) {
        warnings.push(`"${word}" may require special licensing or approval`);
      }
    });

    // Delaware specific restrictions
    if (state === 'DE') {
      if (nameLower.includes('delaware') || nameLower.includes('del.')) {
        warnings.push('Delaware name restrictions may apply');
      }
    }

    // Check for required endings
    if (entity === 'Corp') {
      const corpEndings = ['inc', 'inc.', 'incorporated', 'corp', 'corp.', 'corporation', 'company', 'co.', 'ltd', 'ltd.', 'limited'];
      const hasValidEnding = corpEndings.some(ending =>
        nameLower.endsWith(ending) || nameLower.endsWith(ending + '.')
      );

      if (!hasValidEnding) {
        warnings.push('Corporation name must end with Inc., Corp., Company, Ltd., or similar');
      }
    } else if (entity === 'PC') {
      // Professional Corporation naming rules by state
      if (state === 'DE') {
        const pcEndings = ['chartered', 'professional association', 'p.a.'];
        const hasValidEnding = pcEndings.some(ending => nameLower.includes(ending));
        if (!hasValidEnding) {
          warnings.push('Delaware PC name must contain "chartered" or "professional association" or "P.A."');
        }
      } else if (state === 'CA') {
        const pcEndings = ['professional corporation', 'p.c.', 'professional corp', 'prof corp'];
        const hasValidEnding = pcEndings.some(ending => nameLower.includes(ending));
        if (!hasValidEnding) {
          warnings.push('California PC name must include profession designation and corporate identifier');
        }
      } else if (state === 'NY') {
        const pcEndings = ['professional corporation', 'p.c.'];
        const hasValidEnding = pcEndings.some(ending => nameLower.endsWith(ending));
        if (!hasValidEnding) {
          warnings.push('New York PC name must end with "Professional Corporation" or "P.C."');
        }
      } else if (state === 'FL') {
        const pcEndings = ['chartered', 'professional association', 'p.a.'];
        const hasValidEnding = pcEndings.some(ending => nameLower.includes(ending));
        if (!hasValidEnding) {
          warnings.push('Florida PC name must contain "chartered", "professional association", or "P.A."');
        }
      } else {
        // Generic PC validation for other states
        const pcEndings = ['professional corporation', 'p.c.', 'professional corp', 'prof corp'];
        const hasValidEnding = pcEndings.some(ending => nameLower.includes(ending));
        if (!hasValidEnding) {
          warnings.push('PC name must include "Professional Corporation" or "P.C."');
        }
      }
    } else if (entity === 'LLC') {
      const llcEndings = ['llc', 'l.l.c.', 'limited liability company'];
      const hasValidEnding = llcEndings.some(ending =>
        nameLower.endsWith(ending)
      );

      if (!hasValidEnding) {
        warnings.push('LLC name must end with LLC, L.L.C., or Limited Liability Company');
      }
    }

    return warnings;
  };

  const nameWarnings = checkNameRestrictions(primaryName, state, entity);


  const [viewMode, setViewMode] = useState<'dashboard' | 'form'>('dashboard');

  return (
    <>
      <div className="main-container py-1">
      {/* AI-Enhanced Header */}
      <header className="mb-2 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Corporate Intelligence Dashboard
          </h1>
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
        </div>
        <p className="text-xs text-gray-600">Real-Time Legal Intelligence • AI-Enhanced Compliance Analysis • Attorney-Led Service</p>

        {/* Mode Toggle */}
        <div className="flex justify-center mt-2">
          <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
            <button
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setViewMode('dashboard')}
            >
              📊 Intelligence View
            </button>
            <button
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                viewMode === 'form'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setViewMode('form')}
            >
              📝 Filing Document Preview
            </button>
          </div>
        </div>
      </header>

      {viewMode === 'dashboard' ? (
        <div className="space-y-2">
          {/* Quick Entity & State Switcher */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border border-blue-200 rounded-lg p-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1">
                <span className="text-blue-500">⚡</span>
                What kind of entity do you want to form today?
              </h2>
              <div className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border">
                AI-Enhanced Legal Database
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* State Quick Switcher */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Jurisdiction</label>
                <select
                  className="w-full rounded border border-gray-300 px-2 py-1 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={state}
                  onChange={(e)=>setState(e.target.value)}
                >
                  {(entity === 'PBC' ? PBC_STATES : entity === 'PC' ? PC_STATES : STATES).map(abbr => (
                    <option key={abbr} value={abbr}>{STATE_NAMES[abbr] ?? abbr}</option>
                  ))}
                </select>
              </div>

              {/* Entity Quick Switcher */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Entity Type</label>
                <div className="grid grid-cols-4 gap-0.5">
                  {[{type: 'LLC', label: 'LLC'}, {type: 'Corp', label: 'Corporation'}, {type: 'PBC', label: 'Public Benefit Corporation'}, {type: 'PC', label: 'Professional Corporation'}].map(({type, label}) => (
                    <button
                      key={type}
                      className={`px-1 py-1 text-xs font-medium rounded border transition-all ${
                        entity === type
                          ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                      }`}
                      onClick={() => handleEntityChange(type as Entity)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Three-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Entity Type & Selectors (1/2 width) */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-blue-500">🏢</span>
                  {STATE_NAMES[state]} {entity === 'PBC' ? 'Public Benefit Corporation' : entity === 'PC' ? 'Professional Corporation' : entity === 'Corp' ? 'Corporation' : entity}
                </h2>
                <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                  Order Summary
                </div>
              </div>

              {/* Entity Description */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {getEntityDescription(entity)}
                </p>
              </div>

              {/* Special Notes from Compliance */}
              {(() => {
                const notes = getComplianceNotes(state, entity);
                return (notes.specialNotes || notes.taxNotes) && (
                  <div className="mb-4 space-y-2">
                    {notes.specialNotes && (
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <h5 className="text-xs font-semibold text-blue-900 mb-2">Special Notes:</h5>
                        <ul className="text-xs text-blue-800 space-y-1">
                          {notes.specialNotes.map((note, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {notes.taxNotes && (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <h5 className="text-xs font-semibold text-green-900 mb-2">Tax Information:</h5>
                        <ul className="text-xs text-green-800 space-y-1">
                          {notes.taxNotes.map((note, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Entity & State Selectors */}
              <div className="space-y-3">
                {/* State Selector */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Jurisdiction</label>
                  <select
                    className="w-full rounded border border-gray-300 px-2 py-1 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={state}
                    onChange={(e)=>setState(e.target.value)}
                  >
                    {(entity === 'PBC' ? PBC_STATES : entity === 'PC' ? PC_STATES : STATES).map(abbr => (
                      <option key={abbr} value={abbr}>{STATE_NAMES[abbr] ?? abbr}</option>
                    ))}
                  </select>
                </div>

                {/* Entity Selector */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Entity Type</label>
                  <div className="grid grid-cols-2 gap-1">
                    {[{type: 'LLC', label: 'LLC'}, {type: 'Corp', label: 'Corporation'}, {type: 'PBC', label: 'Public Benefit Corporation'}, {type: 'PC', label: 'Professional Corporation'}].map(({type, label}) => (
                      <button
                        key={type}
                        className={`px-2 py-1 text-xs font-medium rounded border transition-all ${
                          entity === type
                            ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                        onClick={() => handleEntityChange(type as Entity)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Entity-Specific Form Fields */}
                <div className="mt-4 space-y-4">
                  {/* LLC-specific fields */}
                  {entity === 'LLC' && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-gray-700 border-b pb-1">LLC Formation Details</h3>

                      {/* Primary Name */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                          Primary LLC Name *
                        </label>
                        <input
                          type="text"
                          value={primaryName}
                          onChange={(e) => setPrimaryName(e.target.value)}
                          className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter your desired LLC name"
                        />

                        {/* Name requirements help */}
                        <div className="mt-1 text-xs text-gray-600 bg-blue-50 p-2 rounded border">
                          <div className="font-medium text-blue-800 mb-1">Naming Requirements:</div>
                          <div className="text-blue-700">{getNamingRequirements(entity, state)}</div>
                          {state === 'DE' && (
                            <div className="mt-1">
                              <a href="https://delcode.delaware.gov/title8/c001/sc18/index.shtml#18-102" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Delaware LLC Act § 18-102
                              </a>
                            </div>
                          )}
                          {state === 'CA' && (
                            <div className="mt-1">
                              <a href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=17701.08&lawCode=CORP" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                California Corporations Code § 17701.08
                              </a>
                            </div>
                          )}
                          {state === 'NY' && (
                            <div className="mt-1">
                              <a href="https://www.nysenate.gov/legislation/laws/LTD/203" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                New York LLC Law § 203
                              </a>
                            </div>
                          )}
                          {state === 'TX' && (
                            <div className="mt-1">
                              <a href="https://statutes.capitol.texas.gov/Docs/BO/htm/BO.101.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Texas Business Organizations Code § 101.108
                              </a>
                            </div>
                          )}
                          {state === 'FL' && (
                            <div className="mt-1">
                              <a href="http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0605/0605.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Florida LLC Act § 605.0112
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Name warnings */}
                        {primaryName && nameWarnings.length > 0 && (
                          <div className="mt-1 text-xs text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                            <div className="font-medium mb-1">Name Warnings:</div>
                            <ul className="space-y-1">
                              {nameWarnings.map((warning, i) => (
                                <li key={i}>• {warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Alternative Names */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                          Alternative Name Options (Optional)
                        </label>
                        <div className="space-y-2">
                          {alts.map((alt, index) => (
                            <input
                              key={index}
                              type="text"
                              value={alt}
                              onChange={(e) => {
                                const newAlts = [...alts];
                                newAlts[index] = e.target.value;
                                setAlts(newAlts);
                              }}
                              className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder={`Alternative name ${index + 1}`}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Provide backup names in case your primary choice is unavailable.
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Corporation-specific fields */}
                  {entity === 'Corp' && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-gray-700 border-b pb-1">Corporation Formation Details</h3>

                      {/* Corporate Name */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                          Corporate Name *
                        </label>
                        <input
                          type="text"
                          value={primaryName}
                          onChange={(e) => setPrimaryName(e.target.value)}
                          className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter your desired corporate name"
                        />

                        {/* Name requirements help */}
                        <div className="mt-1 text-xs text-gray-600 bg-blue-50 p-2 rounded border">
                          <div className="font-medium text-blue-800 mb-1">Naming Requirements:</div>
                          <div className="text-blue-700">{getNamingRequirements(entity, state)}</div>
                        </div>

                        {/* Name warnings */}
                        {primaryName && nameWarnings.length > 0 && (
                          <div className="mt-1 text-xs text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                            <div className="font-medium mb-1">Name Warnings:</div>
                            <ul className="space-y-1">
                              {nameWarnings.map((warning, i) => (
                                <li key={i}>• {warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Authorized Shares */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">
                            Authorized Shares *
                          </label>
                          <input
                            type="number"
                            value={authorizedShares}
                            onChange={(e) => setAuthorizedShares(Number(e.target.value))}
                            className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">
                            Par Value
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={hasParValue}
                              onChange={(e) => setHasParValue(e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-700">Has par value</span>
                          </div>
                          {hasParValue && (
                            <input
                              type="number"
                              step="0.001"
                              value={parValue}
                              onChange={(e) => setParValue(Number(e.target.value))}
                              className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1"
                              placeholder="0.001"
                            />
                          )}
                        </div>
                      </div>

                      {/* Incorporator Information */}
                      <div>
                        <div className="mb-2">
                          <span className="text-xs font-medium text-gray-700">Incorporator</span>
                        </div>

                        <div className="space-y-2 bg-gray-50 p-3 rounded border">
                            <div>
                              <label className="text-xs font-medium text-gray-700 block mb-1">
                                Incorporator Name *
                              </label>
                              <input
                                type="text"
                                value={incorporatorName}
                                onChange={(e) => setIncorporatorName(e.target.value)}
                                className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Full legal name"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-700 block mb-1">
                                Incorporator Mailing Address *
                              </label>
                              <textarea
                                value={incorporatorAddress}
                                onChange={(e) => setIncorporatorAddress(e.target.value)}
                                className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Complete mailing address"
                                rows={2}
                              />
                            </div>
                          </div>
                      </div>
                    </div>
                  )}

                  {/* Public Benefit Corporation-specific fields */}
                  {entity === 'PBC' && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-gray-700 border-b pb-1">Public Benefit Corporation Details</h3>

                      {/* Corporate Name */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                          Corporate Name *
                        </label>
                        <input
                          type="text"
                          value={primaryName}
                          onChange={(e) => setPrimaryName(e.target.value)}
                          className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter your desired PBC name"
                        />

                        {/* Name requirements help */}
                        <div className="mt-1 text-xs text-gray-600 bg-blue-50 p-2 rounded border">
                          <div className="font-medium text-blue-800 mb-1">Naming Requirements:</div>
                          <div className="text-blue-700">{getNamingRequirements(entity, state)}</div>
                        </div>
                      </div>

                      {/* Benefit Statement */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                          Benefit Statement *
                        </label>
                        <textarea
                          value={pbcPurpose}
                          onChange={(e) => setPbcPurpose(e.target.value)}
                          className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Describe the specific public benefit purpose(s) your corporation will pursue..."
                          rows={3}
                        />
                        <div className="text-xs text-gray-600 mt-1">
                          Examples: reducing environmental impact, improving human health, promoting economic opportunity for underserved communities, etc.
                        </div>
                      </div>

                      {/* PBC Shares */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">
                            Authorized Shares *
                          </label>
                          <input
                            type="number"
                            value={pbcAuthorizedShares}
                            onChange={(e) => setPbcAuthorizedShares(Number(e.target.value))}
                            className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">
                            Par Value
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={pbcHasParValue}
                              onChange={(e) => setPbcHasParValue(e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-700">Has par value</span>
                          </div>
                          {pbcHasParValue && (
                            <input
                              type="number"
                              step="0.001"
                              value={pbcParValue}
                              onChange={(e) => setPbcParValue(Number(e.target.value))}
                              className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1"
                              placeholder="0.001"
                            />
                          )}
                        </div>
                      </div>

                      {/* Incorporator Information for PBC */}
                      <div>
                        <div className="mb-2">
                          <span className="text-xs font-medium text-gray-700">Incorporator</span>
                        </div>

                        <div className="space-y-2 bg-gray-50 p-3 rounded border">
                            <div>
                              <label className="text-xs font-medium text-gray-700 block mb-1">
                                Incorporator Name *
                              </label>
                              <input
                                type="text"
                                value={incorporatorName}
                                onChange={(e) => setIncorporatorName(e.target.value)}
                                className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Full legal name"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-700 block mb-1">
                                Incorporator Mailing Address *
                              </label>
                              <textarea
                                value={incorporatorAddress}
                                onChange={(e) => setIncorporatorAddress(e.target.value)}
                                className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Complete mailing address"
                                rows={2}
                              />
                            </div>
                          </div>
                      </div>
                    </div>
                  )}

                  {/* Professional Corporation-specific fields */}
                  {entity === 'PC' && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-gray-700 border-b pb-1">Professional Corporation Details</h3>

                      {/* Corporate Name */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                          Professional Corporation Name *
                        </label>
                        <input
                          type="text"
                          value={primaryName}
                          onChange={(e) => setPrimaryName(e.target.value)}
                          className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter your desired PC name"
                        />

                        {/* Name requirements help */}
                        <div className="mt-1 text-xs text-gray-600 bg-blue-50 p-2 rounded border">
                          <div className="font-medium text-blue-800 mb-1">Naming Requirements:</div>
                          <div className="text-blue-700">{getNamingRequirements(entity, state)}</div>
                        </div>
                      </div>

                      {/* Professional License Type */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                          Licensed Profession *
                        </label>
                        <select
                          value={pcProfession}
                          onChange={(e) => handleProfessionChange(e.target.value)}
                          className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select profession...</option>
                          <option value="attorney">Attorney/Lawyer</option>
                          <option value="physician">Physician/Doctor</option>
                          <option value="dentist">Dentist</option>
                          <option value="accountant">Accountant/CPA</option>
                          <option value="architect">Architect</option>
                          <option value="engineer">Engineer</option>
                          <option value="psychologist">Psychologist</option>
                          <option value="chiropractor">Chiropractor</option>
                          <option value="other">Other Licensed Profession</option>
                        </select>

                        {pcProfession === 'other' && (
                          <input
                            type="text"
                            value={pcProfessionOther}
                            onChange={(e) => setPcProfessionOther(e.target.value)}
                            className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2"
                            placeholder="Specify your licensed profession"
                          />
                        )}
                      </div>

                      {/* Professional Service Description */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                          Professional Service Description *
                        </label>
                        <textarea
                          value={pcServiceDescription}
                          onChange={(e) => setPcServiceDescription(e.target.value)}
                          className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Describe the professional services to be provided..."
                          rows={3}
                        />
                        <div className="text-xs text-gray-600 mt-1">
                          Describe the specific professional services the corporation will provide, consistent with the licensing requirements.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Registered Agent Section */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-gray-700">Registered Agent Service</h3>
                    <button
                      onClick={() => setRegAgentHelpOpen(true)}
                      className="text-blue-600 hover:text-blue-800 text-xs underline"
                    >
                      What is this?
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Registered Agent Checkbox */}
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={registeredAgent}
                        onChange={(e) => setRegisteredAgent(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-700">Professional Registered Agent Service ($199/year)</span>
                    </label>

                    {/* Help text */}
                    <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border">
                      {state === 'DE' ? (
                        <span className="text-blue-800">
                          <strong>Required in Delaware:</strong> All entities must have a Delaware registered agent.
                          Professional service provides privacy and ensures compliance.
                        </span>
                      ) : (
                        <span className="text-blue-800">
                          Registered agents receive official legal documents. Professional service offers privacy protection and reliable handling.
                        </span>
                      )}
                    </div>

                    {/* Conditional fields when unchecked */}
                    {!registeredAgent && (
                      <div className="bg-orange-50 border border-orange-200 rounded p-3 space-y-2">
                        <div className="text-xs font-medium text-orange-800 mb-2">
                          Provide Your Own Registered Agent Information:
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">
                            Registered Agent Full Name *
                          </label>
                          <input
                            type="text"
                            value={ownAgentName}
                            onChange={(e) => setOwnAgentName(e.target.value)}
                            className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Full legal name"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">
                            {state === 'DE' ? 'Delaware Street Address *' : `${state} Street Address *`}
                          </label>
                          <textarea
                            value={ownAgentAddress}
                            onChange={(e) => setOwnAgentAddress(e.target.value)}
                            className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Street address (no P.O. boxes)"
                            rows={2}
                            required
                          />
                        </div>

                        <div className="text-xs text-orange-700">
                          <strong>Note:</strong> This address will become public record and the agent must be available during business hours to receive legal documents.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Services */}
                <div className="mt-4">
                  <h3 className="text-xs font-semibold text-gray-700 mb-2">Additional Services</h3>
                  <div className="space-y-2">

                    {/* EIN Assistance */}
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={einAssistance}
                        onChange={(e) => setEinAssistance(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-700">EIN Assistance ($99)</span>
                    </label>

                    {/* S-Corp Election */}
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={sCorpElection}
                        onChange={(e) => setSCorpElection(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-700">S-Corp Election ($149)</span>
                    </label>

                    {/* Custom Documents */}
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={customDocuments}
                        onChange={(e) => setCustomDocuments(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-700">Custom Bylaws/Operating Agreement ($299)</span>
                    </label>

                    {/* Consultation */}
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={consultation}
                        onChange={(e) => setConsultation(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-700">Attorney Consultation ($199)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Information (1/3 width) */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-1">
                <span className="text-blue-500">📋</span>
                Compliance Overview
              </h3>

              {/* Enhanced Compliance Panel */}
              <CompliancePanel state={state} entity={entity} speed={speed} />

              {requirements.length ? (
                <div className="space-y-4">

                  {/* Formation Document Info Card - Only show if valid URL exists */}
                  {(() => {
                    const formationUrl = getFormationDocumentUrl(state, entity);
                    return formationUrl && formationUrl !== 'https://terms.law' ? (
                      <div className="bg-white rounded-lg p-3 border border-blue-200 mb-4">
                        <h4 className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Formation Document
                        </h4>
                        <div className="text-xs text-blue-800 space-y-1">
                          <div>Required {STATE_NAMES[state]} {entity} formation document</div>
                          <a
                            href={formationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline block"
                          >
                            View {getFormationDocumentName(state, entity)} Form
                          </a>
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* Personalized Filing Information */}
                  <div className="bg-white rounded-lg p-3 border border-blue-200 mb-4">
                    <div className="text-xs font-medium text-blue-900 mb-2">📅 Your Filing Timeline & Future Requirements</div>
                    <div className="text-xs text-blue-800 space-y-1">
                      <div>If you order today with <strong>{SPEEDS[speed].label.toLowerCase()}</strong> processing, your incorporation will be complete by <strong>{timeline.estimatedCompletion.replace('Expected completion: ', '')}</strong>.</div>

                      {/* Delaware Filing Information */}
                      {state === 'DE' && (entity === 'Corp' || entity === 'PBC' || entity === 'PC') && (
                        <div className="mt-2 pt-2 border-t border-blue-100">
                          <div className="font-medium mb-1">Your next filings will be:</div>
                          <div>• <strong>March 1, 2026:</strong> <a href="https://corp.delaware.gov/paytaxes/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Annual Report ($50) + Franchise Tax</a> | <a href="https://corp.delaware.gov/paytaxes/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Tax Info</a> | <a href="https://revenue.delaware.gov/business-tax-forms/franchise-taxes/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Tax Overview</a></div>
                          <div className="ml-4 text-xs text-blue-600">
                            You currently have {(entity === 'PBC' ? pbcAuthorizedShares : authorizedShares).toLocaleString()} authorized shares.
                            {(entity === 'PBC' ? pbcAuthorizedShares : authorizedShares) <= 5000 ?
                              ` Tax will be $175 minimum (Authorized Shares Method)` :
                              ` Tax will be $${Math.max(175, Math.ceil((entity === 'PBC' ? pbcAuthorizedShares : authorizedShares) / 10000) * 85)} (Authorized Shares Method) or $400+ (APVC Method)`
                            }
                          </div>
                          <div className="ml-4 text-xs text-blue-600">
                            If you later issue up to {Math.min((entity === 'PBC' ? pbcAuthorizedShares : authorizedShares), Math.floor(totalGrossAssets / 1000000 * (entity === 'PBC' ? pbcAuthorizedShares : authorizedShares))).toLocaleString()} shares with ${totalGrossAssets.toLocaleString()} in assets, you'll pay the $400 minimum APVC.
                          </div>

                          {/* Delaware Tax Calculator Button */}
                          <div className="flex items-center justify-between mt-2">
                            <span>• <strong>Calculate Your Franchise Tax:</strong> Estimate annual Delaware tax burden</span>
                            <button
                              onClick={() => setShowDETaxCalc(!showDETaxCalc)}
                              className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                              {showDETaxCalc ? 'Hide' : 'Show'} Calculator
                            </button>
                          </div>

                          {/* Delaware Tax Calculator */}
                          {showDETaxCalc && (
                            <div className="mt-3">
                              <TaxCalculator state={state} entity={entity} />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Delaware LLC Filing Information */}
                      {state === 'DE' && entity === 'LLC' && (
                        <div className="mt-2 pt-2 border-t border-blue-100">
                          <div className="font-medium mb-1">Your next filings will be:</div>
                          <div>• <strong>June 1, 2026:</strong> <a href="https://corp.delaware.gov/paytaxes/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Annual Tax Payment ($300)</a> | <a href="https://www.corp.delaware.gov/llctax/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">LLC Tax Info</a></div>
                          <div className="ml-4 text-xs text-blue-600">
                            Delaware LLCs pay a flat $300 annual tax. No minimum revenue threshold - all LLCs pay this amount regardless of income.
                          </div>
                          <div className="ml-4 text-xs text-blue-600">
                            No annual report filing required for LLCs - just the tax payment by June 1st.
                          </div>
                        </div>
                      )}

                      {/* California LLC Filing Information with Tax Calculator */}
                      {state === 'CA' && entity === 'LLC' && (
                        <div className="mt-2 pt-2 border-t border-blue-100">
                          <div className="font-medium mb-1">Your next filings will be:</div>
                          <div>• <strong>Within 90 days:</strong> <a href="https://bizfileonline.sos.ca.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Statement of Information</a> ($20) | <a href="https://www.sos.ca.gov/business-programs/business-entities/statements" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Help & Timing</a></div>
                          <div>• <strong>Every 2 years thereafter:</strong> Biennial <a href="https://bizfileonline.sos.ca.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Statement of Information</a> ($20) due by end of anniversary month</div>
                          <div>• <strong>Annually by April 15th:</strong> <a href="https://webapp.ftb.ca.gov/webpay/login/belogin" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Franchise Tax</a> ($800 minimum - no first-year exemption) | <a href="https://www.ftb.ca.gov/file/business/types/limited-liability-company/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">LLC Tax Info</a> | <a href="https://www.ftb.ca.gov/forms/2025/2025-3522.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Form 3522</a></div>

                          {/* CA LLC Additional Fee with Calculator */}
                          <div className="flex items-center justify-between mt-1">
                            <span>• <strong>Additional LLC Fee:</strong> Gross receipts-based fee tiers ($900-$11,790)</span>
                            <button
                              onClick={() => setShowCALLCFeeCalc(!showCALLCFeeCalc)}
                              className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                              {showCALLCFeeCalc ? 'Hide' : 'Show'} Calculator
                            </button>
                          </div>

                          {/* CA LLC Fee Calculator */}
                          {showCALLCFeeCalc && (
                            <div className="mt-3 bg-amber-50 rounded p-3 border border-amber-200">
                              <div className="text-xs font-medium text-blue-900 mb-2">California LLC Gross Receipts Fee Calculator</div>
                              <div className="space-y-2">
                                <div>
                                  <label className="text-xs font-medium text-gray-700 block mb-1">
                                    Estimated Annual Gross Receipts ($)
                                  </label>
                                  <input
                                    type="number"
                                    value={caIncomeAmount}
                                    onChange={(e) => setCaIncomeAmount(Number(e.target.value))}
                                    className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter gross receipts"
                                    min="0"
                                  />
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <div className="text-xs font-medium text-gray-800 mb-1">Fee Calculation:</div>
                                  <div className="text-xs text-gray-700">
                                    <div><strong>Income Tier:</strong> {getCAFeeTier(caIncomeAmount)}</div>
                                    <div className="text-lg font-bold text-green-700 mt-1">
                                      Additional Fee: ${calculateCALLCFee(caIncomeAmount).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-600">
                                  <div><strong>Note:</strong> This is in addition to the $800 minimum franchise tax.</div>
                                  <div>Total annual California tax burden: <strong>${(800 + calculateCALLCFee(caIncomeAmount)).toLocaleString()}</strong></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* California Corp Filing Information */}
                      {state === 'CA' && entity === 'Corp' && (
                        <div className="mt-2 pt-2 border-t border-blue-100">
                          <div className="font-medium mb-1">Your next filings will be:</div>
                          <div>• <strong>Within 90 days:</strong> <a href="https://bizfileonline.sos.ca.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Statement of Information</a> ($25) | <a href="https://www.sos.ca.gov/business-programs/business-entities/statements" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Help & Timing</a></div>
                          <div>• <strong>Annually thereafter:</strong> <a href="https://bizfileonline.sos.ca.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Statement of Information</a> ($25) due by end of anniversary month</div>
                          <div>• <strong>Annually by March 15th:</strong> <a href="https://webapp.ftb.ca.gov/webpay/login/belogin" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Franchise Tax</a> ($800 minimum - first-year minimum waived)</div>
                        </div>
                      )}

                      {/* Other state-specific content would continue here for brevity... */}
                    </div>
                  </div>

                  {/* Requirements display */}
                  <div className="space-y-3">
                    {(showAllRequirements ? requirements : requirements.slice(0, 2)).map((req, index) => {
                      const dueDate = calculateDueDate(req);
                      return (
                        <div key={index} className="bg-white rounded-lg p-3 border border-blue-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{getRequirementIcon(req.type)}</span>
                              <div>
                                <h5 className="font-medium text-gray-900 text-xs">
                                  {req.name}
                                </h5>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${getFrequencyColor(req.frequency)}`}>
                                    {req.frequency}
                                  </span>
                                  {req.type !== 'one-time' && (
                                    <span className="text-xs text-gray-600">
                                      Due: {formatDueDate(dueDate)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs text-gray-600 space-y-1">
                            {req.feeFlat && (
                              <div>Fee: <span className="font-medium">${req.feeFlat}</span></div>
                            )}
                            {req.feesDescription && (
                              <div>Fee: <span className="font-medium">{req.feesDescription}</span></div>
                            )}
                            {req.penalties && (
                              <div className="text-red-600">Penalty: {req.penalties}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {requirements.length > 2 && (
                    <div className="mt-2 text-center">
                      <button
                        onClick={() => setShowAllRequirements(!showAllRequirements)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                      >
                        {showAllRequirements ?
                          'Show less' :
                          requirements.length - 2 === 1 ?
                            '+1 more requirement' :
                            `+${requirements.length - 2} more requirements`
                        }
                      </button>
                    </div>
                  )}

                  {/* Non-Resident Founders */}
                  <div className="mt-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <h3 className="text-sm font-semibold text-amber-900 mb-2">Non-Resident Founders (U.S. LLCs & Corps)</h3>
                      <div className="text-xs text-amber-800 space-y-2">
                        <p><strong>Foreign-owned single-member U.S. LLC:</strong> Must file <a href="https://www.irs.gov/forms-pubs/about-form-5472" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-800 underline font-medium">Form 5472</a> (with pro-forma <a href="https://www.irs.gov/forms-pubs/about-form-1120" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-800 underline font-medium">1120</a>) if it has reportable transactions with its foreign owner/related parties. Penalty: $25,000 per failure.</p>
                        <p>Tax exposure depends on activities: U.S.-source <button onClick={() => setShowFDAPHelp(!showFDAPHelp)} className="text-amber-600 hover:text-amber-800 underline font-medium">FDAP income</button> generally subject to 30% withholding unless reduced by treaty; <button onClick={() => setShowECIHelp(!showECIHelp)} className="text-amber-600 hover:text-amber-800 underline font-medium">ECI/USTB</button> taxed on net basis at graduated rates.</p>

                        {showFDAPHelp && (
                          <div className="bg-amber-100 border border-amber-300 rounded p-2 mt-2">
                            <div className="font-medium text-amber-900 mb-1">FDAP Income:</div>
                            <div className="text-amber-800">Fixed, Determinable, Annual, or Periodical income includes dividends, interest, rents, royalties, and other passive income. Generally subject to 30% withholding tax (may be reduced by tax treaty).</div>
                          </div>
                        )}

                        {showECIHelp && (
                          <div className="bg-amber-100 border border-amber-300 rounded p-2 mt-2">
                            <div className="font-medium text-amber-900 mb-1">ECI/USTB:</div>
                            <div className="text-amber-800">Effectively Connected Income / U.S. Trade or Business. Income from active business operations in the U.S. is taxed on net basis at regular graduated rates (like U.S. persons).</div>
                          </div>
                        )}

                        <div>
                          <div className="font-medium mb-1">Quick tips:</div>
                          <ul className="space-y-1">
                            <li>• <a href="https://www.irs.gov/forms-pubs/about-form-5472" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-800 underline">Form 5472</a> required for any reportable transactions (capital contributions, loans, service payments)</li>
                            <li>• Treaty benefits usually apply at owner level for pass-through LLCs</li>
                            <li>• Always pair with correct <a href="https://www.irs.gov/forms-pubs/about-form-w-8-ben" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-800 underline">W-8 form</a> and keep on file</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Beneficial Ownership */}
                  <div className="mt-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <h3 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <span>📋</span>
                        Beneficial Ownership (BOI) reporting — who still files?
                        <button
                          onClick={() => setShowBOIDetails(!showBOIDetails)}
                          className="text-green-600 hover:text-green-800 text-xs underline ml-2"
                        >
                          {showBOIDetails ? 'Hide' : 'Show'} Details
                        </button>
                      </h3>
                      <div className="text-xs text-green-800 space-y-2">
                        <p><strong>BOI status:</strong> No BOI filing required under current FinCEN rule for U.S.-created entities. Keep your formation confirmation for your records.</p>
                        <p>As of Mar 26, 2025, U.S.-created entities (LLCs, corporations, etc.) do not file BOI reports with FinCEN. Only foreign entities registered to do business in a U.S. state must file. Filing is free and done online.</p>

                        {showBOIDetails && (
                          <div className="bg-green-100 border border-green-300 rounded p-2 mt-2 space-y-2">
                            <div className="font-medium text-green-900">What changed:</div>
                            <div className="text-green-800">The CTA was designed to combat money laundering by requiring beneficial ownership disclosure. However, courts have ruled that the disclosure requirements for domestic entities are unconstitutional.</div>
                            <div className="font-medium text-green-900">Who still files:</div>
                            <ul className="text-green-800 space-y-1">
                              <li>• Foreign entities registered to do business in any U.S. state</li>
                              <li>• Entities that voluntarily choose to file for transparency</li>
                              <li>• Entities formed before the rule change that haven't filed yet</li>
                            </ul>
                            <div className="font-medium text-green-900">Keep your records:</div>
                            <div className="text-green-800">Save your Articles/Certificate of Incorporation as proof of domestic formation status.</div>
                          </div>
                        )}

                        <div>
                          <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 underline font-medium">FinCEN BOI hub</a> |
                          <a href="https://www.fincen.gov/beneficial-ownership-information-frequently-asked-questions" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 underline ml-1">More details</a> |
                          <a href="https://www.fincen.gov/boi-filing" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 underline ml-1">File BOI (foreign entities)</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card p-4 bg-blue-50 border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Compliance Preview
                  </h4>
                  <p className="text-xs text-blue-700">
                    N/A
                  </p>
                </div>
              )}
            </div>

            {/* Live Quote (1/3 width) */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-1">
                <span className="text-green-500">💰</span>
                Live Quote
              </h3>
              <LiveQuote
                state={state}
                entity={entity}
                primaryName={primaryName}
                alts={alts}
                owners={owners}
                speed={speed}
                onSpeedChange={setSpeed}
                registeredAgent={registeredAgent}
                einAssistance={einAssistance}
                expeditedProcessing={false}
                resalePermit={false}
                bankingResolution={false}
                consultation={consultation}
                sCorpElection={sCorpElection}
                customDocuments={customDocuments}
                authorizedShares={entity === 'PBC' ? pbcAuthorizedShares : authorizedShares}
                issuedShares={issuedShares}
                totalGrossAssets={totalGrossAssets}
                onIssuedSharesChange={setIssuedShares}
                onTotalGrossAssetsChange={setTotalGrossAssets}
                delawareTax={delawareTax}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* FILING DOCUMENT PREVIEW VIEW */}
          {state === 'DE' && entity === 'PBC' ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delaware PBC Certificate of Incorporation Preview</h3>
                <p className="text-gray-600">Copy this document and file with Delaware</p>
                <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2">
                  <button
                    onClick={() => {
                      const certificateText = buildCertificateText();
                      if (navigator?.clipboard?.writeText) {
                        navigator.clipboard.writeText(certificateText);
                      }
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    📋 Copy to Clipboard
                  </button>

                  <button
                    onClick={() => {
                      const certificateHtml = buildCertificateHtml();
                      const docContent = `<!DOCTYPE html><html><head><meta charset="utf-8" /></head><body>${certificateHtml}</body></html>`;
                      const blob = new Blob([docContent], { type: 'application/msword' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      const safeName = (primaryName.trim() || 'Draft').replace(/[^A-Za-z0-9]+/g, '_');
                      link.href = url;
                      link.download = `Delaware_PBC_Certificate_${safeName}.doc`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                    className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-700"
                  >
                    ⬇️ Download Word (.doc)
                  </button>
                </div>
              </div>

              <div id="certificate-content" className="bg-gray-50 p-6 rounded border font-mono text-sm leading-relaxed">
                <div className="mb-4 text-center font-bold uppercase">
                  STATE OF DELAWARE<br/>
                  CERTIFICATE OF INCORPORATION<br/>
                  A PUBLIC BENEFIT CORPORATION
                </div>

                <div className="space-y-4">
                  <p>The undersigned Incorporator hereby certifies as follows:</p>

                  <p><strong>1.</strong> The name of the Corporation is <span className="underline font-semibold">{corporationNamePreview}</span>.</p>

                  <p><strong>2.</strong> The Registered Office of the corporation in the State of Delaware is located at:</p>
                  <div className="ml-4 whitespace-pre-line font-semibold underline">
                    {agentAddressForPreview}
                  </div>

                  <p>The name of the Registered Agent at such address upon whom process against this corporation may be served is:</p>
                  <div className="ml-4">
                    <p className="font-semibold underline">{agentNameForPreview}</p>
                  </div>

                  <p><strong>3.</strong> The specific public benefit purpose of the corporation is to:</p>
                  <div className="ml-4">
                    <p className="whitespace-pre-line font-semibold">{pbcPurpose.trim() || '__'.repeat(16)}</p>
                  </div>

                  <p><strong>4.</strong> The total amount of stock this corporation is authorized to issue is <span className="underline font-semibold">{authorizedSharesDisplay}</span> shares with a par value of $<span className="underline font-semibold">{parValueDisplay}</span> per share.</p>

                  <p><strong>5.</strong> The name and mailing address of the incorporator are as follows:</p>
                  <div className="ml-4">
                    <p>Name: <span className="underline font-semibold">{incorporatorNamePreview}</span></p>
                    <p>Mailing Address:</p>
                    <div className="ml-4">
                      {incorporatorAddressPreview.split('\n').map((line, i) => (
                        <p key={i} className="font-semibold">{line}</p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <p>By: ________________________________</p>
                    <p className="ml-8">Incorporator</p>
                    <br/>
                    <p>Name: <span className="underline font-semibold">{incorporatorNamePreview}</span></p>
                    <p className="ml-12 text-xs">(Print or Type)</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Filing Document Preview</h3>
              <p className="text-gray-600">Preview available for Delaware PBC when both DE and PBC are selected</p>
            </div>
          )}
        </div>
      )}
      </div>

      {/* Modals */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Name Check Results</h3>
            <p className="text-gray-600 mb-4">Your requested company name is available!</p>
            <button
              onClick={() => setShowNameModal(false)}
              className="btn-primary w-full"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <HelpModal
        isOpen={entityHelpOpen}
        onClose={() => setEntityHelpOpen(false)}
        title="Business Structure Comparison"
        items={entityHelpData}
      />

      <RegisteredAgentHelp
        isOpen={regAgentHelpOpen}
        onClose={() => setRegAgentHelpOpen(false)}
        state={state}
      />
    </>
  );
}
