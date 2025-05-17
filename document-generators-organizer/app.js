const { useState, useEffect } = React;

// Icons component using feather icons
const Icon = ({ name, style = {} }) => {
  return <i data-feather={name} style={style}></i>;
};

// Main App Component
const App = () => {
  const [generators, setGenerators] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Fast-loading with minimum API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data from WordPress API...");
        
        // Get all posts with embedded terms in a single request (up to 100)
        const response = await fetch(
          "https://terms.law/wp-json/wp/v2/posts?per_page=100&_embed=1"
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }
        
        const posts = await response.json();
        console.log(`Fetched ${posts.length} posts from WordPress`);
        
        // Extract and process all posts with their categories
        const processedPosts = [];
        const uniqueCategories = [];
        const categoryIds = new Set();
        let docGeneratorsCategoryId = null;
        
        // First find if there's a Document Generators category
        for (const post of posts) {
          if (post._embedded && post._embedded['wp:term']) {
            const categories = post._embedded['wp:term'][0] || [];
            
            for (const cat of categories) {
              if (cat.name.toLowerCase().includes('document generator') || 
                  cat.slug.toLowerCase().includes('document-generator')) {
                docGeneratorsCategoryId = cat.id;
                break;
              }
            }
            
            if (docGeneratorsCategoryId) break;
          }
        }
        
        // Then process posts and collect categories
        for (const post of posts) {
          // Only include posts in Document Generators category if we found it
          let isDocGenerator = false;
          const postCategories = [];
          
          if (post._embedded && post._embedded['wp:term']) {
            const categories = post._embedded['wp:term'][0] || [];
            
            for (const cat of categories) {
              // Add to post categories
              postCategories.push({
                id: cat.id,
                name: cat.name,
                slug: cat.slug
              });
              
              // Check if this is a document generator post
              if (docGeneratorsCategoryId && cat.id === docGeneratorsCategoryId) {
                isDocGenerator = true;
              }
              
              // Collect unique categories
              if (!categoryIds.has(cat.id)) {
                uniqueCategories.push({
                  id: cat.id,
                  name: cat.name,
                  slug: cat.slug
                });
                categoryIds.add(cat.id);
              }
            }
          }
          
          // Include all posts if we couldn't find a document generator category
          if (!docGeneratorsCategoryId || isDocGenerator) {
            // Get the post excerpt and clean it
            let description = "";
            if (post.excerpt && post.excerpt.rendered) {
              description = post.excerpt.rendered
                .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
                .trim()
                .substring(0, 100);
              
              if (description.length === 100) {
                description += "...";
              }
            }
            
            processedPosts.push({
              id: post.id,
              title: post.title.rendered,
              description: description || "Create customized legal documents for your business.",
              link: post.link, // Use the original link from WordPress
              categories: postCategories
            });
          }
        }
        
        console.log(`Processed ${processedPosts.length} document generators`);
        console.log(`Found ${uniqueCategories.length} unique categories`);
        
        // Filter out the Document Generators category from the categories list
        const displayCategories = uniqueCategories.filter(cat => 
          !docGeneratorsCategoryId || cat.id !== docGeneratorsCategoryId
        );
        
        setGenerators(processedPosts);
        setCategories(displayCategories);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter generators based on search term and active category
  const filteredGenerators = generators.filter(generator => {
    const matchesSearch = 
      generator.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      generator.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || 
      generator.categories.some(cat => cat.slug === activeCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Group generators by category for display
  const generatorsByCategory = {};
  
  if (activeCategory === "all") {
    // Get all categories except Document Generators
    filteredGenerators.forEach(generator => {
      generator.categories.forEach(category => {
        // Skip the Document Generators category
        if (!category.name.toLowerCase().includes('document generator')) {
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

  // If there are no filtered generators but we have categories,
  // it might be due to search/category filter
  const noGeneratorsFoundMessage = 
    generators.length > 0 && Object.keys(generatorsByCategory).length === 0
      ? "No generators found matching your criteria."
      : "Loading generators...";

  if (loading) {
    return <div className="loading">Loading document generators...</div>;
  }

  if (error) {
    return <div className="error">Error loading document generators: {error}</div>;
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
                        .filter(cat => !cat.name.toLowerCase().includes('document generator'))
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
          <div className="loading">{noGeneratorsFoundMessage}</div>
        )}
      </div>
    </div>
  );
};

// Render the React app
ReactDOM.render(<App />, document.getElementById('root'));

// Initialize Feather icons after render
feather.replace();