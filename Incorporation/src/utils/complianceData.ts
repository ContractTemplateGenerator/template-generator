// Compliance requirements data for different states and entity types
import { STATE_NAMES } from './states';
export interface ComplianceRequirement {
  name: string;
  dueRule: 'fixed_month_day' | 'anniversary_month' | 'within_days' | 'anniversary_last_day';
  month?: number;
  day?: number;
  days?: number;
  feeFlat?: number;
  feesDescription?: string;
  frequency: 'initial' | 'annual' | 'biennial' | 'one-time';
  type: 'filing' | 'tax' | 'license' | 'publication' | 'report';
  penalties?: string;
  citations?: string[];
  warnings?: ComplianceWarning[];
}

export interface ComplianceWarning {
  condition: string;
  text: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface StateCompliance {
  [entityType: string]: {
    requirements: ComplianceRequirement[];
    specialNotes?: string[];
    taxNotes?: string[];
  };
}

export const COMPLIANCE_DATA: Record<string, StateCompliance> = {
  DE: {
    corp: {
      requirements: [
        {
          name: 'Annual Report & Franchise Tax',
          dueRule: 'fixed_month_day',
          month: 3,
          day: 1,
          feesDescription: 'Report $50. Franchise tax: lesser of Authorized Shares or APVC method',
          frequency: 'annual',
          type: 'filing',
          penalties: '$200 + 1.5%/month interest if late',
          citations: ['https://corp.delaware.gov/frtax/'],
          warnings: [
            {
              condition: 'authorized_shares > 5000',
              text: 'Authorizing &gt;5,000 shares increases tax under Authorized Shares Method. Consider APVC method.',
              severity: 'warning'
            }
          ]
        }
      ],
      taxNotes: [
        'Franchise tax calculated using lesser of: (1) Authorized Shares Method or (2) Assumed Par Value Capital Method',
        'Authorized Shares: ≤5,000 = $175; 5,001-10,000 = $250; each additional 10,000 = +$85'
      ]
    },
    llc: {
      requirements: [
        {
          name: 'Annual LLC Tax',
          dueRule: 'fixed_month_day',
          month: 6,
          day: 1,
          feeFlat: 300,
          frequency: 'annual',
          type: 'tax',
          penalties: '$200 + 1.5%/month if late',
          citations: ['https://corp.delaware.gov/alt-entitytaxinstructions/']
        }
      ],
      specialNotes: ['No annual report required - only tax payment']
    },
    pbc: {
      requirements: [
        {
          name: 'Annual Report & Franchise Tax',
          dueRule: 'fixed_month_day',
          month: 3,
          day: 1,
          feesDescription: 'Report $50. Franchise tax: lesser of Authorized Shares or APVC method (same as regular Corp)',
          frequency: 'annual',
          type: 'filing',
          penalties: '$200 + 1.5%/month interest if late',
          citations: [
            'https://corp.delaware.gov/paytaxes/',
            'https://corpfiles.delaware.gov/PBC_Certificate.pdf'
          ],
          warnings: [
            {
              condition: 'authorized_shares > 5000',
              text: 'Authorizing &gt;5,000 shares increases tax under Authorized Shares Method. Consider APVC method.',
              severity: 'warning'
            }
          ]
        },
        {
          name: 'PBC Stockholder Report',
          dueRule: 'anniversary_month',
          frequency: 'biennial',
          type: 'report',
          feesDescription: 'No state filing fee - delivered to stockholders only',
          penalties: 'No state penalty (internal governance requirement)',
          citations: ['https://delcode.delaware.gov/title8/c001/sc15/#:~:text=incorporation%20so%20provides.-,79%20Del.,or%20public%20benefits%20and%20interests.']
        }
      ],
      specialNotes: [
        'Name must contain "Public Benefit Corporation," "P.B.C." or "PBC" OR provide conspicuous notice on share certificates',
        'Certificate must identify specific public benefit(s) to be promoted',
        'Directors must balance stockholders, stakeholders, and public benefit interests',
        'Biennial stockholder report required but not filed with state'
      ],
      taxNotes: [
        'Same franchise tax as regular corporations - calculated using lesser of Authorized Shares or APVC method',
        'Authorized Shares: ≤5,000 = $175; 5,001-10,000 = $250; each additional 10,000 = +$85'
      ]
    },
    pc: {
      requirements: [
        {
          name: 'Annual Report & Franchise Tax',
          dueRule: 'fixed_month_day',
          month: 3,
          day: 1,
          feesDescription: 'Report $50. Franchise tax: lesser of Authorized Shares or APVC method',
          frequency: 'annual',
          type: 'filing',
          penalties: '$200 + 1.5%/month interest if late',
          citations: ['https://corp.delaware.gov/paytaxes/']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be Delaware-licensed individuals for that profession',
        'Name must contain "chartered" or "P.A." (not "Corp." or "Inc.")',
        'Annual report may require certification of shareholder/officer licensing',
        'PC may not engage in other businesses beyond professional services'
      ],
      taxNotes: [
        'Same franchise tax as regular corporations - minimum $175',
        'Authorized Shares: ≤5,000 = $175; 5,001-10,000 = $250; each additional 10,000 = +$85'
      ]
    }
  },
  CA: {
    corp: {
      requirements: [
        {
          name: 'Statement of Information (SI-550)',
          dueRule: 'within_days',
          days: 90,
          feeFlat: 25,
          frequency: 'initial',
          type: 'filing',
          citations: ['https://www.sos.ca.gov/business-programs/business-entities/forms']
        },
        {
          name: 'Annual Statement of Information',
          dueRule: 'anniversary_month',
          feeFlat: 25,
          frequency: 'annual',
          type: 'filing',
          citations: ['https://www.sos.ca.gov/business-programs/business-entities/forms']
        }
      ],
      taxNotes: ['$800 minimum franchise tax applies annually to most corporations']
    },
    llc: {
      requirements: [
        {
          name: 'Statement of Information (LLC-12)',
          dueRule: 'within_days',
          days: 90,
          feeFlat: 20,
          frequency: 'initial',
          type: 'filing',
          citations: ['https://www.sos.ca.gov/business-programs/business-entities/forms']
        },
        {
          name: 'Biennial Statement of Information',
          dueRule: 'anniversary_month',
          feeFlat: 20,
          frequency: 'biennial',
          type: 'filing',
          citations: ['https://www.sos.ca.gov/business-programs/business-entities/forms']
        }
      ],
      taxNotes: [
        'First-year $800 LLC tax waiver applies (as of 2024)',
        '$800 annual tax due thereafter'
      ],
      specialNotes: ['LLCs exempt from $800 tax in first tax year']
    },
    pbc: {
      requirements: [
        {
          name: 'Statement of Information (SI-550)',
          dueRule: 'within_days',
          days: 90,
          feeFlat: 25,
          frequency: 'initial',
          type: 'filing',
          citations: ['https://bizfileonline.sos.ca.gov/forms']
        },
        {
          name: 'Annual Statement of Information',
          dueRule: 'anniversary_month',
          feeFlat: 25,
          frequency: 'annual',
          type: 'filing',
          citations: ['https://bizfileonline.sos.ca.gov/forms']
        },
        {
          name: 'Annual Benefit Report',
          dueRule: 'within_days',
          days: 120,
          frequency: 'annual',
          type: 'report',
          feesDescription: 'Must be posted on public website if available',
          penalties: 'No state penalty (governance requirement)',
          citations: ['https://law.justia.com/codes/california/code-corp/title-1/division-3/part-13/chapter-1/section-14630/']
        }
      ],
      specialNotes: [
        'No special suffix required - benefit status declared in articles',
        'Articles must state "This corporation is a benefit corporation"',
        'Must identify specific public benefit(s) in articles',
        'Benefit report must be posted on website if corporation has one'
      ],
      taxNotes: ['Same $800 minimum franchise tax as regular corporations']
    },
    pc: {
      requirements: [
        {
          name: 'Statement of Information (SI-550)',
          dueRule: 'within_days',
          days: 90,
          feeFlat: 25,
          frequency: 'initial',
          type: 'filing',
          citations: ['https://www.sos.ca.gov/business-programs/business-entities/forms']
        },
        {
          name: 'Annual Statement of Information',
          dueRule: 'anniversary_month',
          feeFlat: 25,
          frequency: 'annual',
          type: 'filing',
          citations: ['https://www.sos.ca.gov/business-programs/business-entities/forms']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be California-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Annual compliance may require certification of professional licensing status'
      ],
      taxNotes: ['$800 minimum franchise tax applies annually to most corporations']
    }
  },
  FL: {
    corp: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'fixed_month_day',
          month: 5,
          day: 1,
          feeFlat: 150,
          frequency: 'annual',
          type: 'report',
          penalties: '$400 late fee',
          citations: ['https://dos.myflorida.com/sunbiz/']
        }
      ]
    },
    llc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'fixed_month_day',
          month: 5,
          day: 1,
          feeFlat: 138.75,
          frequency: 'annual',
          type: 'report',
          penalties: '$400 late fee',
          citations: ['https://dos.myflorida.com/sunbiz/']
        }
      ]
    },
    pc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'fixed_month_day',
          month: 5,
          day: 1,
          feeFlat: 150,
          frequency: 'annual',
          type: 'report',
          penalties: '$400 late fee',
          citations: ['https://dos.myflorida.com/sunbiz/']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be Florida-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Name must contain "Professional Association" or "P.A."'
      ]
    }
  },
  NY: {
    llc: {
      requirements: [
        {
          name: 'Publication Requirement',
          dueRule: 'within_days',
          days: 120,
          feesDescription: 'Varies by county ($1,000-$2,000+ in NYC)',
          frequency: 'one-time',
          type: 'publication',
          penalties: 'Cannot sue in NY courts until complied',
          citations: ['https://dos.ny.gov/biennial-statements-business-corporations-and-limited-liability-companies']
        },
        {
          name: 'Biennial Statement',
          dueRule: 'anniversary_month',
          feeFlat: 9,
          frequency: 'biennial',
          type: 'filing',
          citations: ['https://dos.ny.gov/biennial-statements-business-corporations-and-limited-liability-companies']
        }
      ],
      specialNotes: [
        'Publication required in 2 newspapers for 6 consecutive weeks',
        'NYC counties have highest publication costs'
      ]
    },
    corp: {
      requirements: [
        {
          name: 'Biennial Statement',
          dueRule: 'anniversary_month',
          feeFlat: 9,
          frequency: 'biennial',
          type: 'filing',
          citations: ['https://dos.ny.gov/biennial-statements-business-corporations-and-limited-liability-companies']
        }
      ]
    },
    pc: {
      requirements: [
        {
          name: 'Biennial Statement',
          dueRule: 'anniversary_month',
          feeFlat: 9,
          frequency: 'biennial',
          type: 'filing',
          citations: ['https://dos.ny.gov/biennial-statements-business-corporations-and-limited-liability-companies']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be New York-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Name must contain "Professional Corporation" or "P.C."'
      ]
    }
  },
  TX: {
    corp: {
      requirements: [
        {
          name: 'Franchise Tax Report',
          dueRule: 'fixed_month_day',
          month: 5,
          day: 15,
          feesDescription: 'Based on margin calculation',
          frequency: 'annual',
          type: 'tax',
          citations: ['https://comptroller.texas.gov/taxes/franchise/']
        }
      ],
      taxNotes: [
        'No franchise tax if total revenue ≤ $2.47M',
        'Must still file Public Information Report (PIR) — basic business info disclosure — even if no tax due'
      ]
    },
    llc: {
      requirements: [
        {
          name: 'Franchise Tax Report',
          dueRule: 'fixed_month_day',
          month: 5,
          day: 15,
          feesDescription: 'Based on margin calculation',
          frequency: 'annual',
          type: 'tax',
          citations: ['https://comptroller.texas.gov/taxes/franchise/']
        }
      ],
      taxNotes: [
        'No franchise tax if total revenue ≤ $2.47M',
        'Must still file Public Information Report (PIR) — basic business info disclosure — even if no tax due'
      ]
    },
    pc: {
      requirements: [
        {
          name: 'Franchise Tax Report',
          dueRule: 'fixed_month_day',
          month: 5,
          day: 15,
          feesDescription: 'Based on margin calculation',
          frequency: 'annual',
          type: 'tax',
          citations: ['https://comptroller.texas.gov/taxes/franchise/']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be Texas-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Name must contain "Professional Corporation" or "P.C."'
      ],
      taxNotes: [
        'No franchise tax if total revenue ≤ $2.47M',
        'Must still file Public Information Report (PIR) — basic business info disclosure — even if no tax due'
      ]
    }
  },
  NV: {
    corp: {
      requirements: [
        {
          name: 'Initial List of Officers/Directors',
          dueRule: 'within_days',
          days: 30,
          feeFlat: 125,
          frequency: 'initial',
          type: 'filing',
          citations: ['https://www.nvsos.gov/']
        },
        {
          name: 'State Business License',
          dueRule: 'anniversary_last_day',
          feeFlat: 500,
          frequency: 'annual',
          type: 'license',
          citations: ['https://www.nvsos.gov/']
        },
        {
          name: 'Annual List',
          dueRule: 'anniversary_last_day',
          feeFlat: 125,
          frequency: 'annual',
          type: 'filing',
          citations: ['https://www.nvsos.gov/']
        }
      ],
      specialNotes: ['Must file Initial List and purchase State Business License to be compliant']
    },
    llc: {
      requirements: [
        {
          name: 'Initial List of Members/Managers',
          dueRule: 'within_days',
          days: 30,
          feeFlat: 125,
          frequency: 'initial',
          type: 'filing',
          citations: ['https://www.nvsos.gov/']
        },
        {
          name: 'State Business License',
          dueRule: 'anniversary_last_day',
          feeFlat: 200,
          frequency: 'annual',
          type: 'license',
          citations: ['https://www.nvsos.gov/']
        },
        {
          name: 'Annual List',
          dueRule: 'anniversary_last_day',
          feeFlat: 125,
          frequency: 'annual',
          type: 'filing',
          citations: ['https://www.nvsos.gov/']
        }
      ]
    },
    pc: {
      requirements: [
        {
          name: 'Initial List of Officers/Directors',
          dueRule: 'within_days',
          days: 30,
          feeFlat: 125,
          frequency: 'initial',
          type: 'filing',
          citations: ['https://www.nvsos.gov/']
        },
        {
          name: 'State Business License',
          dueRule: 'anniversary_last_day',
          feeFlat: 500,
          frequency: 'annual',
          type: 'license',
          citations: ['https://www.nvsos.gov/']
        },
        {
          name: 'Annual List',
          dueRule: 'anniversary_last_day',
          feeFlat: 125,
          frequency: 'annual',
          type: 'filing',
          citations: ['https://www.nvsos.gov/']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be Nevada-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Name must contain "Professional Corporation" or "P.C."',
        'Must file Initial List and purchase State Business License to be compliant'
      ]
    }
  },
  WY: {
    corp: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feesDescription: '$60 minimum or 0.0002 × in-state assets',
          frequency: 'annual',
          type: 'filing',
          citations: ['https://wyobiz.wyo.gov/Business/AnnualReport.aspx']
        }
      ],
      taxNotes: ['License tax: $60 minimum or 0.0002 × Wyoming assets, whichever is greater']
    },
    llc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feesDescription: '$60 minimum or 0.0002 × in-state assets',
          frequency: 'annual',
          type: 'filing',
          citations: ['https://wyobiz.wyo.gov/Business/AnnualReport.aspx']
        }
      ],
      taxNotes: ['License tax: $60 minimum or 0.0002 × Wyoming assets, whichever is greater'],
      specialNotes: ['Due first day of anniversary month']
    },
    pc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feesDescription: '$60 minimum or 0.0002 × in-state assets',
          frequency: 'annual',
          type: 'filing',
          citations: ['https://wyobiz.wyo.gov/Business/AnnualReport.aspx']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be Wyoming-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Name must contain "Professional Corporation" or "P.C."',
        'Due first day of anniversary month'
      ],
      taxNotes: ['License tax: $60 minimum or 0.0002 × Wyoming assets, whichever is greater']
    }
  },
  GA: {
    corp: {
      requirements: [
        {
          name: 'Annual Registration',
          dueRule: 'within_days',
          days: 90,
          feeFlat: 50,
          frequency: 'initial',
          type: 'filing',
          citations: ['https://ecorp.sos.ga.gov/ARForm']
        },
        {
          name: 'Annual Registration',
          dueRule: 'fixed_month_day',
          month: 4,
          day: 1,
          feeFlat: 50,
          frequency: 'annual',
          type: 'filing',
          penalties: '$25 late penalty',
          citations: ['https://ecorp.sos.ga.gov/ARForm']
        }
      ],
      specialNotes: ['Filing window: January 1 - April 1', 'Initial registration within 90 days of incorporation']
    },
    llc: {
      requirements: [
        {
          name: 'Annual Registration',
          dueRule: 'fixed_month_day',
          month: 4,
          day: 1,
          feeFlat: 50,
          frequency: 'annual',
          type: 'filing',
          penalties: '$25 late penalty',
          citations: ['https://ecorp.sos.ga.gov/ARForm']
        }
      ],
      specialNotes: ['Filing window: January 1 - April 1', 'First due in calendar year after formation']
    },
    pc: {
      requirements: [
        {
          name: 'Annual Registration',
          dueRule: 'within_days',
          days: 90,
          feeFlat: 50,
          frequency: 'initial',
          type: 'filing',
          citations: ['https://ecorp.sos.ga.gov/ARForm']
        },
        {
          name: 'Annual Registration',
          dueRule: 'fixed_month_day',
          month: 4,
          day: 1,
          feeFlat: 50,
          frequency: 'annual',
          type: 'filing',
          penalties: '$25 late penalty',
          citations: ['https://ecorp.sos.ga.gov/ARForm']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be Georgia-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Name must contain "Professional Corporation" or "P.C."',
        'Filing window: January 1 - April 1',
        'Initial registration within 90 days of incorporation'
      ]
    }
  },
  CO: {
    corp: {
      requirements: [
        {
          name: 'Periodic Report',
          dueRule: 'anniversary_month',
          feeFlat: 25,
          frequency: 'annual',
          type: 'filing',
          penalties: '$50 late fee',
          citations: ['https://www.sos.state.co.us/pubs/business/businessHome.html']
        }
      ],
      specialNotes: ['3-month filing window: 2 months before through 2 months after anniversary month']
    },
    llc: {
      requirements: [
        {
          name: 'Periodic Report',
          dueRule: 'anniversary_month',
          feeFlat: 25,
          frequency: 'annual',
          type: 'filing',
          penalties: '$50 late fee',
          citations: ['https://www.sos.state.co.us/pubs/business/businessHome.html']
        }
      ],
      specialNotes: ['3-month filing window: 2 months before through 2 months after anniversary month']
    },
    pc: {
      requirements: [
        {
          name: 'Periodic Report',
          dueRule: 'anniversary_month',
          feeFlat: 25,
          frequency: 'annual',
          type: 'filing',
          penalties: '$50 late fee',
          citations: ['https://www.sos.state.co.us/pubs/business/businessHome.html']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be Colorado-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Name must contain "Professional Corporation" or "P.C."',
        '3-month filing window: 2 months before through 2 months after anniversary month'
      ]
    }
  },
  AZ: {
    corp: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 45,
          frequency: 'annual',
          type: 'filing',
          penalties: '$9/month if late',
          citations: ['https://ecorp.azcc.gov/']
        }
      ],
      specialNotes: ['Due on assigned date in anniversary month', '6-month extension available']
    },
    llc: {
      requirements: [],
      specialNotes: ['No annual report requirement for LLCs']
    },
    pc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 45,
          frequency: 'annual',
          type: 'filing',
          penalties: '$9/month if late',
          citations: ['https://ecorp.azcc.gov/']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be Arizona-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Name must contain "Professional Corporation" or "P.C."',
        'Due on assigned date in anniversary month',
        '6-month extension available'
      ]
    }
  },
  MT: {
    corp: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'fixed_month_day',
          month: 4,
          day: 15,
          feeFlat: 20,
          frequency: 'annual',
          type: 'filing',
          penalties: 'Late fee after 5:00 PM MT on April 15',
          citations: ['https://biz.sosmt.gov/AnnualReports']
        }
      ],
      specialNotes: ['Filing window opens January 1', 'Fee may be waived in some years (check portal)']
    },
    llc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'fixed_month_day',
          month: 4,
          day: 15,
          feeFlat: 20,
          frequency: 'annual',
          type: 'filing',
          penalties: 'Late fee after 5:00 PM MT on April 15',
          citations: ['https://biz.sosmt.gov/AnnualReports']
        }
      ],
      specialNotes: ['Filing window opens January 1', 'Fee may be waived in some years (check portal)']
    },
    pc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'fixed_month_day',
          month: 4,
          day: 15,
          feeFlat: 20,
          frequency: 'annual',
          type: 'filing',
          penalties: 'Late fee after 5:00 PM MT on April 15',
          citations: ['https://biz.sosmt.gov/AnnualReports']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be Montana-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Name must contain "Professional Corporation" or "P.C."',
        'Filing window opens January 1',
        'Fee may be waived in some years (check portal)'
      ]
    }
  },
  WA: {
    corp: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 60,
          frequency: 'annual',
          type: 'filing',
          penalties: '$25 late fee + $10/month if delinquent',
          citations: ['https://www.sos.wa.gov/corps-charities/corporations/annual-reports/']
        }
      ],
      specialNotes: ['Due by end of anniversary month', 'Business license may be required separately']
    },
    llc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 60,
          frequency: 'annual',
          type: 'filing',
          penalties: '$25 late fee + $10/month if delinquent',
          citations: ['https://www.sos.wa.gov/corps-charities/corporations/annual-reports/']
        }
      ],
      specialNotes: ['Due by end of anniversary month', 'Business license may be required separately']
    },
    pbc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 60,
          frequency: 'annual',
          type: 'filing',
          penalties: '$25 late fee + $10/month if delinquent',
          citations: ['https://www.sos.wa.gov/corps-charities/corporations/annual-reports/']
        },
        {
          name: 'Social Purpose Corporation Report',
          dueRule: 'anniversary_month',
          frequency: 'annual',
          type: 'report',
          feesDescription: 'Must be posted on public website if available',
          penalties: 'No state penalty (governance requirement)',
          citations: ['https://app.leg.wa.gov/RCW/default.aspx?cite=23B.25.040']
        }
      ],
      specialNotes: [
        'Social Purpose Corporations must identify specific social purpose(s)',
        'Annual social purpose report must be posted on website if corporation has one',
        'Directors must consider social purpose alongside profit motives'
      ]
    },
    pc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 60,
          frequency: 'annual',
          type: 'filing',
          penalties: '$25 late fee + $10/month if delinquent',
          citations: ['https://www.sos.wa.gov/corps-charities/corporations/annual-reports/']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be Washington-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Name must contain "Professional Service Corporation" or "P.S.C."'
      ]
    }
  },
  OR: {
    corp: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 100,
          frequency: 'annual',
          type: 'filing',
          penalties: '$100 late fee',
          citations: ['https://sos.oregon.gov/business/Pages/annual-report.aspx']
        }
      ],
      specialNotes: ['Due by anniversary month', 'Corporate Activity Tax may apply to large businesses']
    },
    llc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 100,
          frequency: 'annual',
          type: 'filing',
          penalties: '$100 late fee',
          citations: ['https://sos.oregon.gov/business/Pages/annual-report.aspx']
        }
      ],
      specialNotes: ['Due by anniversary month', 'Corporate Activity Tax may apply to large businesses']
    },
    pbc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 100,
          frequency: 'annual',
          type: 'filing',
          penalties: '$100 late fee',
          citations: ['https://sos.oregon.gov/business/Pages/annual-report.aspx']
        },
        {
          name: 'Benefit Company Report',
          dueRule: 'anniversary_month',
          frequency: 'annual',
          type: 'report',
          feesDescription: 'Must be posted on public website if available',
          penalties: 'No state penalty (governance requirement)',
          citations: ['https://www.oregonlegislature.gov/bills_laws/ors/ors060.html']
        }
      ],
      specialNotes: [
        'Benefit companies must identify specific public benefit(s)',
        'Annual benefit report must be posted on website if corporation has one',
        'Directors must balance shareholder and stakeholder interests'
      ]
    },
    pc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 100,
          frequency: 'annual',
          type: 'filing',
          penalties: '$100 late fee',
          citations: ['https://sos.oregon.gov/business/Pages/annual-report.aspx']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be Oregon-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Name must contain "Professional Corporation" or "P.C."'
      ]
    }
  },
  UT: {
    corp: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 20,
          frequency: 'annual',
          type: 'filing',
          penalties: '$20 late fee',
          citations: ['https://corporations.utah.gov/annual-report']
        }
      ],
      specialNotes: ['Due by end of anniversary month', 'One of the lowest annual report fees in the US']
    },
    llc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 20,
          frequency: 'annual',
          type: 'filing',
          penalties: '$20 late fee',
          citations: ['https://corporations.utah.gov/annual-report']
        }
      ],
      specialNotes: ['Due by end of anniversary month', 'One of the lowest annual report fees in the US']
    },
    pbc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 20,
          frequency: 'annual',
          type: 'filing',
          penalties: '$20 late fee',
          citations: ['https://corporations.utah.gov/annual-report']
        },
        {
          name: 'Benefit Corporation Report',
          dueRule: 'anniversary_month',
          frequency: 'annual',
          type: 'report',
          feesDescription: 'Must be posted on public website if available',
          penalties: 'No state penalty (governance requirement)',
          citations: ['https://le.utah.gov/xcode/Title16/Chapter10b/16-10b.html']
        }
      ],
      specialNotes: [
        'Benefit corporations must identify specific public benefit(s)',
        'Annual benefit report must be posted on website if corporation has one',
        'Directors must balance shareholder and stakeholder interests'
      ]
    },
    pc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 20,
          frequency: 'annual',
          type: 'filing',
          penalties: '$20 late fee',
          citations: ['https://corporations.utah.gov/annual-report']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be Utah-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Name must contain "Professional Corporation" or "P.C."'
      ]
    }
  },
  ID: {
    corp: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 30,
          frequency: 'annual',
          type: 'filing',
          penalties: '$30 late fee',
          citations: ['https://sos.idaho.gov/corp/annual_report.html']
        }
      ],
      specialNotes: ['Due by end of anniversary month', 'No corporate income tax']
    },
    llc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 30,
          frequency: 'annual',
          type: 'filing',
          penalties: '$30 late fee',
          citations: ['https://sos.idaho.gov/corp/annual_report.html']
        }
      ],
      specialNotes: ['Due by end of anniversary month', 'No LLC income tax']
    },
    pc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'anniversary_month',
          feeFlat: 30,
          frequency: 'annual',
          type: 'filing',
          penalties: '$30 late fee',
          citations: ['https://sos.idaho.gov/corp/annual_report.html']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be Idaho-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Name must contain "Professional Association" or "P.A."'
      ]
    }
  },
  NM: {
    corp: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'fixed_month_day',
          month: 5,
          day: 15,
          feeFlat: 25,
          frequency: 'annual',
          type: 'filing',
          penalties: '$25 late fee',
          citations: ['https://www.sos.state.nm.us/business-services/corporations/']
        }
      ],
      specialNotes: ['Must file by May 15th annually', 'Franchise tax may apply']
    },
    llc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'fixed_month_day',
          month: 5,
          day: 15,
          feeFlat: 25,
          frequency: 'annual',
          type: 'filing',
          penalties: '$25 late fee',
          citations: ['https://www.sos.state.nm.us/business-services/corporations/']
        }
      ],
      specialNotes: ['Must file by May 15th annually']
    },
    pc: {
      requirements: [
        {
          name: 'Annual Report',
          dueRule: 'fixed_month_day',
          month: 5,
          day: 15,
          feeFlat: 25,
          frequency: 'annual',
          type: 'filing',
          penalties: '$25 late fee',
          citations: ['https://www.sos.state.nm.us/business-services/corporations/']
        }
      ],
      specialNotes: [
        'Only licensed professionals may form PC for single professional service',
        'All shareholders must be New Mexico-licensed individuals for that profession',
        'Professional licensing board approval may be required before formation',
        'PC may not engage in other businesses beyond professional services',
        'Name must contain "Professional Corporation" or "P.C."'
      ]
    }
  }
};

