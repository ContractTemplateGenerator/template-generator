const { useState, useEffect, useRef } = React;

// Extended list of all posts (including more recent ones)
const allPostsData = [
  {
    id: 'corporation-fees',
    category: 'Business Law',
    categoryColor: 'from-blue-500 to-indigo-600',
    title: '50-State Corporation Fee Comparison: Finding the Most Cost-Effective States for Incorporation in 2025',
    description: 'A comprehensive analysis of incorporation costs across all 50 states, including filing fees, annual fees, franchise taxes, and hidden costs. This guide helps businesses choose the most cost-effective jurisdiction for incorporation.',
    url: 'https://terms.law/2025/05/15/50-state-corporation-fee-comparison-finding-the-most-cost-effective-states-for-incorporation-in-2025/',
    date: '2025-05-15',
    gradient: 'from-blue-600 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50'
  },
  {
    id: 'trump-tariffs',
    category: 'Document Generator',
    categoryColor: 'from-emerald-500 to-teal-600',
    title: 'Trump-Era Tariffs: Three Essential Tariff Protection Clauses for Your Business Contracts',
    description: 'As global trade faces disruption from renewed tariffs, businesses must adopt specialized contract provisions to mitigate risks. These include indemnity clauses, price adjustment mechanisms, and force majeure provisions.',
    url: 'https://terms.law/2025/04/03/price-adjustment-clause-generator-for-tariff-fluctuations/',
    date: '2025-04-03',
    gradient: 'from-emerald-600 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50'
  },
  {
    id: 'stripe-funds',
    category: 'Financial Law',
    categoryColor: 'from-green-500 to-emerald-600',
    title: 'When Stripe Holds Your Money: The Definitive Legal Guide to Getting Your Funds Released',
    description: 'Payment processors like Stripe can hold merchant funds for various reasons, from suspected fraud to policy violations. This guide examines the legal frameworks that govern these holds, your rights as a merchant, and practical steps to expedite the release of your funds.',
    url: 'https://terms.law/2025/03/03/when-stripe-holds-your-money-the-definitive-legal-guide-to-getting-your-funds-released/',
    date: '2025-03-03',
    gradient: 'from-green-600 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50'
  },
  {
    id: 'lawyers-ai',
    category: 'Legal Tech',
    categoryColor: 'from-indigo-500 to-blue-600',
    title: 'Why Lawyers Haven\'t Embraced AI Yet: Evidence from Four Million Claude Conversations',
    description: 'Despite the AI revolution sweeping across industries, the legal profession has been notably cautious in adoption. This article examines data from millions of AI interactions to understand the barriers, concerns, and opportunities for AI integration in legal practice.',
    url: 'https://terms.law/2025/03/02/why-lawyers-havent-embraced-ai-yet-evidence-from-four-million-claude-conversations/',
    date: '2025-03-02',
    gradient: 'from-indigo-600 to-blue-600',
    bgGradient: 'from-indigo-50 to-blue-50'
  },
  {
    id: 'corporate-transparency',
    category: 'Business Law',
    categoryColor: 'from-slate-500 to-gray-600',
    title: 'Corporate Transparency Act in Limbo: What Latest Court Rulings Mean for Your Business',
    description: 'Recent federal court decisions have cast uncertainty on the Corporate Transparency Act implementation. This analysis breaks down the legal challenges to the Act, current compliance requirements, and practical next steps for business owners facing this regulatory uncertainty.',
    url: 'https://terms.law/2025/02/20/corporate-transparency-act-in-limbo-what-latest-court-rulings-mean-for-your-business/',
    date: '2025-02-20',
    gradient: 'from-slate-600 to-gray-600',
    bgGradient: 'from-slate-50 to-gray-50'
  },
  {
    id: 'commercial-tenants',
    category: 'Real Estate Law',
    categoryColor: 'from-amber-500 to-orange-600',
    title: 'Defending Commercial Tenants: Litigation Strategies That Win in California Courts',
    description: 'Commercial tenants in California face unique challenges when disputes arise with landlords. This practical guide examines proven litigation strategies, recent case law developments, and procedural considerations that lead to favorable outcomes in commercial lease disputes.',
    url: 'https://terms.law/2025/02/06/defending-commercial-tenants-litigation-strategies-that-win-in-california-courts/',
    date: '2025-02-06',
    gradient: 'from-amber-600 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50'
  },
  {
    id: 'russian-business',
    category: 'Международный Бизнес',
    categoryColor: 'from-red-500 to-pink-600',
    title: 'Ведение бизнеса в США для российских предпринимателей: юридические и налоговые аспекты',
    description: 'Подробное руководство для российских предпринимателей по созданию и управлению бизнесом в Соединенных Штатах, включая вопросы регистрации компаний, банковских проблем, налогового соответствия и нормативных требований в текущей геополитической обстановке.',
    url: 'https://terms.law/2025/01/20/usa-business-for-russians/',
    date: '2025-01-20',
    gradient: 'from-red-600 to-pink-600',
    bgGradient: 'from-red-50 to-pink-50'
  },
  {
    id: 'warranties',
    category: 'Contract Law',
    categoryColor: 'from-rose-500 to-pink-600',
    title: 'The Legal Limits of Disclaiming Warranties',
    description: 'Many businesses rely on warranty disclaimers to limit liability, but these clauses have significant legal boundaries. This analysis examines when and how warranty disclaimers can be effectively used, state-specific limitations, and recent case law affecting their enforceability.',
    url: 'https://terms.law/2025/01/15/the-legal-limits-of-disclaiming-warranties/',
    date: '2025-01-15',
    gradient: 'from-rose-600 to-pink-600',
    bgGradient: 'from-rose-50 to-pink-50'
  },
  {
    id: 'claude-outputs',
    category: 'AI Law',
    categoryColor: 'from-purple-500 to-violet-600',
    title: 'Who Owns Claude\'s Outputs and How Can They Be Used?',
    description: 'This analysis examines legal aspects of ownership and usage rights for AI-generated content, highlighting user responsibilities, copyright considerations, and practical strategies for retaining ownership.',
    url: 'https://terms.law/2024/08/24/who-owns-claudes-outputs-and-how-can-they-be-used/',
    date: '2024-08-24',
    gradient: 'from-purple-600 to-violet-600',
    bgGradient: 'from-purple-50 to-violet-50'
  },
  {
    id: 'stock-transfer',
    category: 'Document Generator',
    categoryColor: 'from-emerald-500 to-teal-600',
    title: 'Stock Transfer Agreements 101: A Guide & Generator for Business Owners and Investors',
    description: 'This generator facilitates creating tailored share transfer agreements between buyers and sellers, outlining essential terms and ensuring legal clarity during share transactions.',
    url: 'https://terms.law/2024/04/11/stock-transfer-agreements-101-a-guide-template-for-business-owners-and-investors/',
    date: '2024-04-11',
    gradient: 'from-emerald-600 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50'
  },
  {
    id: 'token-issuance',
    category: 'Document Generator',
    categoryColor: 'from-purple-500 to-violet-600',
    title: 'Draft Your Token Issuance Agreement: Legal Guide and Interactive Generator Tool',
    description: 'Create custom agreements for token offerings that ensure regulatory compliance and clarity between issuers and purchasers, with emphasis on legal requirements for blockchain projects.',
    url: 'https://terms.law/2023/06/16/legal-implications-of-token-issuance-by-start-ups-an-exploratory-discussion/',
    date: '2023-06-16',
    gradient: 'from-purple-600 to-violet-600',
    bgGradient: 'from-purple-50 to-violet-50'
  },
  {
    id: 'import-agency',
    category: 'Document Generator',
    categoryColor: 'from-orange-500 to-red-600',
    title: 'IMPORT AGENCY AGREEMENT (Generator)',
    description: 'Create tailored agreements defining the relationship between a Principal and an Agent for importing merchandise, with clear expectations and legal protections for international trade.',
    url: 'https://terms.law/2022/11/02/import-agency-agreement-free-template/',
    date: '2022-11-02',
    gradient: 'from-orange-600 to-red-600',
    bgGradient: 'from-orange-50 to-red-50'
  },
  {
    id: 'russian-nda',
    category: 'Документы',
    categoryColor: 'from-cyan-500 to-blue-600',
    title: 'Русско-английское СОГЛАШЕНИЕ О НЕРАЗГЛАШЕНИИ ИНФОРМАЦИИ (Russian-English NDA generator)',
    description: 'Генератор двуязычного соглашения о неразглашении (NDA) позволяет создать профессиональный документ на русском и английском языках, соблюдающий законодательство США. Он помогает российским предпринимателям защитить конфиденциальную информацию при сотрудничестве с американскими партнерами.',
    url: 'https://terms.law/2017/08/09/russian-english-dual-language-nda-generator-template/',
    date: '2017-08-09',
    gradient: 'from-cyan-600 to-blue-600',
    bgGradient: 'from-cyan-50 to-blue-50'
  }
];

