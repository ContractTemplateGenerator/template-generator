export interface FormData {
  // Parties Information
  sellerName: string;
  sellerEntity: string;
  sellerAddress: string;
  buyerName: string;
  buyerEntity: string;
  buyerAddress: string;
  
  // Stock Information
  agreementDate: string;
  companyName: string;
  sharesNumber: string;
  shareType: string;
  purchasePrice: string;
  closingDate: string;
  
  // Additional Representations
  sellerReps: string[];
  buyerReps: string[];
  customReps: string;
  
  // Legal Terms
  governingLaw: string;
  disputeResolution: string;
  confidentiality: string;
  customTerms: string;
  
  // Signature Information
  sellerSignatory: string;
  sellerTitle: string;
  buyerSignatory: string;
  buyerTitle: string;
}

export interface FormFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'date' | 'textarea' | 'select';
  placeholder?: string;
  helper?: string;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
}

export interface OptionItem {
  value: string;
  label: string;
  description: string;
}

export interface CheckboxGroupProps {
  label: string;
  name: string;
  options: OptionItem[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export interface RadioGroupProps {
  label: string;
  name: string;
  options: OptionItem[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export interface StepProps {
  isActive: boolean;
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  nextButtonText?: string;
}

export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
}

export interface PreviewProps {
  formData: FormData;
  isPaid: boolean;
  currentStep: number;
  highlightedField?: string;
  onPaymentComplete: () => void;
}

export interface PaymentState {
  isPaid: boolean;
  transactionId?: string;
  showSuccess: boolean;
  showPaywall: boolean;
}

export interface DocumentGeneratorProps {
  formData: FormData;
  onDownload: () => void;
  onCopy: () => void;
}

export const STEP_NAMES = [
  'Parties Information',
  'Stock Information', 
  'Additional Representations',
  'Legal Terms',
  'Signature Information'
] as const;

export const TOTAL_STEPS = STEP_NAMES.length;

export const DEFAULT_FORM_DATA: FormData = {
  sellerName: 'ABC Corporation',
  sellerEntity: 'corporation',
  sellerAddress: '123 Business Avenue, Wilmington, Delaware 19801',
  buyerName: 'XYZ Ventures, Inc.',
  buyerEntity: 'corporation',
  buyerAddress: '456 Tech Boulevard, San Francisco, California 94107',
  agreementDate: new Date().toISOString().split('T')[0],
  companyName: 'Tech Innovations, Inc.',
  sharesNumber: '1000',
  shareType: 'common stock',
  purchasePrice: '50000',
  closingDate: '',
  sellerReps: ['no-conflicts', 'ownership', 'no-litigation'],
  buyerReps: ['financial-ability', 'accredited'],
  customReps: '',
  governingLaw: 'Delaware',
  disputeResolution: 'arbitration',
  confidentiality: 'standard',
  customTerms: '',
  sellerSignatory: 'John Smith',
  sellerTitle: 'Chief Executive Officer',
  buyerSignatory: 'Jane Doe',
  buyerTitle: 'Managing Partner'
};

export const SELLER_REP_OPTIONS: OptionItem[] = [
  {
    value: 'no-conflicts',
    label: 'No Conflicts',
    description: 'Seller represents that the transfer does not conflict with other agreements'
  },
  {
    value: 'ownership',
    label: 'Full Ownership',
    description: 'Seller represents they are the sole owner of the shares'
  },
  {
    value: 'no-litigation',
    label: 'No Pending Litigation',
    description: 'Seller represents there is no pending litigation affecting the shares'
  },
  {
    value: 'comp-good-standing',
    label: 'Company in Good Standing',
    description: 'Seller represents that the company whose shares are being transferred is in good standing'
  }
];

export const BUYER_REP_OPTIONS: OptionItem[] = [
  {
    value: 'financial-ability',
    label: 'Financial Ability',
    description: 'Buyer represents they have the financial ability to complete the purchase'
  },
  {
    value: 'accredited',
    label: 'Accredited Investor',
    description: 'Buyer represents they are an accredited investor (if applicable)'
  },
  {
    value: 'investment-purpose',
    label: 'Investment Purpose',
    description: 'Buyer represents they are purchasing for investment purposes, not distribution'
  }
];

export const DISPUTE_RESOLUTION_OPTIONS: OptionItem[] = [
  {
    value: 'arbitration',
    label: 'Binding Arbitration',
    description: 'Disputes will be resolved through binding arbitration'
  },
  {
    value: 'litigation',
    label: 'Court Litigation',
    description: 'Disputes will be resolved through the court system'
  },
  {
    value: 'mediation-arbitration',
    label: 'Mediation then Arbitration',
    description: 'Disputes will first go to mediation, then to binding arbitration if unresolved'
  }
];

export const CONFIDENTIALITY_OPTIONS: OptionItem[] = [
  {
    value: 'standard',
    label: 'Standard Confidentiality',
    description: 'Both parties agree to keep the terms of the agreement confidential'
  },
  {
    value: 'enhanced',
    label: 'Enhanced Confidentiality',
    description: 'Additional confidentiality provisions including business information and trade secrets'
  },
  {
    value: 'none',
    label: 'No Confidentiality',
    description: 'No specific confidentiality provisions'
  }
];