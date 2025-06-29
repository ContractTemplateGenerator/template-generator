const { useState, useEffect, useRef } = React;

// All blog post/generator data - Enhanced for legal professionalism and tech-savviness
const allCardsData = [
  // Featured & Popular Posts (Top Row)
  {
    id: 'claude-outputs',
    icon: '🤖',
    category: 'AI Law • Featured',
    categoryColor: 'from-gradient-start to-gradient-end',
    categoryGradient: 'from-purple-600 via-blue-600 to-cyan-500',
    title: 'Who Owns Claude\'s Outputs and How Can They Be Used?',
    description: 'Deep-dive legal analysis of AI ownership rights, copyright implications, and strategic guidance for businesses leveraging Claude. Includes our interactive Risk Analyzer tool.',
    url: 'https://terms.law/2024/08/24/who-owns-claudes-outputs-and-how-can-they-be-used/',
    gradient: 'from-purple-600 via-blue-500 to-cyan-500',
    bgGradient: 'from-purple-50 via-blue-50 to-cyan-50',
    hasAnalyzer: true
  },
  {
    id: 'angel-investor',
    icon: '👼',
    category: 'Document Generator',
    categoryColor: 'from-rose-500 to-pink-600',
    title: 'Angel Investor Agreement Generator & Template',
    description: 'Create tailored agreements for early-stage investments with essential details including company information, investment structure, and comprehensive investor rights.',
    url: 'https://terms.law/2023/08/11/drafting-angel-investor-agreements-a-comprehensive-guide-free-template-included/',
    gradient: 'from-rose-600 to-pink-600',
    bgGradient: 'from-rose-50 to-pink-50',
  },
  {
    id: 'stripe-funds',
    icon: '💳',
    category: 'Financial Law',
    categoryColor: 'from-green-500 to-emerald-600',
    title: 'When Stripe Holds Your Money: The Definitive Legal Guide to Getting Your Funds Released',
    description: 'Payment processors like Stripe can hold merchant funds for various reasons, from suspected fraud to policy violations. This guide examines the legal frameworks that govern these holds, your rights as a merchant, and practical steps to expedite the release of your funds.',
    url: 'https://terms.law/2025/03/03/when-stripe-holds-your-money-the-definitive-legal-guide-to-getting-your-funds-released/',
    gradient: 'from-green-600 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50'
  },
  {
    id: 'tax-calculator',
    icon: '💰',
    category: 'Tax Calculator',
    categoryColor: 'from-green-500 to-emerald-600',
    title: '1099 vs W-2 Tax Calculator',
    description: 'Comprehensive comparison tool with FSA benefits, retirement planning, work schedule analysis, and detailed tax insights to help you make informed employment decisions.',
    url: 'https://terms.law/2024/12/15/tax-burden-calculator-for-1099-vs-w-2-employees/',
    gradient: 'from-green-600 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50'
  },
  {
    id: 'trump-tariffs',
    icon: '🛡️',
    category: 'Document Generator',
    categoryColor: 'from-blue-500 to-indigo-600',
    title: 'Trump-Era Tariffs: Three Essential Tariff Protection Clauses for Your Business Contracts',
    description: 'As global trade faces disruption from renewed tariffs, businesses must adopt specialized contract provisions to mitigate risks. These include indemnity clauses, price adjustment mechanisms, and force majeure provisions.',
    url: 'https://terms.law/2025/04/03/price-adjustment-clause-generator-for-tariff-fluctuations/',
    gradient: 'from-blue-600 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50'
  },
  {
    id: 'stock-transfer',
    icon: '📊',
    category: 'Document Generator',
    categoryColor: 'from-emerald-500 to-teal-600',
    title: 'Stock Transfer Agreements 101: A Guide & Generator for Business Owners and Investors',
    description: 'This generator facilitates creating tailored share transfer agreements between buyers and sellers, outlining essential terms and ensuring legal clarity during share transactions.',
    url: 'https://terms.law/2024/04/11/stock-transfer-agreements-101-a-guide-template-for-business-owners-and-investors/',
    gradient: 'from-emerald-600 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50'
  },
  {
    id: 'token-issuance',
    icon: '🪙',
    category: 'Document Generator',
    categoryColor: 'from-purple-500 to-violet-600',
    title: 'Draft Your Token Issuance Agreement: Legal Guide and Interactive Generator Tool',
    description: 'Create custom agreements for token offerings that ensure regulatory compliance and clarity between issuers and purchasers, with emphasis on legal requirements for blockchain projects.',
    url: 'https://terms.law/2023/06/16/legal-implications-of-token-issuance-by-start-ups-an-exploratory-discussion/',
    gradient: 'from-purple-600 to-violet-600',
    bgGradient: 'from-purple-50 to-violet-50'
  },
  {
    id: 'import-agency',
    icon: '🌍',
    category: 'Document Generator',
    categoryColor: 'from-orange-500 to-red-600',
    title: 'Import Agency Agreement Generator',
    description: 'Create tailored agreements defining the relationship between a Principal and an Agent for importing merchandise, with clear expectations and legal protections for international trade.',
    url: 'https://terms.law/2022/11/02/import-agency-agreement-free-template/',
    gradient: 'from-orange-600 to-red-600',
    bgGradient: 'from-orange-50 to-red-50'
  },
  // Popular Blog Posts and Generators
  {
    id: 'sweepstakes-generator',
    icon: '🎯',
    category: 'Document Generator',
    categoryColor: 'from-amber-500 to-orange-600',
    title: 'Sweepstakes Rules vs. Lotteries: Legal Guide & Generator',
    description: 'Navigate the thin line between legal sweepstakes and illegal lotteries with this comprehensive guide and generator for social media promotions and marketing campaigns.',
    url: 'https://terms.law/2024/08/27/legal-guide-sweepstakes-lotteries-and-social-media-promotions/',
    gradient: 'from-amber-600 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50'
  },
  {
    id: 'video-production',
    icon: '🎬',
    category: 'Document Generator',
    categoryColor: 'from-purple-500 to-violet-600',
    title: 'Video Production Agreement Generator & Guide',
    description: 'Create comprehensive video production agreements, talent agreements, licensing agreements, and location releases with proper legal protection for all stakeholders.',
    url: 'https://terms.law/2023/11/09/the-essential-guide-to-contracts-for-video-production/',
    gradient: 'from-purple-600 to-violet-600',
    bgGradient: 'from-purple-50 to-violet-50'
  },
  {
    id: 'interior-design',
    icon: '🏠',
    category: 'Document Generator',
    categoryColor: 'from-indigo-500 to-blue-600',
    title: 'Interior Design Services Agreement Generator',
    description: 'Professional template and generator for interior designers to create tailored service agreements with proper scope of work, fees, payment terms, and legal protections.',
    url: 'https://terms.law/2024/02/02/drafting-interior-design-services-agreements-free-template/',
    gradient: 'from-indigo-600 to-blue-600',
    bgGradient: 'from-indigo-50 to-blue-50'
  },
  {
    id: 'profit-share',
    icon: '📈',
    category: 'Document Generator',
    categoryColor: 'from-emerald-500 to-teal-600',
    title: 'Profit Share Investment Agreement Generator',
    description: 'Create agreements outlining terms for investors to receive a percentage of company profits, including investment details, distribution terms, and exit conditions.',
    url: 'https://terms.law/2023/07/10/profit-share-investment-agreements-guide-template/',
    gradient: 'from-emerald-600 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50'
  },
  {
    id: 'master-services',
    icon: '📋',
    category: 'Document Generator',
    categoryColor: 'from-slate-500 to-gray-600',
    title: 'Master Services Agreements & Statements of Work Generator',
    description: 'Draft effective MSAs and SOWs defining long-term service relationships with key clauses for services, payment, confidentiality, and intellectual property.',
    url: 'https://terms.law/2024/04/19/drafting-effective-master-services-agreements-and-statements-of-work-free-template/',
    gradient: 'from-slate-600 to-gray-600',
    bgGradient: 'from-slate-50 to-gray-50'
  },
  {
    id: 'dppa-guide',
    icon: '🚗',
    category: 'Privacy Law',
    categoryColor: 'from-blue-500 to-indigo-600',
    title: 'Drivers Privacy Protection Act (DPPA) – Comprehensive Overview (2025)',
    description: 'Understand how the DPPA protects personal information in motor vehicle records, authorized disclosures, and compliance requirements for businesses accessing driver data.',
    url: 'https://terms.law/2023/08/01/drivers-privacy-protection-act-dppa/',
    gradient: 'from-blue-600 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50'
  },
  {
    id: 'fifty-shades-nda',
    icon: '🔒',
    category: 'Document Generator',
    categoryColor: 'from-gray-500 to-slate-600',
    title: 'From Fantasy to Legal Reality: The Fifty Shades Contract Phenomenon + NDA Generator',
    description: 'Examine the legal realities of BDSM contracts, consent, and NDAs, clarifying misconceptions while providing properly structured confidentiality agreements for relationships.',
    url: 'https://terms.law/2023/07/29/4644/',
    gradient: 'from-gray-600 to-slate-600',
    bgGradient: 'from-gray-50 to-slate-50'
  },
  {
    id: 'saas-partnership',
    icon: '🤝',
    category: 'Document Generator',
    categoryColor: 'from-cyan-500 to-blue-600',
    title: 'SaaS Partnership Agreement: Generator & Free Template',
    description: 'Comprehensive guide and generator for SaaS partnerships outlining purpose, scope, financial terms, decision-making, IP rights, and dispute resolution mechanisms.',
    url: 'https://terms.law/2023/01/20/saas-partnership-agreement-essential-clauses-free-template/',
    gradient: 'from-cyan-600 to-blue-600',
    bgGradient: 'from-cyan-50 to-blue-50'
  },
  {
    id: 'russian-nda',
    icon: '🤝',
    category: 'Документы',
    categoryColor: 'from-cyan-500 to-blue-600',
    title: 'Русско-английское СОГЛАШЕНИЕ О НЕРАЗГЛАШЕНИИ ИНФОРМАЦИИ (Russian-English NDA generator)',
    description: 'Генератор двуязычного соглашения о неразглашении (NDA) позволяет создать профессиональный документ на русском и английском языках, соблюдающий законодательство США. Он помогает российским предпринимателям защитить конфиденциальную информацию при сотрудничестве с американскими партнерами.',
    url: 'https://terms.law/2017/08/09/russian-english-dual-language-nda-generator-template/',
    gradient: 'from-cyan-600 to-blue-600',
    bgGradient: 'from-cyan-50 to-blue-50'
  },
  {
    id: 'llc-nonresidents',
    icon: '🏢',
    category: 'Международный Бизнес',
    categoryColor: 'from-blue-500 to-indigo-600',
    title: 'Руководство по LLC в США для нерезидентов',
    description: 'Полное руководство для иностранных предпринимателей по созданию LLC в США: преимущества американской юрисдикции, банковское дело, обработка платежей, налоговые аспекты и требования соответствия.',
    url: 'https://terms.law/2023/01/30/llc-for-nonresidents/',
    gradient: 'from-blue-600 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50'
  }
];

