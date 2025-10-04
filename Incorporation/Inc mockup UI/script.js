const tiers = [
  {
    id: "starter",
    label: "Starter",
    price: 500,
    delivery: "14 days",
    revisions: "0",
    description: "Single-owner or simple partnership using our standard templates with core details inserted.",
    inclusions: [
      "EIN (Tax ID) procurement",
      "Basic bylaws / operating agreement"
    ]
  },
  {
    id: "standard",
    label: "Standard",
    price: 750,
    delivery: "5 days",
    revisions: "2",
    description: "Customized documents and attorney guidance on entity type, state selection, and taxation.",
    inclusions: [
      "EIN (Tax ID) procurement",
      "Customized bylaws / operating agreement",
      "30 minute attorney consultation"
    ],
    ctaLabel: "Choose Standard",
    ctaUrl: "https://www.paypal.com/ncp/payment/JBU94VXTM66QW"
  },
  {
    id: "advanced",
    label: "Advanced",
    price: 850,
    delivery: "3 days",
    revisions: "5",
    description: "Complex ownership, investors, or special rights. Includes bespoke drafting and deal support.",
    inclusions: [
      "EIN (Tax ID) procurement",
      "Customized governance set",
      "1 hour strategy session",
      "Advanced structuring & custom drafting (ownership transfers, investor terms, multiple share classes, etc.)"
    ]
  }
];

const entityBaseDetails = {
  LLC: {
    title: "Limited Liability Company",
    overview: "Flexible pass-through entity with contractual freedom for governance and profit splits.",
    advantages: [
      "Member or manager managed structures",
      "Single or multi-member without complex formalities",
      "Tax flexibility (default partnership/sole prop, elect S- or C-corp)"
    ],
    disadvantages: [
      "Self-employment tax on active income unless planning around it",
      "Banks and VC funds often prefer corporations",
      "State-level fees (e.g., Delaware $300 tax, California $800 minimum)"
    ]
  },
  Corp: {
    title: "C-Corporation",
    overview: "Investor-ready chassis that supports multiple share classes, equity compensation, and perpetual life.",
    advantages: [
      "Familiar to venture and institutional investors",
      "Supports preferred stock, option pools, QSBS planning",
      "Separation of ownership and management via board governance"
    ],
    disadvantages: [
      "Subject to corporate-level tax unless S-election is available",
      "Requires ongoing board and shareholder formalities",
      "Franchise and margin taxes vary by state"
    ]
  },
  PBC: {
    title: "Public Benefit Corporation",
    overview: "Traditional corporation plus a chartered public benefit, giving directors room to balance mission and profit.",
    advantages: [
      "Aligns legal duties with stated social or environmental mission",
      "Signals commitment to impact investors and stakeholders",
      "Keeps corporate liability protections and fundraising tools"
    ],
    disadvantages: [
      "Benefit report or statement obligations in most states",
      "Mission must be maintained in the charter (amendment if changed)",
      "Availability limited to select jurisdictions"
    ]
  },
  PC: {
    title: "Professional Corporation",
    overview: "Required for many licensed professions. Ownership and practice are restricted to duly licensed individuals.",
    advantages: [
      "Meets licensing-board mandates for professional practices",
      "Allows professionals to share expenses while limiting liability",
      "Built on stock-corporation statutes for familiar governance"
    ],
    disadvantages: [
      "Only licensed professionals may own voting shares",
      "Naming, purpose, and annual-file requirements are board-controlled",
      "Some states require agency approval before filing"
    ]
  }
};

