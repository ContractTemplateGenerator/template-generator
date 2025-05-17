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

  // Fetch blog posts from WordPress REST API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch posts from Document Generators category
        const response = await fetch(
          "https://terms.law/wp-json/wp/v2/posts?categories=285&per_page=100"
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        
        const posts = await response.json();
        
        // Fetch categories for organization
        const catResponse = await fetch(
          "https://terms.law/wp-json/wp/v2/categories"
        );
        
        if (!catResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        
        const categories = await catResponse.json();
        
        // Process and organize posts by categories
        const processedPosts = await Promise.all(
          posts.map(async (post) => {
            // Fetch categories for this post
            const postCatResponse = await fetch(
              `https://terms.law/wp-json/wp/v2/posts/${post.id}?_embed`
            );
            const postData = await postCatResponse.json();
            
            // Extract categories 
            const postCategories = postData._embedded && 
              postData._embedded["wp:term"] && 
              postData._embedded["wp:term"][0] ? 
              postData._embedded["wp:term"][0] : [];
            
            return {
              id: post.id,
              title: post.title.rendered,
              description: post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + "...",
              link: post.link,
              categories: postCategories.map(cat => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug
              }))
            };
          })
        );
        
        setGenerators(processedPosts);
        
        // Extract unique categories (excluding Document Generators)
        const uniqueCategories = categories
          .filter(cat => cat.id !== 285) // Exclude Document Generators category
          .map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug
          }));
        
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        setError(err.message);
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
        if (category.id !== 285) { // Skip Document Generators category
          if (!generatorsByCategory[category.name]) {
            generatorsByCategory[category.name] = [];
          }
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
                        .filter(cat => cat.id !== 285) // Exclude Document Generators
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