// Calculate next due date based on formation date and due rule
export function calculateDueDate(
  requirement: ComplianceRequirement,
  formationDate: Date = new Date()
): Date {
  const dueDate = new Date(formationDate);

  switch (requirement.dueRule) {
    case 'fixed_month_day':
      if (requirement.month && requirement.day) {
        const currentYear = new Date().getFullYear();
        const nextDue = new Date(currentYear, requirement.month - 1, requirement.day);

        // If the date has passed this year, use next year
        if (nextDue < new Date()) {
          nextDue.setFullYear(currentYear + 1);
        }
        return nextDue;
      }
      break;

    case 'within_days':
      if (requirement.days) {
        dueDate.setDate(formationDate.getDate() + requirement.days);
        return dueDate;
      }
      break;

    case 'anniversary_month':
      const formationMonth = formationDate.getMonth();
      const currentDate = new Date();
      dueDate.setMonth(formationMonth);
      dueDate.setDate(1); // First of the month

      // If anniversary month has passed this year, use next year
      if (dueDate < currentDate) {
        dueDate.setFullYear(currentDate.getFullYear() + 1);
      }
      return dueDate;

    case 'anniversary_last_day':
      const anniversaryMonth = formationDate.getMonth();
      dueDate.setMonth(anniversaryMonth + 1, 0); // Last day of anniversary month

      if (dueDate < new Date()) {
        dueDate.setFullYear(dueDate.getFullYear() + 1);
      }
      return dueDate;
  }

  return dueDate;
}