const stateProfiles = {
  DE: {
    name: "Delaware",
    context: "Court of Chancery oversight, predictable case law, fast expedition options (24-hour and same-day).",
    formationFee: 90,
    registeredAgent: 129,
    compliance: {
      frequency: "March 1 (annual)",
      annualReport: "$50 (corp) / $300 (LLC tax)",
      franchiseTax: "Minimum $175 (Authorized Shares) or $400 (APVC)",
      note: "File electronically via My eCorp. Late filings incur a $200 penalty plus 1.5% monthly interest."
    },
    resources: {
      LLC: {
        docLabel: "Certificate of Formation (LLC)",
        docUrl: "https://corpfiles.delaware.gov/LLCFormation.pdf",
        faqLabel: "LLC startup guide",
        faqUrl: "https://corp.delaware.gov/startllc/",
        portalLabel: "My eCorp upload",
        portalUrl: "https://corp.delaware.gov/document-upload-service-information/"
      },
      Corp: {
        docLabel: "Certificate of Incorporation (Stock)",
        docUrl: "https://corpfiles.delaware.gov/incstk.pdf",
        faqLabel: "Incorporate in Delaware",
        faqUrl: "https://corp.delaware.gov/inc/",
        portalLabel: "My eCorp upload",
        portalUrl: "https://corp.delaware.gov/document-upload-service-information/"
      },
      PBC: {
        docLabel: "PBC Certificate of Incorporation",
        docUrl: "https://corpfiles.delaware.gov/PBC_Inc.pdf",
        faqLabel: "Delaware PBC overview",
        faqUrl: "https://corp.delaware.gov/pbc/",
        portalLabel: "My eCorp upload",
        portalUrl: "https://corp.delaware.gov/document-upload-service-information/"
      },
      PC: {
        docLabel: "Certificate of Incorporation – Stock",
        docUrl: "https://corpfiles.delaware.gov/Corp_Forms/Incorporation%20-%20Stock.pdf",
        faqLabel: "Professional Service Corporation Act",
        faqUrl: "https://delcode.delaware.gov/title8/c006/index.html",
        portalLabel: "My eCorp upload",
        portalUrl: "https://corp.delaware.gov/document-upload-service-information/",
        extras: [
          {
            label: "PC statute (8 Del. C. ch. 6)",
            url: "https://delcode.delaware.gov/title8/c006/index.html",
            description: "Availability, single-service limitation, and licensing rules"
          },
          {
            label: "Name requirements (§617)",
            url: "https://delcode.delaware.gov/title8/c006/index.html#617",
            description: "Must include 'chartered' or 'P.A.'; block 'Inc.'/'Co.' for PCs"
          },
          {
            label: "Name reservation",
            url: "https://icis.corp.delaware.gov/ecorp/namereserv/namereservation.aspx",
            description: "Check and reserve compliant professional names"
          },
          {
            label: "Corporate fee schedule",
            url: "https://corpfiles.delaware.gov/AugustFee2024.pdf",
            description: "Formation, expedite, and annual report fees"
          },
          {
            label: "Annual report & franchise tax center",
            url: "https://corp.delaware.gov/frtax/",
            description: "File March 1 annual report, pay franchise tax, certify licenses"
          }
        ]
      }
    },
    entityOverrides: {
      LLC: {
        note: "Delaware LLCs offer series capabilities and strong contractual flexibility. Budget the $300 annual franchise tax due June 1."
      },
      Corp: {
        note: "Authorize no more than 5,000 shares at formation to keep the annual franchise tax at $175."
      },
      PBC: {
        note: "Deliver a biennial public benefit report to stockholders and reference the public benefit purpose in your charter."
      },
      PC: {
        overview: "Delaware PCs operate under 8 Del. C. ch. 6. Every voting shareholder must hold a Delaware license for the stated professional service and the certificate must limit the purpose to that service.",
        advantages: [
          "Court of Chancery oversight for professional-shareholder disputes",
          "Stock corporation framework with QSBS and equity planning",
          "Purpose clause makes compliance clear to licensing boards"
        ],
        disadvantages: [
          "All shareholders (and any service-rendering officers) must keep a Delaware professional license in good standing",
          "Corporate name must contain 'chartered', 'professional association', or 'P.A.'",
          "Annual report requires certifying that listed owners/officers remain licensed"
        ],
        note: "Include a purpose clause limited to the professional service, attach any board approval letters, and calendar the March 1 annual report + franchise tax (minimum $175/$400)."
      }
    }
  },
  CA: {
    name: "California",
    context: "Home-state operations with robust consumer protections and predictable filing queues (BizFile online).",
    formationFee: 100,
    registeredAgent: 159,
    compliance: {
      frequency: "Initial 90 days, then annually (Statement of Information)",
      annualReport: "$25 Statement of Information",
      franchiseTax: "$800 minimum (after first taxable year)",
      note: "File the initial Statement of Information within 90 days. The $800 franchise tax is waived for eligible LLCs in their first taxable year, then due annually by the 15th day of the 4th month."
    },
    resources: {
      LLC: {
        docLabel: "Articles of Organization (LLC-1)",
        docUrl: "https://www.sos.ca.gov/business-programs/business-entities/forms",
        faqLabel: "LLC guidance",
        faqUrl: "https://www.sos.ca.gov/business-programs/business-entities/starting-business",
        portalLabel: "BizFile online",
        portalUrl: "https://bizfileonline.sos.ca.gov/"
      },
      Corp: {
        docLabel: "Articles of Incorporation",
        docUrl: "https://www.sos.ca.gov/business-programs/business-entities/forms",
        faqLabel: "Corporation filing tips",
        faqUrl: "https://www.sos.ca.gov/business-programs/business-entities/filing-tips",
        portalLabel: "BizFile online",
        portalUrl: "https://bizfileonline.sos.ca.gov/"
      },
      PBC: {
        docLabel: "Benefit Corporation articles",
        docUrl: "https://www.sos.ca.gov/business-programs/business-entities/forms",
        faqLabel: "California benefit corporation overview",
        faqUrl: "https://www.sos.ca.gov/business-programs/business-entities/allow-benefit-corporations",
        portalLabel: "BizFile online",
        portalUrl: "https://bizfileonline.sos.ca.gov/"
      },
      PC: {
        docLabel: "Professional Corporation templates",
        docUrl: "https://www.sos.ca.gov/business-programs/business-entities/forms",
        faqLabel: "Professional licensing forms",
        faqUrl: "https://www.dca.ca.gov/about_us/forms.shtml",
        portalLabel: "BizFile online",
        portalUrl: "https://bizfileonline.sos.ca.gov/"
      }
    },
    entityOverrides: {
      LLC: {
        note: "Calendar the $800 franchise tax for the second taxable year and every year after. LLC Statements of Information repeat every two years."
      },
      Corp: {
        note: "Plan for the $800 franchise tax by the 15th day of the 4th month and maintain annual shareholder and director minutes."
      },
      PBC: {
        note: "Include a general public benefit or specific benefit plus an annual (or biennial) benefit report to shareholders."
      },
      PC: {
        note: "Obtain licensing board preclearance where required (e.g., medical, legal, architectural) before filing with the Secretary of State."
      }
    }
  },
  NY: {
    name: "New York",
    context: "Publication state with biennial statements and county-specific costs for LLCs and PCs.",
    formationFee: 200,
    registeredAgent: 149,
    compliance: {
      frequency: "Biennial statement (every 2 years)",
      annualReport: "$9 biennial statement",
      franchiseTax: "LLC filing fee $25–$4,500 (based on NY receipts); corporations pay Article 9-A franchise tax",
      note: "Complete the two-newspaper publication within 120 days (LLCs and PCs). Biennial statements are due in the anniversary month."
    },
    resources: {
      LLC: {
        docLabel: "Articles of Organization (DOS-1336-f)",
        docUrl: "https://dos.ny.gov/system/files/documents/2023/03/1336-f.pdf",
        faqLabel: "NY LLC overview",
        faqUrl: "https://dos.ny.gov/limited-liability-company",
        portalLabel: "NY Business Express",
        portalUrl: "https://businessexpress.ny.gov/app/answers/browse/topic/business/formation"
      },
      Corp: {
        docLabel: "Certificate of Incorporation (DOS-1239-f)",
        docUrl: "https://dos.ny.gov/system/files/documents/2023/03/1239-f.pdf",
        faqLabel: "NY Corporations",
        faqUrl: "https://dos.ny.gov/corporations",
        portalLabel: "NY Business Express",
        portalUrl: "https://businessexpress.ny.gov/"
      },
      PBC: {
        docLabel: "Benefit Corporation guidance",
        docUrl: "https://dos.ny.gov/benefit-corporation-certificate-incorporation-domestic-business-corporations",
        faqLabel: "Business Corporation Law Article 17",
        faqUrl: "https://dos.ny.gov/corporations",
        portalLabel: "NY Business Express",
        portalUrl: "https://businessexpress.ny.gov/"
      },
      PC: {
        docLabel: "Professional Corporation (DOS-1319-f)",
        docUrl: "https://dos.ny.gov/system/files/documents/2023/03/1319-f.pdf",
        faqLabel: "NY professional corporations",
        faqUrl: "https://dos.ny.gov/corporations",
        portalLabel: "NY Business Express",
        portalUrl: "https://businessexpress.ny.gov/",
        extras: [
          {
            label: "Education Department pre-approval",
            url: "http://www.op.nysed.gov/pcorp.htm",
            description: "Most PCs require a consent letter from the licensing board before filing"
          }
        ]
      }
    },
    entityOverrides: {
      LLC: {
        note: "Budget for newspaper publication (varies by county) and the NY LLC filing fee based on gross receipts."
      },
      Corp: {
        note: "Plan for NY franchise tax (CT-3 or CT-3-S) and corporate minimums tied to NY receipts."
      },
      PBC: {
        note: "Add the Article 17 public benefit statement and remember that biennial statements still apply."
      },
      PC: {
        note: "Secure Education Department consent, satisfy publication, and file biennial statements even when no changes occur."
      }
    }
  },
  TX: {
    name: "Texas",
    context: "SOSDirect e-filing, fast processing, and $0 franchise tax while receipts stay below the no-tax threshold.",
    formationFee: 300,
    registeredAgent: 139,
    compliance: {
      frequency: "May 15 (annual)",
      annualReport: "$0 Public Information Report",
      franchiseTax: "No tax due with receipts ≤ $2.47M (2025 threshold)",
      note: "File the franchise tax report and PIR together via the Comptroller. Request an extension by May 15 if needed."
    },
    resources: {
      LLC: {
        docLabel: "Certificate of Formation (Form 205)",
        docUrl: "https://www.sos.state.tx.us/corp/forms/205_boc.pdf",
        faqLabel: "Texas business structure guide",
        faqUrl: "https://www.sos.state.tx.us/corp/businessstructure.shtml",
        portalLabel: "SOSDirect",
        portalUrl: "https://www.sos.state.tx.us/corp/sosda/index.shtml"
      },
      Corp: {
        docLabel: "Certificate of Formation (Form 201)",
        docUrl: "https://www.sos.state.tx.us/corp/forms/201_boc.pdf",
        faqLabel: "Texas business structure guide",
        faqUrl: "https://www.sos.state.tx.us/corp/businessstructure.shtml",
        portalLabel: "SOSDirect",
        portalUrl: "https://www.sos.state.tx.us/corp/sosda/index.shtml"
      },
      PBC: {
        docLabel: "Certificate of Formation (Form 201)",
        docUrl: "https://www.sos.state.tx.us/corp/forms/201_boc.pdf",
        faqLabel: "Public benefit corporation guidance",
        faqUrl: "https://www.sos.state.tx.us/corp/publicbenefit.shtml",
        portalLabel: "SOSDirect",
        portalUrl: "https://www.sos.state.tx.us/corp/sosda/index.shtml",
        extras: [
          {
            label: "Texas franchise tax overview",
            url: "https://comptroller.texas.gov/taxes/franchise/",
            description: "Determine no-tax due thresholds and filing deadlines"
          }
        ]
      },
      PC: {
        docLabel: "Professional Corporation Certificate",
        docUrl: "https://www.sos.state.tx.us/corp/forms/201_boc.pdf",
        faqLabel: "Texas business structure guide",
        faqUrl: "https://www.sos.state.tx.us/corp/businessstructure.shtml",
        portalLabel: "SOSDirect",
        portalUrl: "https://www.sos.state.tx.us/corp/sosda/index.shtml",
        extras: [
          {
            label: "Licensing board approvals",
            url: "https://www.sos.state.tx.us/corp/bylaws.shtml",
            description: "Confirm board consent requirements for your profession"
          }
        ]
      }
    },
    entityOverrides: {
      LLC: {
        note: "File the annual franchise tax/PIR even when $0 is due; series LLCs require a registered agent in Texas."
      },
      Corp: {
        note: "Texas corporations are subject to the margin/franchise tax on gross receipts."
      },
      PBC: {
        note: "Add the BOC §21.952 public benefit statement and deliver periodic updates to shareholders."
      },
      PC: {
        note: "Obtain a letter of good standing or consent from the relevant Texas licensing board before filing."
      }
    }
  },
  FL: {
    name: "Florida",
    context: "Sunbiz e-filing posts within 2–3 business days; May annual report keeps entities active.",
    formationFee: 125,
    registeredAgent: 139,
    compliance: {
      frequency: "May 1 (annual)",
      annualReport: "$138.75 annual report",
      franchiseTax: "No state franchise tax (late fee $400)",
      note: "Annual report is mandatory even in year one; failure to file by May 1 triggers a $400 late fee and potential administrative dissolution."
    },
    resources: {
      LLC: {
        docLabel: "Articles of Organization",
        docUrl: "https://files.floridados.gov/media/703329/cr2e047.pdf",
        faqLabel: "Florida LLC online filing",
        faqUrl: "https://dos.myflorida.com/sunbiz/start-business/efile/fl-llc/",
        portalLabel: "Sunbiz e-file",
        portalUrl: "https://efile.sunbiz.org/llc_file.html"
      },
      Corp: {
        docLabel: "Articles of Incorporation",
        docUrl: "https://files.floridados.gov/media/703307/articlesofincorporation.pdf",
        faqLabel: "Florida profit corporation e-file",
        faqUrl: "https://dos.myflorida.com/sunbiz/start-business/efile/fl-profit-corporation/",
        portalLabel: "Sunbiz e-file",
        portalUrl: "https://efile.sunbiz.org/profit_file.html"
      },
      PBC: {
        docLabel: "Benefit / Social Purpose resources",
        docUrl: "https://dos.myflorida.com/sunbiz/forms/miscellaneous-forms/",
        faqLabel: "Sunbiz benefit corporation FAQ",
        faqUrl: "https://dos.myflorida.com/sunbiz/about-us/faqs/",
        portalLabel: "Sunbiz e-file",
        portalUrl: "https://efile.sunbiz.org/profit_file.html"
      },
      PC: {
        docLabel: "Professional corporation guidance",
        docUrl: "https://dos.myflorida.com/sunbiz/start-business/efile/fl-profit-corporation/",
        faqLabel: "Florida licensing boards",
        faqUrl: "https://www.flhealthsource.gov/",
        portalLabel: "Sunbiz e-file",
        portalUrl: "https://efile.sunbiz.org/profit_file.html"
      }
    },
    entityOverrides: {
      LLC: {
        note: "Calendar the $138.75 annual report by May 1; Sunbiz automatically assesses a $400 late fee."
      },
      Corp: {
        note: "Annual reports are due May 1 even for newly formed corporations; Florida does not impose a corporate franchise tax."
      },
      PBC: {
        note: "Florida recognizes both Benefit Corporations and Social Purpose Corporations—ensure the charter reflects your chosen model."
      },
      PC: {
        note: "Verify licensing board compliance (e.g., Board of Medicine, Bar) before filing and keep registered agent info current with Sunbiz."
      }
    }
  }
};

