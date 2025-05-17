const { useState, useEffect } = React;

// Icons component using feather icons
const Icon = ({ name, style = {} }) => {
  return <i data-feather={name} style={style}></i>;
};

// Sample data to use as fallback if API isn't working
const FALLBACK_DATA = [
  {
    id: 1,
    title: "Revenue-Based Financing Agreement Generator",
    description: "Create a custom revenue-based financing agreement tailored to your business needs.",
    link: "https://terms.law/revenue-based-financing-generator/",
    categories: [
      { id: 1, name: "Business Formation", slug: "business-formation" },
      { id: 2, name: "Finance", slug: "finance" }
    ]
  },
  {
    id: 2,
    title: "LLC Operating Agreement Generator",
    description: "Generate a comprehensive LLC operating agreement customized for your business structure.",
    link: "https://terms.law/llc-operating-agreement-generator/",
    categories: [
      { id: 1, name: "Business Formation", slug: "business-formation" },
      { id: 3, name: "Contracts", slug: "contracts" }
    ]
  },
  {
    id: 3,
    title: "SaaS Terms of Service Generator",
    description: "Create legally compliant terms of service for your software as a service business.",
    link: "https://terms.law/saas-terms-generator/",
    categories: [
      { id: 4, name: "Tech & IP Law", slug: "tech-ip-law" },
      { id: 3, name: "Contracts", slug: "contracts" }
    ]
  },
  {
    id: 4,
    title: "Strategic NDA Generator",
    description: "Generate a customized non-disclosure agreement to protect your confidential information.",
    link: "https://terms.law/strategic-nda-generator/",
    categories: [
      { id: 3, name: "Contracts", slug: "contracts" },
      { id: 5, name: "Dispute Resolution", slug: "dispute-resolution" }
    ]
  },
  {
    id: 5,
    title: "Share Transfer Agreement Generator",
    description: "Create a legally sound share transfer agreement for company ownership changes.",
    link: "https://terms.law/share-transfer-agreement-generator/",
    categories: [
      { id: 1, name: "Business Formation", slug: "business-formation" },
      { id: 3, name: "Contracts", slug: "contracts" }
    ]
  },
  {
    id: 6,
    title: "Privacy Policy Generator",
    description: "Generate a comprehensive privacy policy compliant with GDPR, CCPA and other regulations.",
    link: "https://terms.law/privacy-policy-generator/",
    categories: [
      { id: 4, name: "Tech & IP Law", slug: "tech-ip-law" },
      { id: 6, name: "Compliance", slug: "compliance" }
    ]
  }
];

// Fallback categories if API fails
const FALLBACK_CATEGORIES = [
  { id: 1, name: "Business Formation", slug: "business-formation" },
  { id: 2, name: "Finance", slug: "finance" },
  { id: 3, name: "Contracts", slug: "contracts" },
  { id: 4, name: "Tech & IP Law", slug: "tech-ip-law" },
  { id: 5, name: "Dispute Resolution", slug: "dispute-resolution" },
  { id: 6, name: "Compliance", slug: "compliance" }
];