// Format due date for display
export function formatDueDate(date: Date): string {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (diffDays < 0) {
    return `${dateStr} (overdue)`;
  } else if (diffDays === 0) {
    return `${dateStr} (today)`;
  } else if (diffDays === 1) {
    return `${dateStr} (tomorrow)`;
  } else if (diffDays <= 30) {
    return `${dateStr} (in ${diffDays} days)`;
  } else {
    return dateStr;
  }
}

// Generate natural language timeline message for filing completion
export function getFilingCompletionMessage(state: string, entityType: string, speed: string = 'standard'): string {
  const today = new Date();
  const processingDays = speed === 'rush' ? 1 : speed === 'expedited' ? 3 : 7;

  const completionDate = new Date(today);
  let businessDaysAdded = 0;

  while (businessDaysAdded < processingDays) {
    completionDate.setDate(completionDate.getDate() + 1);
    const dayOfWeek = completionDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not weekend
      businessDaysAdded++;
    }
  }

  const formattedDate = completionDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const entityName = entityType === 'LLC' ? 'LLC' :
                     entityType === 'Corp' ? 'Corporation' :
                     entityType === 'PBC' ? 'Public Benefit Corporation' :
                     'Professional Corporation';

  const speedText = speed === 'rush' ? 'rush processing' :
                   speed === 'expedited' ? 'expedited processing' :
                   'standard processing';

  return `If you order today with ${speedText}, your ${entityName} incorporation will be complete by ${formattedDate}.`;
}