const tierGrid = document.getElementById("tier-grid");
const stateSelect = document.getElementById("state-select");
const stateContextEl = document.getElementById("state-context");
const entityTitleEl = document.getElementById("entity-title");
const entityOverviewEl = document.getElementById("entity-overview");
const entityAdvantagesEl = document.getElementById("entity-advantages");
const entityDisadvantagesEl = document.getElementById("entity-disadvantages");
const entityNoteEl = document.getElementById("entity-note");
const resourceLinksEl = document.getElementById("resource-links");
const insightAdvantagesEl = document.getElementById("insight-advantages");
const insightConsiderationsEl = document.getElementById("insight-considerations");
const insightActionsEl = document.getElementById("insight-actions");
const annualFrequencyEl = document.getElementById("annual-frequency");
const annualFeeEl = document.getElementById("annual-fee");
const franchiseTaxEl = document.getElementById("franchise-tax");
const complianceNoteEl = document.getElementById("compliance-note");
const todayTotalEl = document.getElementById("today-total");
const todayBreakdownEl = document.getElementById("today-breakdown");
const lineItemGrid = document.getElementById("line-item-grid");
const comparisonList = document.getElementById("comparison-list");
const entityButtons = document.querySelectorAll(".pill-toggle button");

let selectedEntity = "LLC";
let selectedState = "DE";
let selectedTier = "standard";