// Individual post card component
const PostCard = ({ data, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  const handleCardClick = () => {
    window.open(data.url, '_blank');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-md border border-gray-100
        transition-all duration-300 ease-out cursor-pointer
        hover:shadow-lg hover:-translate-y-1
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{
        transitionDelay: `${index * 80}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="p-5">
        {/* Category badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`
            inline-block px-3 py-1 rounded-full text-xs font-medium
            bg-gradient-to-r ${data.categoryColor} text-white
          `}>
            {data.category}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(data.date)}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 leading-tight mb-3 hover:text-blue-600 transition-colors duration-200">
          {data.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">
          {data.description}
        </p>
      </div>
    </div>
  );
};

// Main posts component
const PostsClean = () => {
  const [sortBy, setSortBy] = useState('latest');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Get unique categories
  const categories = ['all', ...new Set(allPostsData.map(post => post.category))];

  // Filter and sort posts
  const filteredAndSortedPosts = React.useMemo(() => {
    let filtered = allPostsData;
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }
    
    // Sort by latest
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [categoryFilter, sortBy]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">Filter by category:</span>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`
              px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
              ${categoryFilter === category 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            {category === 'all' ? 'All Posts' : category}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedPosts.map((post, index) => (
          <PostCard
            key={post.id}
            data={post}
            index={index}
          />
        ))}
      </div>

      {/* Results count */}
      <div className="mt-8 text-center text-sm text-gray-500">
        Showing {filteredAndSortedPosts.length} of {allPostsData.length} posts
        {categoryFilter !== 'all' && ` in "${categoryFilter}"`}
      </div>
    </div>
  );
};

// Render the component
ReactDOM.render(<PostsClean />, document.getElementById('root'));