const { useState, useEffect, useRef, useMemo } = React;

// Sophisticated card data with enhanced content
const takeawayData = [
  {
    id: 'ownership',
    icon: '⚖️',
    title: 'You Own Claude\'s Outputs',
    subtitle: 'With Important Caveats',
    content: 'Under Anthropic\'s latest Terms, users retain ownership of IP rights if any exist in Claude\'s outputs. Anthropic assigns whatever rights it has to you, subject to compliance with their terms.',
    risk: 'conditional',
    gradient: 'from-blue-600 to-purple-600',
    bgGradient: 'from-blue-50 to-purple-50',
    details: [
      'Assignment is conditional on ToS compliance',
      'Rights exist "if any" - not guaranteed',
      'Applies to both consumer and commercial users'
    ],
    implications: 'You must follow all usage restrictions to maintain ownership rights'
  },
  {
    id: 'copyright',
    icon: '📄',
    title: 'No Automatic Copyright',
    subtitle: '"If Any" Rights Explained',
    content: 'The phrase "if any" acknowledges that purely AI-created material may not qualify for copyright. You may need to add substantial human originality to make work copyrightable.',
    risk: 'medium',
    gradient: 'from-pink-500 to-red-500',
    bgGradient: 'from-pink-50 to-red-50',
    details: [
      'AI-only content may lack copyright protection',
      'Human creativity strengthens copyright claims',
      'Jurisdiction-dependent interpretations'
    ],
    implications: 'Add substantial human input to ensure copyright protection'
  },
  {
    id: 'usage',
    icon: '🚫',
    title: 'Strict Usage Rules Apply',
    subtitle: 'Ownership ≠ Free Reign',
    content: 'Anthropic places contractual restrictions on Claude content use. You cannot develop competing AI, must avoid prohibited content, and follow disclosure rules in sensitive domains.',
    risk: 'high',
    gradient: 'from-cyan-500 to-blue-600',
    bgGradient: 'from-cyan-50 to-blue-50',
    details: [
      'Cannot build competing AI systems',
      'Prohibited content restrictions apply',
      'Disclosure required in sensitive domains'
    ],
    implications: 'Compliance failures can void your ownership rights'
  },
  {
    id: 'resale',
    icon: '💼',
    title: 'No Raw Output Resale',
    subtitle: 'Integration Required',
    content: 'Anthropic forbids selling Claude\'s raw outputs as standalone works. You must integrate with original material and never misrepresent AI content as human-written.',
    risk: 'high',
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
    details: [
      'Raw outputs cannot be sold independently',
      'Must integrate with human-created content',
      'Transparency about AI involvement required'
    ],
    implications: 'Commercial use requires substantial human contribution'
  },
  {
    id: 'protection',
    icon: '🛡️',
    title: 'Enhanced User Protections',
    subtitle: 'Indemnity Coverage',
    content: 'Anthropic disclaims interest in your inputs/outputs and won\'t train on your data. Business customers get legal indemnity against copyright infringement claims.',
    risk: 'low',
    gradient: 'from-orange-500 to-pink-500',
    bgGradient: 'from-orange-50 to-pink-50',
    details: [
      'No training on customer data',
      'Legal indemnity for business users',
      'Strong privacy protections'
    ],
    implications: 'Business accounts offer superior legal protection'
  },
  {
    id: 'human',
    icon: '🤝',
    title: 'Add Human Value',
    subtitle: 'Tool, Not Factory',
    content: 'Use Claude as a tool, not final content factory. Human expertise, editing, and verification are crucial. Adding your creativity strengthens quality and legal standing.',
    risk: 'best-practice',
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-50 to-purple-50',
    details: [
      'Human oversight essential for quality',
      'Creative input strengthens IP claims',
      'Professional judgment cannot be automated'
    ],
    implications: 'Human-AI collaboration yields the best results'
  }
];

