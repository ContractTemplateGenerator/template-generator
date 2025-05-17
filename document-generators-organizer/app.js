const { useState, useEffect } = React;

// Icons component using feather icons
const Icon = ({ name, style = {} }) => {
  return <i data-feather={name} style={style}></i>;
};

// List of ACTUAL generators on your site
const GENERATORS = [
  {
    id: 1,
    title: "Strategic NDA Generator",
    description: "Generate a customized non-disclosure agreement to protect your confidential information.",
    link: "https://terms.law/strategic-nda-generator/",
    categories: ["Contracts", "Dispute Resolution"]
  },
  {
    id: 2,
    title: "LLC Operating Agreement Generator",
    description: "Create a comprehensive operating agreement for your Limited Liability Company.",
    link: "https://terms.law/llc-operating-agreement-generator/",
    categories: ["Business Formation", "Contracts"]
  },
  {
    id: 3,
    title: "Privacy Policy Generator",
    description: "Generate a legally compliant privacy policy for your website or application.",
    link: "https://terms.law/privacy-policy-generator/",
    categories: ["Tech & IP Law", "Compliance"]
  },
  {
    id: 4,
    title: "Terms of Service Generator",
    description: "Create customized terms of service for your website or online platform.",
    link: "https://terms.law/terms-of-service-generator/",
    categories: ["Tech & IP Law", "Compliance"]
  },
  {
    id: 5,
    title: "Consulting Agreement Generator",
    description: "Generate a professional consulting agreement tailored to your business needs.",
    link: "https://terms.law/consulting-agreement-generator/",
    categories: ["Contracts", "Business Formation"]
  },
  {
    id: 6,
    title: "Cease and Desist Generator",
    description: "Create a cease and desist letter to address IP infringement or other violations.",
    link: "https://terms.law/cease-and-desist-generator/",
    categories: ["Dispute Resolution", "Tech & IP Law"]
  },
  {
    id: 7,
    title: "Employment Contract Generator",
    description: "Generate a customized employment agreement for your business.",
    link: "https://terms.law/employment-contract-generator/",
    categories: ["Contracts", "Business Formation"]
  },
  {
    id: 8, 
    title: "Trademark Assignment Generator",
    description: "Create a trademark assignment agreement to transfer trademark rights.",
    link: "https://terms.law/trademark-assignment-generator/",
    categories: ["Tech & IP Law", "Contracts"]
  },
  {
    id: 9,
    title: "Independent Contractor Agreement Generator",
    description: "Generate a legally sound independent contractor agreement.",
    link: "https://terms.law/independent-contractor-agreement-generator/",
    categories: ["Contracts", "Business Formation"]
  },
  {
    id: 10,
    title: "Partnership Agreement Generator",
    description: "Create a comprehensive partnership agreement for your business venture.",
    link: "https://terms.law/partnership-agreement-generator/",
    categories: ["Business Formation", "Contracts"]
  },
  {
    id: 11,
    title: "Demand Letter Generator",
    description: "Generate a professional demand letter to resolve disputes effectively.",
    link: "https://terms.law/demand-letter-generator/",
    categories: ["Dispute Resolution"]
  },
  {
    id: 12,
    title: "GDPR Compliance Generator",
    description: "Create GDPR-compliant documents for your business or website.",
    link: "https://terms.law/gdpr-compliance-generator/",
    categories: ["Compliance", "Tech & IP Law"]
  },
  {
    id: 13,
    title: "Promissory Note Generator",
    description: "Generate a legally binding promissory note for loans and financing.",
    link: "https://terms.law/promissory-note-generator/",
    categories: ["Finance", "Contracts"]
  },
  {
    id: 14,
    title: "Subscription Agreement Generator",
    description: "Create a subscription agreement for your service or product.",
    link: "https://terms.law/subscription-agreement-generator/",
    categories: ["Contracts", "Finance"]
  },
  {
    id: 15,
    title: "Revenue-Based Financing Agreement Generator",
    description: "Generate a customized revenue-based financing agreement for your business.",
    link: "https://terms.law/revenue-based-financing-generator/",
    categories: ["Finance", "Contracts"]
  }
];

// All unique categories from the generators
const ALL_CATEGORIES = Array.from(
  new Set(GENERATORS.flatMap(generator => generator.categories))
).sort();

// Main App Component
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  
  // Filter generators based on search term and active category
  const filteredGenerators = GENERATORS.filter(generator => {
    const matchesSearch = 
      generator.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      generator.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      activeCategory === "All Categories" || 
      generator.categories.includes(activeCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Group generators by category for display
  const generatorsByCategory = {};
  
  if (activeCategory === "All Categories") {
    // Group by all categories
    ALL_CATEGORIES.forEach(category => {
      const categoryGenerators = filteredGenerators.filter(
        generator => generator.categories.includes(category)
      );
      
      if (categoryGenerators.length > 0) {
        generatorsByCategory[category] = categoryGenerators;
      }
    });
  } else {
    // Just one category
    generatorsByCategory[activeCategory] = filteredGenerators;
  }

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="organizer">
      <div className="header">
        <h1>Document Generators</h1>
        <p>Customizable legal document generators for your business needs</p>
      </div>
      
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search generators..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      <div className="category-filter">
        <button 
          className={activeCategory === "All Categories" ? "active" : ""}
          onClick={() => handleCategoryFilter("All Categories")}
        >
          All Categories
        </button>
        {ALL_CATEGORIES.map(category => (
          <button
            key={category}
            className={activeCategory === category ? "active" : ""}
            onClick={() => handleCategoryFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="generators-list">
        {Object.keys(generatorsByCategory).length > 0 ? (
          Object.entries(generatorsByCategory).map(([category, categoryGenerators]) => (
            <div key={category} className="category-section">
              <h3 className="category-title">{category}</h3>
              {categoryGenerators.map(generator => (
                <a 
                  href={generator.link} 
                  className="generator-card" 
                  key={generator.id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="generator-icon">
                    <Icon name="file-text" />
                  </div>
                  <div className="generator-info">
                    <h3 className="generator-title">{generator.title}</h3>
                    <p className="generator-description">{generator.description}</p>
                    <div>
                      {generator.categories.map(cat => (
                        <span key={cat} className="tag">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ))
        ) : (
          <div className="loading">No generators found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

// Render the React app
ReactDOM.render(<App />, document.getElementById('root'));

// Initialize Feather icons after render
feather.replace();