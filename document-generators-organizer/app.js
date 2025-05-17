const { useState, useEffect } = React;

// Icons component using feather icons
const Icon = ({ name, style = {} }) => {
  return <i data-feather={name} style={style}></i>;
};

// Fallback data in case API fails
const FALLBACK_DATA = [
  {
    id: 1,
    title: "Strategic NDA Generator",
    description: "Create customized non-disclosure agreements tailored to your specific business needs.",
    link: "https://terms.law/strategic-nda-generator/",
    categories: [
      { id: 3, name: "Contracts", slug: "contracts" },
      { id: 6, name: "Compliance", slug: "compliance" }
    ]
  },
  {
    id: 2,
    title: "LLC Operating Agreement Generator",
    description: "Generate comprehensive operating agreements for your Limited Liability Company.",
    link: "https://terms.law/llc-operating-agreement-generator/",
    categories: [
      { id: 1, name: "Business Formation", slug: "business-formation" },
      { id: 3, name: "Contracts", slug: "contracts" }
    ]
  },
  {
    id: 3,
    title: "Privacy Policy Generator",
    description: "Create a legally compliant privacy policy for your website or application.",
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
  { id: 6, name: "Compliance", slug: "compliance" },
  { id: 7, name: "Russian", slug: "russian" }
];

// Main App Component
const App = () => {
  const [generators, setGenerators] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Document Generators category ID - this may need to be updated
  const DOC_GENERATORS_CATEGORY_ID = 285;

  // Fetch blog posts from WordPress REST API - optimized version
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching posts...");
        
        // First, let's get all categories
        const catResponse = await fetch("https://terms.law/wp-json/wp/v2/categories?per_page=100");
        
        if (!catResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        
        const allCategories = await catResponse.json();
        console.log(`Fetched ${allCategories.length} categories`);
        
        // Find Document Generators category ID
        const docGenCategory = allCategories.find(cat => 
          cat.slug === "document-generators" || 
          cat.name.toLowerCase().includes("document generator")
        );
        
        const docGeneratorsCategoryId = docGenCategory ? docGenCategory.id : DOC_GENERATORS_CATEGORY_ID;
        console.log(`Using Document Generators category ID: ${docGeneratorsCategoryId}`);
        
        // Single API call with _embed to get all related data at once
        const response = await fetch(
          `https://terms.law/wp-json/wp/v2/posts?categories=${docGeneratorsCategoryId}&per_page=100&_embed`
        );
        
        if (!response.ok) {
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
          
          // Make sure link is correctly formatted
          let postLink = post.link;
          
          // Check for relative URLs and convert to absolute
          if (postLink && !postLink.startsWith('http')) {
            postLink = `https://terms.law${postLink.startsWith('/') ? '' : '/'}${postLink}`;
          }
          
          // Check if the link format looks like a generator URL
          const isGenerator = postLink && (
            postLink.includes('-generator') || 
            postLink.includes('generator-') ||
            post.title.rendered.toLowerCase().includes('generator')
          );
          
          return {
            id: post.id,
            title: post.title.rendered,
            description: post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + "...",
            link: postLink,
            isGenerator: isGenerator,
            categories: postCategories.map(cat => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug
            }))
          };
        });
        
        // Filter out only posts that look like generators
        const generatorPosts = processedPosts.filter(post => post.isGenerator);
        
        if (generatorPosts.length === 0) {
          console.warn("No generator posts found, falling back to all posts");
          setGenerators(processedPosts);
        } else {
          setGenerators(generatorPosts);
        }
        
        // Extract unique categories including Russian
        const uniqueCategories = [];
        const categoryIds = new Set();
        
        processedPosts.forEach(post => {
          post.categories.forEach(cat => {
            if (cat.id !== docGeneratorsCategoryId && !categoryIds.has(cat.id)) {
              uniqueCategories.push(cat);
              categoryIds.add(cat.id);
            }
          });
        });
        
        // Ensure Russian category is included
        const russianCat = allCategories.find(cat => 
          cat.name === "Russian" || 
          cat.slug === "russian" ||
          cat.name.toLowerCase().includes("russian")
        );
        
        if (russianCat && !categoryIds.has(russianCat.id)) {
          uniqueCategories.push({
            id: russianCat.id,
            name: russianCat.name,
            slug: russianCat.slug
          });
        }
        
        setCategories(uniqueCategories.length > 0 ? uniqueCategories : FALLBACK_CATEGORIES);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Use fallback data if API fails
        setGenerators(FALLBACK_DATA);
        setCategories(FALLBACK_CATEGORIES);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter generators based on search term and active category
  const filteredGenerators = generators.filter(generator => {
    const matchesSearch = generator.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         generator.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || 
                           generator.categories.some(cat => cat.slug === activeCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Group generators by category for display
  const generatorsByCategory = {};
  
  if (activeCategory === "all") {
    // Group by all categories (except Document Generators)
    filteredGenerators.forEach(generator => {
      generator.categories.forEach(category => {
        if (category.id !== DOC_GENERATORS_CATEGORY_ID) { 
          if (!generatorsByCategory[category.name]) {
            generatorsByCategory[category.name] = [];
          }
          // Avoid duplicates in the same category
          if (!generatorsByCategory[category.name].some(g => g.id === generator.id)) {
            generatorsByCategory[category.name].push(generator);
          }
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

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

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
                        .filter(cat => cat.id !== DOC_GENERATORS_CATEGORY_ID)
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
feather.replace();