const PBC_STATES = ["DE", "CA", "NY", "TX", "FL"];
const PC_STATES = ["DE", "CA", "NY", "TX", "FL"];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2
  }).format(value);
}

function allowedStatesForEntity() {
  if (selectedEntity === "PBC") return PBC_STATES;
  if (selectedEntity === "PC") return PC_STATES;
  return Object.keys(stateProfiles);
}

function ensureStateFitsEntity() {
  const allowed = allowedStatesForEntity();
  Array.from(stateSelect.options).forEach((option) => {
    option.disabled = !allowed.includes(option.value);
  });
  if (!allowed.includes(selectedState)) {
    selectedState = allowed[0];
    stateSelect.value = selectedState;
  }
}

function populateStateOptions() {
  Object.entries(stateProfiles).forEach(([code, profile]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = profile.name;
    stateSelect.appendChild(option);
  });
  stateSelect.value = selectedState;
  ensureStateFitsEntity();
}

function renderTierCards() {
  tierGrid.innerHTML = "";
  tiers.forEach((tier) => {
    const card = document.createElement("div");
    card.className = `tier-card${tier.id === selectedTier ? " active" : ""}`;
    card.addEventListener("click", () => {
      selectedTier = tier.id;
      renderTierCards();
      updateUI();
    });

    const header = document.createElement("div");
    header.className = "tier-header";
    header.innerHTML = `<div><h3>${tier.label}</h3></div><span class=\"tier-price\">${formatCurrency(tier.price)}</span>`;

    const description = document.createElement("p");
    description.className = "muted";
    description.textContent = tier.description;

    const meta = document.createElement("div");
    meta.className = "tier-meta";
    meta.innerHTML = `<span>Delivery <strong>${tier.delivery}</strong></span><span>Revisions <strong>${tier.revisions}</strong></span>`;

    const list = document.createElement("ul");
    list.className = "bullet-list";
    tier.inclusions.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    card.appendChild(header);
    card.appendChild(description);
    card.appendChild(meta);
    card.appendChild(list);

    if (tier.ctaUrl) {
      const linkRow = document.createElement("div");
      linkRow.className = "link-row";
      const link = document.createElement("a");
      link.href = tier.ctaUrl;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = tier.ctaLabel || "Choose";
      linkRow.appendChild(link);
      card.appendChild(linkRow);
    }

    tierGrid.appendChild(card);
  });
}