// Enhanced card component with professional design
const BlogCard = ({ data, index, onCardHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsAnimating(true);
    onCardHover(data.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsAnimating(false);
    onCardHover(null);
  };

  const handleCardClick = () => {
    window.open(data.url, '_blank');
  };
  
  // Create animated background patterns for popular cards
  const renderAnimatedBackground = () => {
    if (!data.isPopular || !isHovered) return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute w-64 h-64 -bottom-32 -right-32 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>
    );
  };
  
  // Render tax calculator sample for W2 vs 1099 card
  const renderTaxCalculatorSample = () => {
    if (data.id !== 'tax-calculator') return null;
    
    return (
      <div className={`absolute top-4 right-4 transition-all duration-500 ${isHovered ? 'w-32 h-20 opacity-50' : 'w-24 h-16 opacity-25'}`}>
        <div className="w-full h-full bg-gradient-to-br from-green-900/30 via-emerald-900/30 to-teal-900/30 rounded-lg border border-green-300/20 backdrop-blur-sm p-2">
          <div className="text-xs font-mono text-green-200 space-y-1">
            <div className="flex justify-between">
              <span>W-2:</span>
              <span className="text-green-400">$85,340</span>
            </div>
            <div className="flex justify-between">
              <span>1099:</span>
              <span className="text-red-400">$78,920</span>
            </div>
            <div className="w-full bg-green-900/40 rounded-full h-1 mt-1">
              <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-1 rounded-full w-3/4"></div>
            </div>
            <div className="text-center text-xs text-green-300">
              {isHovered ? 'Better W-2' : '↑ Better'}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render stock transfer animation
  const renderStockTransferAnimation = () => {
    if (data.id !== 'stock-transfer') return null;
    
    return (
      <div className={`absolute top-4 right-4 transition-all duration-500 ${isHovered ? 'w-24 h-24 opacity-70' : 'w-16 h-16 opacity-40'}`}>
        <div className="relative w-full h-full">
          {/* Stock chart background */}
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-600">
            <defs>
              <linearGradient id="stockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            
            {/* Chart grid */}
            <g opacity="0.2">
              <line x1="20" y1="0" x2="20" y2="100" stroke="currentColor" strokeWidth="0.5"/>
              <line x1="40" y1="0" x2="40" y2="100" stroke="currentColor" strokeWidth="0.5"/>
              <line x1="60" y1="0" x2="60" y2="100" stroke="currentColor" strokeWidth="0.5"/>
              <line x1="80" y1="0" x2="80" y2="100" stroke="currentColor" strokeWidth="0.5"/>
              <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeWidth="0.5"/>
              <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5"/>
              <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" strokeWidth="0.5"/>
            </g>
            
            {/* Stock transfer arrow */}
            <path d="M20 60 L50 40 L80 50" stroke="url(#stockGradient)" strokeWidth="3" fill="none" className={isHovered ? "animate-pulse" : ""} strokeDasharray={isHovered ? "none" : "5,5"}/>
            
            {/* Transfer points */}
            <circle cx="20" cy="60" r="3" fill="url(#stockGradient)" className={isHovered ? "animate-ping" : ""} style={{animationDelay: '0.5s'}}/>
            <circle cx="50" cy="40" r="3" fill="url(#stockGradient)" className={isHovered ? "animate-ping" : ""} style={{animationDelay: '1s'}}/>
            <circle cx="80" cy="50" r="3" fill="url(#stockGradient)" className={isHovered ? "animate-ping" : ""} style={{animationDelay: '1.5s'}}/>
          </svg>
          
          {/* Certificate overlay */}
          <div className={`absolute bottom-2 left-2 w-8 h-6 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-sm border border-emerald-300 ${isHovered ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-1 border border-emerald-400 rounded-sm">
              <div className="flex flex-col justify-center items-center h-full text-xs text-emerald-700">
                <div className="text-[6px] font-bold">CERT</div>
              </div>
            </div>
          </div>
          
          {/* Digital signature indicator */}
          <div className={`absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full ${isHovered ? 'animate-ping' : ''}`} style={{animationDelay: '0.3s'}}></div>
        </div>
      </div>
    );
  };

  // Render Trump tariff animation
  const renderTrumpTariffAnimation = () => {
    if (data.id !== 'trump-tariffs') return null;
    
    return (
      <div className={`absolute top-4 right-4 transition-all duration-500 ${isHovered ? 'w-24 h-24 opacity-70' : 'w-16 h-16 opacity-40'}`}>
        <div className="relative w-full h-full">
          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600">
            <defs>
              <linearGradient id="tariffGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
            
            {/* Shield background */}
            <path d="M50 10 L20 25 L20 60 Q20 80 50 90 Q80 80 80 60 L80 25 Z" fill="url(#tariffGradient)" opacity="0.3"/>
            
            {/* Tariff protection bars */}
            <rect x="35" y="35" width="30" height="4" rx="2" fill="currentColor" className={isHovered ? "animate-pulse" : ""} opacity="0.8"/>
            <rect x="30" y="45" width="40" height="4" rx="2" fill="currentColor" className={isHovered ? "animate-pulse" : ""} opacity="0.6" style={{animationDelay: '0.3s'}}/>
            <rect x="25" y="55" width="50" height="4" rx="2" fill="currentColor" className={isHovered ? "animate-pulse" : ""} opacity="0.4" style={{animationDelay: '0.6s'}}/>
            
            {/* Contract protection indicator */}
            <circle cx="50" cy="25" r="8" fill="none" stroke="currentColor" strokeWidth="2" className={isHovered ? "animate-ping" : ""} opacity="0.7"/>
            <circle cx="50" cy="25" r="4" fill="currentColor" opacity="0.9"/>
          </svg>
          
          {/* Protection badge */}
          <div className={`absolute bottom-2 left-2 w-8 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-sm border border-blue-300 ${isHovered ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-1 border border-blue-400 rounded-sm">
              <div className="flex flex-col justify-center items-center h-full text-xs text-blue-700">
                <div className="text-[6px] font-bold">PROT</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render token issuance animation
  const renderTokenIssuanceAnimation = () => {
    if (data.id !== 'token-issuance') return null;
    
    return (
      <div className={`absolute top-4 right-4 transition-all duration-500 ${isHovered ? 'w-24 h-24 opacity-70' : 'w-16 h-16 opacity-40'}`}>
        <div className="relative w-full h-full">
          <svg viewBox="0 0 100 100" className="w-full h-full text-purple-600">
            <defs>
              <linearGradient id="tokenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>
            </defs>
            
            {/* Token circles */}
            <circle cx="30" cy="40" r="12" fill="url(#tokenGradient)" opacity="0.6" className={isHovered ? "animate-pulse" : ""} style={{animationDelay: '0s'}}/>
            <circle cx="70" cy="40" r="12" fill="url(#tokenGradient)" opacity="0.6" className={isHovered ? "animate-pulse" : ""} style={{animationDelay: '0.5s'}}/>
            <circle cx="50" cy="65" r="12" fill="url(#tokenGradient)" opacity="0.6" className={isHovered ? "animate-pulse" : ""} style={{animationDelay: '1s'}}/>
            
            {/* Connecting lines */}
            <line x1="30" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="2" opacity="0.4" className={isHovered ? "animate-pulse" : ""}/>
            <line x1="30" y1="40" x2="50" y2="65" stroke="currentColor" strokeWidth="2" opacity="0.4" className={isHovered ? "animate-pulse" : ""}/>
            <line x1="70" y1="40" x2="50" y2="65" stroke="currentColor" strokeWidth="2" opacity="0.4" className={isHovered ? "animate-pulse" : ""}/>
            
            {/* Center token */}
            <circle cx="50" cy="50" r="8" fill="currentColor" className={isHovered ? "animate-ping" : ""} opacity="0.8"/>
          </svg>
          
          {/* Blockchain badge */}
          <div className={`absolute bottom-2 right-2 w-8 h-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-sm border border-purple-300 ${isHovered ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-1 border border-purple-400 rounded-sm">
              <div className="flex flex-col justify-center items-center h-full text-xs text-purple-700">
                <div className="text-[6px] font-bold">TOK</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render import agency animation
  const renderImportAgencyAnimation = () => {
    if (data.id !== 'import-agency') return null;
    
    return (
      <div className={`absolute top-4 right-4 transition-all duration-500 ${isHovered ? 'w-24 h-24 opacity-70' : 'w-16 h-16 opacity-40'}`}>
        <div className="relative w-full h-full">
          <svg viewBox="0 0 100 100" className="w-full h-full text-orange-600">
            <defs>
              <linearGradient id="importGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="50%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
            
            {/* Globe outline */}
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
            
            {/* Import arrows */}
            <path d="M20 50 L45 50" stroke="url(#importGradient)" strokeWidth="3" fill="none" className={isHovered ? "animate-pulse" : ""} markerEnd="url(#arrowhead)"/>
            <path d="M55 50 L80 50" stroke="url(#importGradient)" strokeWidth="3" fill="none" className={isHovered ? "animate-pulse" : ""} style={{animationDelay: '0.5s'}} markerEnd="url(#arrowhead)"/>
            
            {/* Shipping containers */}
            <rect x="15" y="45" width="8" height="10" rx="1" fill="currentColor" opacity="0.6" className={isHovered ? "animate-pulse" : ""}/>
            <rect x="77" y="45" width="8" height="10" rx="1" fill="currentColor" opacity="0.6" className={isHovered ? "animate-pulse" : ""} style={{animationDelay: '0.3s'}}/>
            
            {/* Arrow marker definition */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor"/>
              </marker>
            </defs>
          </svg>
          
          {/* Trade badge */}
          <div className={`absolute bottom-2 left-2 w-8 h-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-sm border border-orange-300 ${isHovered ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-1 border border-orange-400 rounded-sm">
              <div className="flex flex-col justify-center items-center h-full text-xs text-orange-700">
                <div className="text-[6px] font-bold">IMP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render interior design animation
  const renderInteriorDesignAnimation = () => {
    if (data.id !== 'interior-design') return null;
    
    return (
      <div className={`absolute top-4 right-4 transition-all duration-500 ${isHovered ? 'w-24 h-24 opacity-70' : 'w-16 h-16 opacity-40'}`}>
        <div className="relative w-full h-full">
          <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-600">
            <defs>
              <linearGradient id="designGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="50%" stopColor="#3730a3" />
                <stop offset="100%" stopColor="#312e81" />
              </linearGradient>
            </defs>
            
            {/* Room outline */}
            <rect x="20" y="30" width="60" height="50" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
            
            {/* Furniture elements */}
            <rect x="25" y="60" width="15" height="8" rx="2" fill="url(#designGradient)" opacity="0.6" className={isHovered ? "animate-pulse" : ""} style={{animationDelay: '0s'}}/>
            <rect x="60" y="35" width="8" height="15" rx="2" fill="url(#designGradient)" opacity="0.6" className={isHovered ? "animate-pulse" : ""} style={{animationDelay: '0.3s'}}/>
            <circle cx="50" cy="55" r="8" fill="url(#designGradient)" opacity="0.4" className={isHovered ? "animate-pulse" : ""} style={{animationDelay: '0.6s'}}/>
            
            {/* Design lines */}
            <line x1="30" y1="25" x2="70" y2="25" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" className={isHovered ? "animate-pulse" : ""}/>
            <line x1="85" y1="35" x2="85" y2="75" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" className={isHovered ? "animate-pulse" : ""}/>
          </svg>
          
          {/* Design badge */}
          <div className={`absolute bottom-2 right-2 w-8 h-6 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-sm border border-indigo-300 ${isHovered ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-1 border border-indigo-400 rounded-sm">
              <div className="flex flex-col justify-center items-center h-full text-xs text-indigo-700">
                <div className="text-[6px] font-bold">DES</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render SaaS partnership animation
  const renderSaaSPartnershipAnimation = () => {
    if (data.id !== 'saas-partnership') return null;
    
    return (
      <div className={`absolute top-4 right-4 transition-all duration-500 ${isHovered ? 'w-24 h-24 opacity-70' : 'w-16 h-16 opacity-40'}`}>
        <div className="relative w-full h-full">
          <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-600">
            <defs>
              <linearGradient id="saasGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#0891b2" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>
            </defs>
            
            {/* Cloud platforms */}
            <ellipse cx="30" cy="40" rx="15" ry="8" fill="url(#saasGradient)" opacity="0.4" className={isHovered ? "animate-pulse" : ""} style={{animationDelay: '0s'}}/>
            <ellipse cx="70" cy="40" rx="15" ry="8" fill="url(#saasGradient)" opacity="0.4" className={isHovered ? "animate-pulse" : ""} style={{animationDelay: '0.5s'}}/>
            
            {/* Partnership connection */}
            <path d="M45 40 Q50 30 55 40" stroke="currentColor" strokeWidth="3" fill="none" className={isHovered ? "animate-pulse" : ""} opacity="0.7"/>
            
            {/* API endpoints */}
            <circle cx="30" cy="40" r="3" fill="currentColor" className={isHovered ? "animate-ping" : ""} opacity="0.8"/>
            <circle cx="70" cy="40" r="3" fill="currentColor" className={isHovered ? "animate-ping" : ""} style={{animationDelay: '0.3s'}} opacity="0.8"/>
            
            {/* Data flow indicators */}
            <rect x="25" y="55" width="50" height="2" rx="1" fill="currentColor" opacity="0.5" className={isHovered ? "animate-pulse" : ""}/>
            <rect x="30" y="60" width="40" height="2" rx="1" fill="currentColor" opacity="0.3" className={isHovered ? "animate-pulse" : ""} style={{animationDelay: '0.2s'}}/>
          </svg>
          
          {/* SaaS badge */}
          <div className={`absolute bottom-2 left-2 w-8 h-6 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-sm border border-cyan-300 ${isHovered ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-1 border border-cyan-400 rounded-sm">
              <div className="flex flex-col justify-center items-center h-full text-xs text-cyan-700">
                <div className="text-[6px] font-bold">SaaS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render MSA generator animation
  const renderMSAAnimation = () => {
    if (data.id !== 'master-services') return null;
    
    return (
      <div className={`absolute top-4 right-4 transition-all duration-500 ${isHovered ? 'w-24 h-24 opacity-70' : 'w-16 h-16 opacity-40'}`}>
        <div className="relative w-full h-full">
          {/* Master agreement framework */}
          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-600">
            <defs>
              <linearGradient id="msaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
            </defs>
            
            {/* Main document structure */}
            <rect x="25" y="20" width="50" height="60" rx="3" fill="none" stroke="url(#msaGradient)" strokeWidth="2" className={isHovered ? "animate-pulse" : ""}/>
            
            {/* Document sections */}
            <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            <line x1="30" y1="40" x2="65" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            <line x1="30" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            <line x1="30" y1="60" x2="70" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            <line x1="30" y1="70" x2="55" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            
            {/* SOW modules */}
            <rect x="15" y="35" width="8" height="10" rx="1" fill="url(#msaGradient)" opacity="0.7" className={isHovered ? "animate-bounce" : ""} style={{animationDelay: '0.5s'}}/>
            <rect x="15" y="50" width="8" height="10" rx="1" fill="url(#msaGradient)" opacity="0.7" className={isHovered ? "animate-bounce" : ""} style={{animationDelay: '1s'}}/>
            <rect x="77" y="40" width="8" height="10" rx="1" fill="url(#msaGradient)" opacity="0.7" className={isHovered ? "animate-bounce" : ""} style={{animationDelay: '1.5s'}}/>
            
            {/* Connection lines */}
            <line x1="23" y1="40" x2="25" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.4" className={isHovered ? "animate-pulse" : ""}/>
            <line x1="23" y1="55" x2="25" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.4" className={isHovered ? "animate-pulse" : ""}/>
            <line x1="75" y1="45" x2="77" y2="45" stroke="currentColor" strokeWidth="1" opacity="0.4" className={isHovered ? "animate-pulse" : ""}/>
          </svg>
          
          {/* MSA badge */}
          <div className={`absolute bottom-1 left-1 text-xs font-bold text-slate-500 ${isHovered ? 'animate-pulse' : ''}`}>
            MSA
          </div>
          
          {/* SOW indicators */}
          <div className={`absolute top-1 left-1 w-2 h-2 bg-blue-500 rounded-full ${isHovered ? 'animate-ping' : ''}`} style={{animationDelay: '0.2s'}}></div>
          <div className={`absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full ${isHovered ? 'animate-ping' : ''}`} style={{animationDelay: '0.8s'}}></div>
        </div>
      </div>
    );
  };

  // Render analyzer visualization for Claude outputs post
  const renderAnalyzerVisualization = () => {
    if (data.id !== 'claude-outputs') return null;
    
    return (
      <div className={`absolute top-4 right-4 transition-all duration-500 ${isHovered ? 'w-24 h-24 opacity-40' : 'w-16 h-16 opacity-20'}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-purple-500">
          {/* Outer rotating ring */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" style={{animationDuration: '4s'}} opacity="0.8"></circle>
          
          {/* Risk gauge arc */}
          <path 
            d="M 20 50 A 30 30 0 0 1 80 50" 
            fill="none" 
            stroke="url(#riskGradient)" 
            strokeWidth="3"
            className={isHovered ? "animate-pulse" : ""}
          />
          
          {/* Center pulse */}
          <circle cx="50" cy="50" r="8" fill="currentColor" className="animate-pulse" opacity="0.9"></circle>
          
          {/* Risk indicators */}
          <circle cx="25" cy="35" r="2" fill="#39ff14" className="animate-pulse" style={{animationDelay: '0.5s'}} opacity="0.7"></circle>
          <circle cx="75" cy="35" r="2" fill="#ffaa00" className="animate-pulse" style={{animationDelay: '1s'}} opacity="0.7"></circle>
          <circle cx="50" cy="25" r="2" fill="#ff3344" className="animate-pulse" style={{animationDelay: '1.5s'}} opacity="0.7"></circle>
          
          {/* Analysis rays */}
          <line x1="50" y1="50" x2="25" y2="35" stroke="currentColor" strokeWidth="1" opacity="0.3" className={isHovered ? "animate-pulse" : ""}></line>
          <line x1="50" y1="50" x2="75" y2="35" stroke="currentColor" strokeWidth="1" opacity="0.3" className={isHovered ? "animate-pulse" : ""}></line>
          <line x1="50" y1="50" x2="50" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.3" className={isHovered ? "animate-pulse" : ""}></line>
          
          {/* Mini legal scales */}
          <g transform="translate(15, 70)" opacity="0.6">
            <rect x="0" y="0" width="8" height="2" rx="1" fill="currentColor"></rect>
            <rect x="2" y="-3" width="4" height="1" rx="0.5" fill="currentColor"></rect>
            <line x1="4" y1="-3" x2="4" y2="2" stroke="currentColor" strokeWidth="0.5"></line>
          </g>
          
          {/* Mini document stack */}
          <g transform="translate(75, 70)" opacity="0.6">
            <rect x="0" y="0" width="6" height="8" rx="1" fill="currentColor"></rect>
            <rect x="1" y="-1" width="6" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="0.5"></rect>
            <rect x="2" y="-2" width="6" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="0.5"></rect>
          </g>
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#39ff14" />
              <stop offset="50%" stopColor="#ffaa00" />
              <stop offset="100%" stopColor="#ff3344" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Hover overlay with mini screenshot effect */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 rounded-lg backdrop-blur-sm border border-purple-300/20 flex items-center justify-center">
            <div className="text-white text-xs font-mono opacity-80 text-center">
              <div>RISK</div>
              <div className="text-purple-300">ANALYZER</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={cardRef}
      className={`
        group relative bg-white rounded-xl border cursor-pointer overflow-hidden
        transition-all duration-700 ease-out transform-gpu
        ${data.isPopular ? 'shadow-2xl border-purple-200' : 'shadow-lg border-gray-100'}
        ${isHovered ? 'shadow-3xl -translate-y-3 scale-[1.03]' : 'shadow-lg translate-y-0 scale-100'}
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
        ${data.isPopular ? 'ring-2 ring-purple-100 ring-opacity-50' : ''}
      `}
      style={{
        background: isHovered && data.isPopular
          ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.03), rgba(59, 130, 246, 0.03), rgba(6, 182, 212, 0.03))'
          : isHovered 
          ? `linear-gradient(135deg, ${data.bgGradient.replace('from-', '').replace('to-', ', ').replace('-50', '-30')})` 
          : 'white',
        transitionDelay: `${index * 80}ms`,
        backdropFilter: isHovered ? 'blur(10px)' : 'none'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      {/* Animated background for popular cards */}
      {renderAnimatedBackground()}
      
      {/* Premium gradient border for popular cards */}
      {data.isPopular && (
        <div className={`
          absolute inset-0 rounded-xl opacity-0 transition-opacity duration-700
          bg-gradient-to-r ${data.categoryGradient || data.gradient}
          ${isHovered ? 'opacity-20' : 'opacity-10'}
        `} />
      )}
      
      {/* Analyzer visualization for Claude outputs */}
      {renderAnalyzerVisualization()}
      
      {/* Stock transfer animation */}
      {renderStockTransferAnimation()}
      
      {/* MSA generator animation */}
      {renderMSAAnimation()}
      
      {/* Tax calculator sample for W2 vs 1099 card */}
      {renderTaxCalculatorSample()}
      
      {/* Trump tariff animation */}
      {renderTrumpTariffAnimation()}
      
      {/* Token issuance animation */}
      {renderTokenIssuanceAnimation()}
      
      {/* Import agency animation */}
      {renderImportAgencyAnimation()}
      
      {/* Interior design animation */}
      {renderInteriorDesignAnimation()}
      
      {/* SaaS partnership animation */}
      {renderSaaSPartnershipAnimation()}
      
      {/* Gradient overlay */}
      <div 
        className={`
          absolute inset-0 rounded-xl transition-opacity duration-500
          ${data.isPopular 
            ? `bg-gradient-to-br ${data.categoryGradient || data.bgGradient} opacity-5`
            : `bg-gradient-to-br ${data.bgGradient} opacity-0`}
          ${isHovered ? (data.isPopular ? 'opacity-10' : 'opacity-8') : (data.isPopular ? 'opacity-5' : 'opacity-0')}
        `}
      />

      <div className="relative p-6 z-10">
        {/* Enhanced header with badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col gap-2">
            <span className={`
              inline-block text-xs font-semibold px-3 py-1.5 rounded-full
              ${data.isPopular 
                ? `bg-gradient-to-r ${data.categoryGradient || data.categoryColor} text-white shadow-lg`
                : `bg-gradient-to-r ${data.categoryColor} text-white`
              }
              transform transition-all duration-300
              ${isHovered ? 'scale-105 shadow-lg' : 'scale-100'}
            `}>
              {data.category}
            </span>
            {data.badge && (
              <span className={`
                inline-block text-xs font-bold px-2 py-1 rounded-md
                bg-gradient-to-r ${data.badgeColor} text-white
                animate-pulse shadow-sm
                ${isHovered ? 'animate-none' : ''}
              `}>
                {data.badge}
              </span>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {/* Hide icon for cards with animations */}
            {!['claude-outputs', 'tax-calculator', 'stock-transfer', 'master-services', 'trump-tariffs', 'token-issuance', 'import-agency', 'interior-design', 'saas-partnership'].includes(data.id) && (
              <div 
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center text-xl
                  ${data.isPopular 
                    ? `bg-gradient-to-br ${data.categoryGradient || data.gradient} shadow-lg`
                    : `bg-gradient-to-br ${data.gradient}`
                  } text-white backdrop-blur-sm
                  transform transition-all duration-500
                  ${isHovered ? 'scale-125 rotate-12 shadow-2xl' : 'scale-100 rotate-0'}
                `}
              >
                {data.icon}
              </div>
            )}
            
            {data.hasAnalyzer && (
              <div className={`
                text-xs font-medium px-2 py-1 rounded-md bg-purple-100 text-purple-700
                transition-all duration-300 border border-purple-200
                ${isHovered ? 'bg-purple-200 scale-105' : ''}
              `}>
                ✨ Interactive Tool
              </div>
            )}
          </div>
        </div>

        {/* Enhanced title with professional typography */}
        <h3 className={`
          ${data.isPopular ? 'text-xl' : 'text-lg'} font-bold text-gray-900 leading-tight mb-4
          transition-all duration-300
          ${isHovered ? 'text-gray-800' : 'text-gray-900'}
          ${data.isPopular ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent' : ''}
        `}>
          {data.title}
        </h3>

        {/* Enhanced description with better readability */}
        <p className={`
          text-sm leading-relaxed transition-all duration-300
          ${data.isPopular ? 'text-gray-700' : 'text-gray-600'}
          ${isHovered ? 'text-gray-800' : ''}
        `}>
          {data.description}
        </p>
        
        {/* Call-to-action hint for popular posts */}
        {data.isPopular && (
          <div className={`
            mt-4 text-xs font-medium transition-all duration-300
            ${isHovered ? 'text-purple-600 translate-x-1' : 'text-gray-400'}
            flex items-center gap-1
          `}>
            <span>→</span>
            <span>Click to explore</span>
          </div>
        )}
      </div>

      {/* Enhanced glow effects */}
      <div className={`
        absolute -inset-1 rounded-xl blur-xl transition-all duration-700
        ${data.isPopular 
          ? `bg-gradient-to-r ${data.categoryGradient || data.gradient} opacity-0`
          : `bg-gradient-to-r ${data.gradient} opacity-0`}
        ${isHovered ? (data.isPopular ? 'opacity-30 blur-2xl' : 'opacity-20 blur-lg') : 'opacity-0'}
      `} />
      
      {/* Premium shine effect for popular cards */}
      {data.isPopular && (
        <div className={`
          absolute inset-0 rounded-xl transition-all duration-1000
          bg-gradient-to-r from-transparent via-white to-transparent
          transform -skew-x-12 -translate-x-full
          ${isAnimating ? 'translate-x-full opacity-20' : '-translate-x-full opacity-0'}
        `} style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          width: '200%',
          animation: isAnimating ? 'shine 2s ease-in-out' : 'none'
        }} />
      )}
    </div>
  );
};

// Enhanced main component with professional layout
const BlogCards = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleCardHover = (cardId) => {
    setHoveredCard(cardId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Enhanced header section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Legal Tools & Analysis
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Professional-grade document generators, in-depth legal analysis, and cutting-edge AI law insights for modern businesses.
        </p>
      </div>

      {/* Cards grid with enhanced spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {allCardsData.map((data, index) => (
          <BlogCard
            key={data.id}
            data={data}
            index={index}
            onCardHover={handleCardHover}
          />
        ))}
      </div>

      {/* Enhanced View All Button */}
      <div className="text-center">
        <a 
          href="https://terms.law/posts/"
          className="
            inline-flex items-center gap-3 px-8 py-4 text-base font-semibold
            text-white bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600
            rounded-xl shadow-lg hover:shadow-2xl
            transform transition-all duration-300 hover:scale-105
            border border-purple-200 backdrop-blur-sm
          "
        >
          <span>Explore All Articles</span>
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

// Add custom animations
const style = document.createElement('style');
style.textContent = `
  @keyframes shine {
    0% { transform: translateX(-100%) skewX(-12deg); }
    100% { transform: translateX(200%) skewX(-12deg); }
  }
  
  .shadow-3xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 50px rgba(147, 51, 234, 0.1);
  }
`;
document.head.appendChild(style);

// Render the enhanced component
ReactDOM.render(<BlogCards />, document.getElementById('root'));