// Main App Component
const App = () => {
  const [generators, setGenerators] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  // Fetch blog posts from WordPress REST API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Starting to fetch document generators data...");
        
        // First, try to find the Document Generators category ID
        let documentGeneratorsCategoryId = null;
        let allCategories = [];
        
        try {
          console.log("Fetching categories...");
          const catResponse = await fetch(
            "https://terms.law/wp-json/wp/v2/categories?per_page=100",
            { mode: 'cors' }
          );
          
          if (!catResponse.ok) {
            console.error(`Failed to fetch categories: ${catResponse.status} ${catResponse.statusText}`);
            throw new Error("Failed to fetch categories");
          }
          
          allCategories = await catResponse.json();
          console.log(`Fetched ${allCategories.length} categories`);
          
          // Look for Document Generators category
          const docGenCategory = allCategories.find(cat => 
            cat.name.toLowerCase().includes("document generator") || 
            cat.slug.toLowerCase().includes("document-generator")
          );
          
          if (docGenCategory) {
            documentGeneratorsCategoryId = docGenCategory.id;
            console.log(`Found Document Generators category with ID: ${documentGeneratorsCategoryId}`);
          } else {
            console.warn("Could not find Document Generators category, using all posts");
          }
          
        } catch (err) {
          console.error("Error fetching categories:", err);
          // Continue with fallback approach
        }
        
        // Fetch posts from Document Generators category if we found it, otherwise fetch all posts
        const postsUrl = documentGeneratorsCategoryId 
          ? `https://terms.law/wp-json/wp/v2/posts?categories=${documentGeneratorsCategoryId}&per_page=100&_embed=1`
          : `https://terms.law/wp-json/wp/v2/posts?per_page=100&_embed=1`;
          
        console.log(`Fetching posts from: ${postsUrl}`);
        const response = await fetch(postsUrl, { mode: 'cors' });
        
        if (!response.ok) {
          console.error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
          throw new Error("Failed to fetch posts");
        }
        
        const posts = await response.json();
        console.log(`Fetched ${posts.length} posts`);
        
        // Process posts - with _embed we get categories in the same request
        const processedPosts = posts.map(post => {
          // Extract categories
          const postCategories = post._embedded && 
            post._embedded["wp:term"] && 
            post._embedded["wp:term"][0] ? 
            post._embedded["wp:term"][0] : [];
          
          // Clean description from HTML tags
          let description = "";
          if (post.excerpt && post.excerpt.rendered) {
            description = post.excerpt.rendered
              .replace(/<\/?[^>]+(>|$)/g, "")
              .substring(0, 100);
            
            if (description.length === 100) {
              description += "...";
            }
          }
          
          return {
            id: post.id,
            title: post.title.rendered || `Generator ${post.id}`,
            description: description || "Create customized legal documents for your business needs.",
            link: post.link || `https://terms.law/?p=${post.id}`,
            categories: postCategories.map(cat => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug
            }))
          };
        });
        
        if (processedPosts.length === 0) {
          console.warn("No posts found, using fallback data");
          setGenerators(FALLBACK_DATA);
          setCategories(FALLBACK_CATEGORIES);
          setUsingFallbackData(true);
        } else {
          setGenerators(processedPosts);
          
          // Extract unique categories (excluding Document Generators)
          const uniqueCategories = allCategories
            .filter(cat => documentGeneratorsCategoryId === null || cat.id !== documentGeneratorsCategoryId)
            .map(cat => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug
            }));
          
          setCategories(uniqueCategories.length > 0 ? uniqueCategories : FALLBACK_CATEGORIES);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error in data fetching:", err);
        
        // Use fallback data if API fails
        console.log("Using fallback data due to API error");
        setGenerators(FALLBACK_DATA);
        setCategories(FALLBACK_CATEGORIES);
        setUsingFallbackData(true);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter generators based on search term and active category
  const filteredGenerators = generators.filter(generator => {
    const matchesSearch = 
      (generator.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
      (generator.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      activeCategory === "all" || 
      generator.categories?.some(cat => cat.slug === activeCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Group generators by category for display
  const generatorsByCategory = {};
  
  if (activeCategory === "all") {
    // Group by all categories
    filteredGenerators.forEach(generator => {
      // If generator has no categories, put in "Other"
      if (!generator.categories || generator.categories.length === 0) {
        if (!generatorsByCategory["Other"]) {
          generatorsByCategory["Other"] = [];
        }
        generatorsByCategory["Other"].push(generator);
        return;
      }
      
      // For each category in the generator
      generator.categories.forEach(category => {
        // Skip Document Generators category (detect by name since ID might vary)
        if (category.name?.toLowerCase().includes("document generator") || 
            category.slug?.toLowerCase().includes("document-generator")) {
          return;
        }
        
        if (!generatorsByCategory[category.name]) {
          generatorsByCategory[category.name] = [];
        }
        
        // Check if this generator is already in this category (avoid duplicates)
        const isDuplicate = generatorsByCategory[category.name].some(g => g.id === generator.id);
        if (!isDuplicate) {
          generatorsByCategory[category.name].push(generator);
        }
      });
    });
  } else {
    // Just one category
    const categoryName = categories.find(cat => cat.slug === activeCategory)?.name || "Other";
    generatorsByCategory[categoryName] = filteredGenerators;
  }

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category filter
  const handleCategoryFilter = (categorySlug) => {
    setActiveCategory(categorySlug);
  };

  if (loading) {
    return <div className="loading">Loading document generators...</div>;
  }

  return (
    <div className="organizer">
      <div className="header">
        <h1>Document Generators</h1>
        <p>Customizable legal document generators for your business needs</p>
        {usingFallbackData && (
          <div className="fallback-notice">
            Note: Using demo data. Refresh to try connecting to live data.
          </div>
        )}
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
          className={activeCategory === "all" ? "active" : ""}
          onClick={() => handleCategoryFilter("all")}
        >
          All Categories
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={activeCategory === category.slug ? "active" : ""}
            onClick={() => handleCategoryFilter(category.slug)}
          >
            {category.name}
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
                      {generator.categories
                        .filter(cat => !cat.name?.toLowerCase().includes("document generator") && 
                                      !cat.slug?.toLowerCase().includes("document-generator"))
                        .map(cat => (
                          <span key={cat.id} className="tag">
                            {cat.name}
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
document.addEventListener("DOMContentLoaded", function() {
  feather.replace();
});