function renderEntityButtons() {
  entityButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      entityButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedEntity = btn.dataset.entity;
      ensureStateFitsEntity();
      updateUI();
    });
  });
}

function renderEntitySummary(stateProfile) {
  const baseDetail = entityBaseDetails[selectedEntity];
  var overrides = (stateProfile.entityOverrides && stateProfile.entityOverrides[selectedEntity]) || {};

  var overview = overrides.overview || baseDetail.overview;
  var advantages = overrides.advantages || baseDetail.advantages;
  var disadvantages = overrides.disadvantages || baseDetail.disadvantages;
  var note = overrides.note || "";

  entityTitleEl.textContent = `${baseDetail.title} in ${stateProfile.name}`;
  entityOverviewEl.textContent = overview;

  entityAdvantagesEl.innerHTML = "";
  advantages.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    entityAdvantagesEl.appendChild(li);
  });

  entityDisadvantagesEl.innerHTML = "";
  disadvantages.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    entityDisadvantagesEl.appendChild(li);
  });

  if (note) {
    entityNoteEl.textContent = note;
    entityNoteEl.style.display = "block";
  } else {
    entityNoteEl.textContent = "";
    entityNoteEl.style.display = "none";
  }
}

function renderInsights(stateProfile) {
  insightAdvantagesEl.innerHTML = "";
  insightConsiderationsEl.innerHTML = "";
  insightActionsEl.innerHTML = "";

  const insight = stateInsights[selectedState] || { strategic: [], considerations: [], actions: [] };
  const baseDetail = entityBaseDetails[selectedEntity] || { advantages: [], disadvantages: [] };

  const strategicItems = insight.strategic.length ? insight.strategic : baseDetail.advantages;
  const considerationItems = insight.considerations.length ? insight.considerations : baseDetail.disadvantages;
  const actionItems = insight.actions.length ? insight.actions : [
    "Schedule attorney intake to confirm filings",
    "Prepare owner identity details for BOI readiness",
    "Collect registered agent acceptance"
  ];

  strategicItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    insightAdvantagesEl.appendChild(li);
  });

  considerationItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    insightConsiderationsEl.appendChild(li);
  });

  actionItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    insightActionsEl.appendChild(li);
  });
}

