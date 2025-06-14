const { useState, useEffect, useRef } = React;

// All blog post/generator data from the original design
const allCardsData = [
  // Document Generators (Top Section)
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
    id: 'claude-outputs',
    icon: '🤖',
    category: 'AI Law',
    categoryColor: 'from-purple-500 to-violet-600',
    title: 'Who Owns Claude\'s Outputs and How Can They Be Used?',
    description: 'This analysis examines legal aspects of ownership and usage rights for AI-generated content, highlighting user responsibilities, copyright considerations, and practical strategies for retaining ownership.',
    url: 'https://terms.law/2024/08/24/who-owns-claudes-outputs-and-how-can-they-be-used/',
    gradient: 'from-purple-600 to-violet-600',
    bgGradient: 'from-purple-50 to-violet-50'
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
    title: 'IMPORT AGENCY AGREEMENT (Generator)',
    description: 'Create tailored agreements defining the relationship between a Principal and an Agent for importing merchandise, with clear expectations and legal protections for international trade.',
    url: 'https://terms.law/2022/11/02/import-agency-agreement-free-template/',
    gradient: 'from-orange-600 to-red-600',
    bgGradient: 'from-orange-50 to-red-50'
  },
  // Popular Blog Posts and Generators
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
    id: 'angel-investor',
    icon: '👼',
    category: 'Document Generator',
    categoryColor: 'from-rose-500 to-pink-600',
    title: 'Angel Investor Agreement Generator & Template',
    description: 'Create tailored agreements for early-stage investments with essential details including company information, investment structure, and comprehensive investor rights.',
    url: 'https://terms.law/2023/08/11/drafting-angel-investor-agreements-a-comprehensive-guide-free-template-included/',
    gradient: 'from-rose-600 to-pink-600',
    bgGradient: 'from-rose-50 to-pink-50'
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

// Individual card component
const BlogCard = ({ data, index, onCardHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onCardHover(data.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onCardHover(null);
  };

  const handleCardClick = () => {
    window.open(data.url, '_blank');
  };

  return (
    <div
      ref={cardRef}
      className={`
        group relative bg-white rounded-xl shadow-lg border border-gray-100
        transition-all duration-500 ease-out cursor-pointer
        hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{
        background: isHovered 
          ? `linear-gradient(135deg, ${data.bgGradient.replace('from-', '').replace('to-', ', ')})` 
          : 'white',
        transitionDelay: `${index * 100}ms`
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      {/* Gradient overlay */}
      <div 
        className={`
          absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500
          bg-gradient-to-br ${data.bgGradient}
          ${isHovered ? 'opacity-10' : 'opacity-0'}
        `}
      />

      <div className="relative p-5 z-10">
        {/* Category badge and icon */}
        <div className="flex items-center justify-between mb-3">
          <span className={`
            inline-block font-size-12px color-#64748b background-color-#f8fafc 
            padding-3px-10px border-radius-20px text-xs font-medium
            bg-gradient-to-r ${data.categoryColor} text-white px-3 py-1 rounded-full
          `}>
            {data.category}
          </span>
          <div 
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center text-lg
              bg-gradient-to-br ${data.gradient} text-white
              transform transition-transform duration-300
              ${isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}
            `}
          >
            {data.icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-size-18px font-weight-600 margin-bottom-12px color-#1e293b line-height-1.4 text-lg font-semibold text-gray-900 leading-tight mb-3">
          {data.title}
        </h3>

        {/* Description */}
        <p className="color-#4b5563 font-size-14px line-height-1.6 text-sm text-gray-600 leading-relaxed">
          {data.description}
        </p>
      </div>

      {/* Hover glow effect */}
      <div className={`
        absolute -inset-0.5 rounded-xl blur opacity-0 transition-opacity duration-500
        bg-gradient-to-r ${data.gradient}
        ${isHovered ? 'opacity-15' : 'opacity-0'}
      `} />
    </div>
  );
};

// Main component
const BlogCards = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleCardHover = (cardId) => {
    setHoveredCard(cardId);
  };

  return (
    <div className="max-width-1200px margin-0-auto padding-40px-20px w-full max-w-7xl mx-auto p-6">
      {/* Cards grid */}
      <div className="display-grid grid-template-columns-repeat-3-1fr gap-24px margin-bottom-40px grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {allCardsData.map((data, index) => (
          <BlogCard
            key={data.id}
            data={data}
            index={index}
            onCardHover={handleCardHover}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="margin-top-30px text-align-center mt-8 text-center">
        <a 
          href="https://terms.law/posts/"
          className="display-inline-block border-1px-solid-#1e293b color-#1e293b padding-12px-24px font-size-14px font-weight-500 text-decoration-none border-radius-4px transition-all-0.2s-ease background-color-#f8fafc box-shadow-0-2px-4px-rgba-0-0-0-0.05 inline-block border border-gray-800 text-gray-800 px-6 py-3 text-sm font-medium rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200"
        >
          View All Articles
        </a>
      </div>
    </div>
  );
};

// Render the component
ReactDOM.render(<BlogCards />, document.getElementById('root'));