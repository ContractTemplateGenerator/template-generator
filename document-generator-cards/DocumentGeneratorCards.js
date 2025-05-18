const { useState, useEffect, useRef } = React;

// Document generator data
const generatorData = [
  {
    id: 'tariff-protection',
    icon: '🛡️',
    category: 'Document Generator',
    categoryColor: 'from-blue-500 to-indigo-600',
    title: 'Trump-Era Tariffs: Three Essential Tariff Protection Clauses for Your Business Contracts',
    description: 'As global trade faces disruption from renewed tariffs, businesses must adopt specialized contract provisions to mitigate risks. These include indemnity clauses, price adjustment mechanisms, and force majeure provisions.',
    url: 'https://terms.law/2025/04/03/price-adjustment-clause-generator-for-tariff-fluctuations/',
    gradient: 'from-blue-600 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50',
    features: [
      'Tariff-specific clauses',
      'Price adjustment mechanisms',
      'Risk mitigation strategies'
    ],
    dateAdded: '2025-04-03',
    popularity: 95
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
    bgGradient: 'from-emerald-50 to-teal-50',
    features: [
      'Customizable share transfers',
      'Buyer-seller protections',
      'Legal compliance checks'
    ],
    dateAdded: '2024-04-11',
    popularity: 88
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
    bgGradient: 'from-purple-50 to-violet-50',
    features: [
      'Blockchain compliance',
      'Regulatory safeguards',
      'Token offering terms'
    ],
    dateAdded: '2023-06-16',
    popularity: 82
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
    bgGradient: 'from-orange-50 to-red-50',
    features: [
      'International trade focus',
      'Principal-agent terms',
      'Import compliance'
    ],
    dateAdded: '2022-11-02',
    popularity: 75
  },
  {
    id: 'russian-nda',
    icon: '🤝',
    category: 'Document Generator',
    categoryColor: 'from-cyan-500 to-blue-600',
    title: 'Русско-английское СОГЛАШЕНИЕ О НЕРАЗГЛАШЕНИИ ИНФОРМАЦИИ (Russian-English NDA generator)',
    description: 'Генератор двуязычного соглашения о неразглашении (NDA) позволяет создать профессиональный документ на русском и английском языках, соблюдающий законодательство США.',
    url: 'https://terms.law/2017/08/09/russian-english-dual-language-nda-generator-template/',
    gradient: 'from-cyan-600 to-blue-600',
    bgGradient: 'from-cyan-50 to-blue-50',
    features: [
      'Bilingual documents',
      'US law compliant',
      'Cross-border protection'
    ],
    dateAdded: '2017-08-09',
    popularity: 68
  }
];

// Individual generator card component
const GeneratorCard = ({ data, index, onCardHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), index * 150);
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
        group relative bg-white rounded-2xl shadow-lg border border-gray-100
        transition-all duration-500 ease-out cursor-pointer
        hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{
        background: isHovered 
          ? `linear-gradient(135deg, ${data.bgGradient.replace('from-', '').replace('to-', ', ')})` 
          : 'white',
        transitionDelay: `${index * 150}ms`
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      {/* Gradient overlay */}
      <div 
        className={`
          absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500
          bg-gradient-to-br ${data.bgGradient}
          ${isHovered ? 'opacity-20' : 'opacity-0'}
        `}
      />
      
      {/* Top accent line */}
      <div 
        className={`
          absolute top-0 left-0 right-0 h-1 rounded-t-2xl
          bg-gradient-to-r ${data.gradient}
          transform origin-left transition-transform duration-500
          ${isHovered ? 'scale-x-100' : 'scale-x-0'}
        `}
      />

      <div className="relative p-6 z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div 
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                bg-gradient-to-br ${data.gradient} text-white
                transform transition-transform duration-300
                ${isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}
              `}
            >
              {data.icon}
            </div>
            <div className="flex-1">
              <div className={`
                inline-block px-3 py-1 rounded-full text-xs font-semibold
                bg-gradient-to-r ${data.categoryColor} text-white mb-2
              `}>
                {data.category}
              </div>
            </div>
          </div>
          
          {/* External link indicator */}
          <div className={`
            p-2 rounded-lg bg-gray-100 text-gray-500
            transition-all duration-300
            ${isHovered ? 'bg-gray-200 text-gray-700 scale-110' : 'scale-100'}
          `}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-3 line-clamp-2">
          {data.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {data.description}
        </p>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {data.features.map((feature, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <span className={`
                w-1.5 h-1.5 rounded-full flex-shrink-0
                bg-gradient-to-r ${data.gradient}
              `} />
              <span className="text-gray-600 text-xs">{feature}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-500">
              Added {new Date(data.dateAdded).toLocaleDateString()}
            </div>
          </div>
          <div className={`
            flex items-center space-x-1 px-2 py-1 rounded-full
            bg-gradient-to-r ${data.gradient} text-white text-xs font-medium
          `}>
            <span>★</span>
            <span>{data.popularity}%</span>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className={`
        absolute -inset-0.5 rounded-2xl blur opacity-0 transition-opacity duration-500
        bg-gradient-to-r ${data.gradient}
        ${isHovered ? 'opacity-20' : 'opacity-0'}
      `} />
    </div>
  );
};

// Main component
const DocumentGeneratorCards = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sortBy, setSortBy] = useState('popular'); // 'popular' or 'latest'

  const handleCardHover = (cardId) => {
    setHoveredCard(cardId);
  };

  // Sort data based on selection
  const sortedData = React.useMemo(() => {
    if (sortBy === 'latest') {
      return [...generatorData].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }
    // Default: sort by popularity (descending)
    return [...generatorData].sort((a, b) => b.popularity - a.popularity);
  }, [sortBy]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Document Generators
            </h2>
            <p className="text-gray-600 text-sm">
              Professional legal document creation tools
            </p>
          </div>
        </div>
        
        {/* Sort toggle */}
        <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border">
          {[
            { id: 'popular', label: 'Popular', icon: '⭐' },
            { id: 'latest', label: 'Latest', icon: '📅' }
          ].map((sort) => (
            <button
              key={sort.id}
              onClick={() => setSortBy(sort.id)}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-1
                ${sortBy === sort.id 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span>{sort.icon}</span>
              <span>{sort.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedData.map((data, index) => (
          <GeneratorCard
            key={data.id}
            data={data}
            index={index}
            onCardHover={handleCardHover}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center space-x-4 text-gray-400 text-sm">
          <span>Built with precision by</span>
          <a 
            href="https://terms.law" 
            className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            terms.law
          </a>
          <span>•</span>
          <span>Professional legal tools for businesses</span>
        </div>
      </div>
    </div>
  );
};

// Render the component
ReactDOM.render(<DocumentGeneratorCards />, document.getElementById('root'));