function renderResources(stateProfile) {
  resourceLinksEl.innerHTML = "";
  var resources = (stateProfile.resources && stateProfile.resources[selectedEntity]) || null;
  if (!resources) return;

  if (resources.docUrl) {
    const docItem = document.createElement("li");
    docItem.innerHTML = `<a href="${resources.docUrl}" target="_blank" rel="noopener">${resources.docLabel}</a><small>Initial formation document</small>`;
    resourceLinksEl.appendChild(docItem);
  }

  if (resources.faqUrl) {
    const faqItem = document.createElement("li");
    faqItem.innerHTML = `<a href="${resources.faqUrl}" target="_blank" rel="noopener">${resources.faqLabel || "Secretary of State FAQs"}</a><small>State-specific guidance</small>`;
    resourceLinksEl.appendChild(faqItem);
  }

  if (resources.portalUrl) {
    const portalItem = document.createElement("li");
    portalItem.innerHTML = `<a href="${resources.portalUrl}" target="_blank" rel="noopener">${resources.portalLabel || "Online filing portal"}</a><small>Submit formations, amendments, and annual reports</small>`;
    resourceLinksEl.appendChild(portalItem);
  }

  var extras = (resources.extras || []);
  extras.forEach(function(extra) {
    const extraItem = document.createElement("li");
    extraItem.innerHTML = `<a href="${extra.url}" target="_blank" rel="noopener">${extra.label}</a><small>${extra.description}</small>`;
    resourceLinksEl.appendChild(extraItem);
  });
}