// Risk level configurations
const riskConfig = {
  low: { 
    color: 'text-emerald-700', 
    bg: 'bg-emerald-100', 
    border: 'border-emerald-200',
    label: 'Low Risk'
  },
  medium: { 
    color: 'text-amber-700', 
    bg: 'bg-amber-100', 
    border: 'border-amber-200',
    label: 'Medium Risk'
  },
  high: { 
    color: 'text-red-700', 
    bg: 'bg-red-100', 
    border: 'border-red-200',
    label: 'High Risk'
  },
  conditional: { 
    color: 'text-blue-700', 
    bg: 'bg-blue-100', 
    border: 'border-blue-200',
    label: 'Conditional'
  },
  'best-practice': { 
    color: 'text-purple-700', 
    bg: 'bg-purple-100', 
    border: 'border-purple-200',
    label: 'Best Practice'
  }
};

// Individual card component with advanced interactions
const TakeawayCard = ({ data, index, onCardHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const riskStyle = riskConfig[data.risk];

  return (
    <div
      ref={cardRef}
      className={`
        group relative bg-white rounded-2xl shadow-lg border border-gray-100
        transition-all duration-500 ease-out cursor-pointer
        hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${isExpanded ? 'col-span-full md:col-span-2' : ''}
      `}
      style={{
        background: isHovered 
          ? `linear-gradient(135deg, ${data.bgGradient.replace('from-', '').replace('to-', ', ')})` 
          : 'white',
        transitionDelay: `${index * 100}ms`
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={toggleExpansion}
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
            <div>
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                {data.title}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {data.subtitle}
              </p>
            </div>
          </div>
          
          {/* Risk badge */}
          <div className={`
            px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
            ${riskStyle.bg} ${riskStyle.color} ${riskStyle.border} border
            transition-all duration-300
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}>
            {riskStyle.label}
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-700 leading-relaxed mb-4 text-base">
          {data.content}
        </p>

        {/* Expandable details */}
        <div className={`
          overflow-hidden transition-all duration-500 ease-out
          ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Key Details:</h4>
            <ul className="space-y-2 mb-4">
              {data.details.map((detail, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className={`
                    w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0
                    bg-gradient-to-r ${data.gradient}
                  `} />
                  <span className="text-gray-600 text-sm">{detail}</span>
                </li>
              ))}
            </ul>
            
            <div className={`
              p-4 rounded-lg border-l-4 bg-gray-50
              border-l-gradient bg-gradient-to-r ${data.gradient}
            `}>
              <h5 className="font-medium text-gray-900 mb-1">Legal Implication:</h5>
              <p className="text-gray-700 text-sm">{data.implications}</p>
            </div>
          </div>
        </div>

        {/* Expansion indicator */}
        <div className="flex items-center justify-center mt-4">
          <div className={`
            w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center
            transition-all duration-300 cursor-pointer hover:bg-gray-200
            ${isExpanded ? 'rotate-180' : 'rotate-0'}
          `}>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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
const TakeawayCards = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'masonry'

  const handleCardHover = (cardId) => {
    setHoveredCard(cardId);
  };

  const gridClasses = useMemo(() => {
    if (viewMode === 'masonry') {
      return 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6';
    }
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  }, [viewMode]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50/50">
      {/* Optional header with view mode toggle */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Legal Analysis
            </h2>
            <p className="text-gray-600 text-sm">
              Click any card for detailed analysis
            </p>
          </div>
        </div>
        
        {/* View mode toggle */}
        <div className="hidden md:flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border">
          {['grid', 'masonry'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                ${viewMode === mode 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards container */}
      <div className={gridClasses}>
        {takeawayData.map((data, index) => (
          <div key={data.id} className={viewMode === 'masonry' ? 'break-inside-avoid' : ''}>
            <TakeawayCard
              data={data}
              index={index}
              onCardHover={handleCardHover}
            />
          </div>
        ))}
      </div>

      {/* Subtle footer */}
      <div className="mt-12 text-center">
        <p className="text-gray-400 text-sm">
          Analysis based on Anthropic's Terms of Service • Not legal advice
        </p>
      </div>
    </div>
  );
};

// Render the component
ReactDOM.render(<TakeawayCards />, document.getElementById('root'));