export interface MarketplaceInfo {
  marketplaceName: string;
  marketplaceUrl: string;
  companyName: string;
  companyAddress: string;
  contactEmail: string;
}

export interface CommissionStructure {
  commissionPercentage: number;
  flatFee: number;
  paymentSchedule: string;
  paymentMethod: string;
}

export interface ProductRequirements {
  prohibitedItems: string;
  listingRequirements: string;
  qualityStandards: string;
  imageRequirements: string;
}

export interface FulfillmentReturns {
  fulfillmentResponsibility: string;
  shippingTimeframe: string;
  returnPolicy: string;
  returnTimeframe: number;
  customerServiceResponsibility: string;
}

export interface TerminationTerms {
  noticePeriod: number;
  terminationReasons: string;
  postTerminationObligations: string;
  dataRetention: string;
}

export interface LegalTerms {
  governingLaw: string;
  disputeResolution: string;
  limitationOfLiability: string;
  intellectualProperty: string;
}

export interface AgreementData {
  marketplaceInfo: MarketplaceInfo;
  commissionStructure: CommissionStructure;
  productRequirements: ProductRequirements;
  fulfillmentReturns: FulfillmentReturns;
  terminationTerms: TerminationTerms;
  legalTerms: LegalTerms;
}

export interface PaymentState {
  isPaymentCompleted: boolean;
  transactionId?: string;
  paymentDate?: string;
}