function renderCompliance(stateProfile) {
  const compliance = stateProfile.compliance;
  annualFrequencyEl.textContent = compliance.frequency;
  annualFeeEl.textContent = compliance.annualReport;
  franchiseTaxEl.textContent = compliance.franchiseTax;
  complianceNoteEl.textContent = compliance.note || "";
}

function renderQuote(stateProfile) {
  const tier = tiers.find((t) => t.id === selectedTier) || tiers[1];
  const items = [
    { label: `${tier.label} formation service`, amount: tier.price },
    { label: `${stateProfile.name} state filing fee`, amount: stateProfile.formationFee },
    { label: "Registered agent (year 1)", amount: stateProfile.registeredAgent }
  ];

  const total = items.reduce((sum, item) => sum + item.amount, 0);
  todayTotalEl.textContent = formatCurrency(total);
  todayBreakdownEl.textContent = items.map((item) => `${item.label}: ${formatCurrency(item.amount)}`).join(" · ");

  lineItemGrid.innerHTML = "";
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "line-item";
    row.innerHTML = `<span>${item.label}</span><strong>${formatCurrency(item.amount)}</strong>`;
    lineItemGrid.appendChild(row);
  });
}

function renderComparison(activeStateCode) {
  comparisonList.innerHTML = "";
  const allowed = allowedStatesForEntity();

  allowed.forEach((code) => {
    const profile = stateProfiles[code];
    const li = document.createElement("li");
    const info = document.createElement("div");
    info.className = "comparison-info";
    info.innerHTML = `<strong>${profile.name}</strong><span>Annual report fee ${profile.compliance.annualReport}</span><span>${profile.compliance.franchiseTax}</span>`;

    const button = document.createElement("button");
    button.type = "button";
    const isActive = code === activeStateCode;
    button.textContent = isActive ? "Selected" : "Switch";
    button.disabled = isActive;
    button.addEventListener("click", () => {
      if (isActive) return;
      selectedState = code;
      stateSelect.value = code;
      updateUI();
    });

    li.appendChild(info);
    li.appendChild(button);
    comparisonList.appendChild(li);
  });
}

function updateUI() {
  ensureStateFitsEntity();
  const stateProfile = stateProfiles[selectedState];

  stateContextEl.textContent = stateProfile.context;
  renderEntitySummary(stateProfile);
  renderResources(stateProfile);
  renderCompliance(stateProfile);
  renderInsights(stateProfile);
  renderQuote(stateProfile);
  renderComparison(selectedState);
}

populateStateOptions();
renderTierCards();
renderEntityButtons();
updateUI();

stateSelect.addEventListener("change", (event) => {
  selectedState = event.target.value;
  updateUI();
});