// Generate natural language message for next filing requirements
export function getNextFilingMessage(state: string, entityType: string): string {
  const requirements = getComplianceRequirements(state, entityType);
  const stateName = STATE_NAMES[state] || state;

  if (requirements.length === 0) {
    return `Your ${stateName} ${entityType} has no immediate filing requirements.`;
  }

  const nextRequirement = requirements.find(req => req.frequency === 'initial') || requirements[0];
  if (!nextRequirement) return '';

  const dueDate = calculateDueDate(nextRequirement);
  const formattedDate = dueDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const filingPortal = getFilingPortalUrl(state);
  const documentUrl = getRequirementDocumentUrl(state, nextRequirement);

  let message = `Your next filing requirement is the ${nextRequirement.name}, due ${formattedDate}. `;

  if (nextRequirement.feeFlat) {
    message += `The filing fee is $${nextRequirement.feeFlat}. `;
  } else if (nextRequirement.feesDescription) {
    message += `${nextRequirement.feesDescription}. `;
  }

  if (documentUrl) {
    message += `<a href="${documentUrl}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">View required form</a> `;
  }

  if (filingPortal) {
    message += `<a href="${filingPortal}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">File online</a>`;
  }

  return message;
}

// Get filing portal URL for a state
export function getFilingPortalUrl(state: string): string {
  const portals: Record<string, string> = {
    'DE': 'https://corp.delaware.gov/',
    'CA': 'https://bizfileonline.sos.ca.gov/',
    'NY': 'https://dos.ny.gov/corporations-state-filing-fees-corporation-llc',
    'TX': 'https://www.sos.state.tx.us/corp/index.shtml',
    'FL': 'https://dos.myflorida.com/sunbiz/',
    'NV': 'https://www.nvsos.gov/',
    'WY': 'https://wyobiz.wyo.gov/',
    'GA': 'https://ecorp.sos.ga.gov/',
    'CO': 'https://www.sos.state.co.us/pubs/business/businessHome.html',
    'AZ': 'https://ecorp.azcc.gov/',
    'MT': 'https://biz.sosmt.gov/',
    'WA': 'https://www.sos.wa.gov/corps-charities/',
    'OR': 'https://sos.oregon.gov/business/',
    'UT': 'https://corporations.utah.gov/',
    'ID': 'https://sos.idaho.gov/corp/',
    'NM': 'https://www.sos.state.nm.us/business-services/'
  };

  return portals[state] || '';
}

// Get specific document URL for a requirement
export function getRequirementDocumentUrl(_state: string, requirement: ComplianceRequirement): string {
  // Return the first citation if available
  return requirement.citations?.[0] || '';
}

// Get compliance requirements for a specific state and entity type
export function getComplianceRequirements(state: string, entityType: string): ComplianceRequirement[] {
  const stateData = COMPLIANCE_DATA[state];
  if (!stateData || !stateData[entityType.toLowerCase()]) {
    return [];
  }
  return stateData[entityType.toLowerCase()].requirements;
}

// Get special notes for a state/entity combination
export function getComplianceNotes(state: string, entityType: string): {
  specialNotes?: string[];
  taxNotes?: string[];
} {
  const stateData = COMPLIANCE_DATA[state];
  if (!stateData || !stateData[entityType.toLowerCase()]) {
    return {};
  }
  const entityData = stateData[entityType.toLowerCase()];
  return {
    specialNotes: entityData.specialNotes,
    taxNotes: entityData.taxNotes
  };
}