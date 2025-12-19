#!/usr/bin/env node
/**
 * Generate category landing pages from blog posts data
 */

const fs = require('fs');
const path = require('path');

// Read posts data
const postsFile = path.join(__dirname, '../Blog/posts-data.js');
const content = fs.readFileSync(postsFile, 'utf8');
const match = content.match(/const BLOG_POSTS = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not parse posts data');
  process.exit(1);
}

const posts = eval(match[1]);

// Create slug from category name
function slugify(str) {
  return str.toLowerCase()
    .replace(/[&]/g, 'and')
    .replace(/[,]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Group posts by category
const categories = {};
posts.forEach(post => {
  if (post.categories && post.categories.length && post.title) {
    post.categories.forEach(cat => {
      if (!categories[cat]) {
        categories[cat] = {
          name: cat,
          slug: slugify(cat),
          posts: []
        };
      }
      // Fix URLs - convert old WordPress URLs to new format
      let url = post.url;
      if (url.includes('terms.law/202')) {
        // Extract slug and create new undated URL
        const slugMatch = url.match(/\/(\d{4}\/\d{2}\/\d{2}\/)?([^/]+)\/?$/);
        if (slugMatch) {
          // Keep old dated URL as is for now - they still work
        }
      }
      categories[cat].posts.push({
        title: post.title,
        url: url,
        date: post.date,
        description: post.description || ''
      });
    });
  }
});

// Sort posts by date (newest first)
Object.values(categories).forEach(cat => {
  cat.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Category descriptions
const categoryDescriptions = {
  'AI': 'Artificial intelligence legal guides, AI contract templates, and demand letters for AI-related disputes.',
  'General': 'General legal guides, business law tips, and startup advice from a California attorney.',
  'Free Templates': 'Free legal document templates and contract generators for startups and small businesses.',
  'Document Generators': 'Interactive legal document generators - create contracts, agreements, and legal forms.',
  'Incorporation': 'Business formation guides for LLCs, corporations, and nonprofits across all 50 states.',
  'Demand Letters': 'Sample demand letters and legal templates for disputes, collections, and negotiations.',
  'M&A': 'Mergers and acquisitions guides, due diligence checklists, and transaction documents.',
  'ToU & Privacy': 'Terms of service, privacy policies, and compliance guides for websites and apps.',
  'Stocks, Crypto & NFTs': 'Securities law, cryptocurrency regulations, and NFT legal considerations.',
  'Dispute Resolution': 'Legal strategies for resolving business disputes, contracts, and commercial conflicts.',
  'News': 'Legal news, regulatory updates, and analysis of recent court decisions.',
  'Contractors & Employees': 'Employment law guides, contractor agreements, and workplace legal issues.',
  'Software': 'Software licensing, SaaS agreements, and technology contract templates.',
  'Russian': 'Юридические руководства и шаблоны документов на русском языке.',
  'Online Sales': 'E-commerce law, marketplace policies, and online business compliance.',
  'Tax Law': 'Tax planning guides, business tax strategies, and compliance requirements.',
  'Real Estate': 'Real estate contracts, property law guides, and transaction documents.',
  'NDA': 'Non-disclosure agreements, confidentiality templates, and trade secret protection.',
  'Landlord-Tenant': 'Rental agreements, lease templates, and landlord-tenant dispute resources.',
  'Auto Demands': 'Demand letters for auto disputes, lemon law claims, and vehicle defects.',
  'Remote Work': 'Remote work policies, distributed team agreements, and work-from-home legal guides.',
  'Immigration': 'Immigration law guides, visa information, and employment-based immigration.',
  'Employment Demand Letters': 'Demand letters for workplace disputes, wage claims, and employment issues.',
  'Consumer': 'Consumer rights guides, refund demands, and consumer protection law.',
  'Debt': 'Debt collection guides, creditor negotiations, and financial dispute templates.',
  'Legal Literature': 'Legal theory, case studies, and in-depth legal analysis.',
  'Medical': 'Medical practice agreements, healthcare compliance, and HIPAA guides.',
  'Business Demand Letters': 'Commercial demand letters for business disputes and B2B conflicts.',
  'Trademarks': 'Trademark registration guides, brand protection, and IP enforcement.',
  'Animals': 'Pet law guides, animal-related disputes, and veterinary malpractice.',
  'Home': 'Home services disputes, contractor issues, and residential legal guides.',
  'Insurance': 'Insurance dispute guides, claim strategies, and coverage analysis.',
  'Spanish': 'Guías legales y plantillas de documentos en español.',
  'Tools': 'Interactive legal calculators and tools.',
  'Consumer Rights': 'Consumer protection guides and dispute resolution resources.'
};

// Category colors
const categoryColors = {
  'AI': '#8b5cf6',
  'General': '#3b82f6',
  'Free Templates': '#10b981',
  'Document Generators': '#06b6d4',
  'Incorporation': '#6366f1',
  'Demand Letters': '#ef4444',
  'M&A': '#f59e0b',
  'ToU & Privacy': '#ec4899',
  'Stocks, Crypto & NFTs': '#f97316',
  'Dispute Resolution': '#dc2626',
  'News': '#0ea5e9',
  'Contractors & Employees': '#14b8a6',
  'Software': '#6366f1',
  'Russian': '#3b82f6',
  'Online Sales': '#f59e0b',
  'Tax Law': '#22c55e',
  'Real Estate': '#84cc16',
  'NDA': '#a855f7',
  'Landlord-Tenant': '#eab308',
  'Auto Demands': '#64748b',
  'Remote Work': '#06b6d4',
  'Immigration': '#0891b2',
  'Employment Demand Letters': '#dc2626',
  'Consumer': '#10b981',
  'Debt': '#78716c',
  'Legal Literature': '#7c3aed',
  'Medical': '#ef4444',
  'Business Demand Letters': '#f97316',
  'Trademarks': '#a855f7',
  'Animals': '#84cc16',
  'Home': '#eab308',
  'Insurance': '#64748b',
  'Spanish': '#ef4444',
  'Tools': '#06b6d4',
  'Consumer Rights': '#10b981'
};

// Generate HTML for category page
function generateCategoryPage(cat) {
  const color = categoryColors[cat.name] || '#3b82f6';
  const description = categoryDescriptions[cat.name] || `Legal guides and resources related to ${cat.name}.`;

  // Split posts for display
  const featuredPosts = cat.posts.slice(0, 6);
  const remainingPosts = cat.posts.slice(6);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cat.name} | Legal Guides & Templates | Terms.Law</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://terms.law/category/${cat.slug}/">

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-901N2Y3CDZ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-901N2Y3CDZ');
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --color-primary: ${color};
      --color-bg: #f8fafc;
      --color-surface: #ffffff;
      --color-border: #e2e8f0;
      --color-text: #0f172a;
      --color-text-secondary: #475569;
      --color-text-muted: #64748b;
      --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-sans); background: var(--color-bg); color: var(--color-text); line-height: 1.6; }
    a { color: var(--color-primary); text-decoration: none; }
    a:hover { text-decoration: underline; }

    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, ${color}40 100%);
      padding: 50px 24px;
      color: white;
    }
    .header-inner { max-width: 1100px; margin: 0 auto; }
    .breadcrumb { font-size: 0.875rem; opacity: 0.8; margin-bottom: 16px; }
    .breadcrumb a { color: white; opacity: 0.8; }
    .breadcrumb a:hover { opacity: 1; text-decoration: none; }
    .header h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 12px; }
    .header p { font-size: 1.1rem; opacity: 0.9; max-width: 700px; }
    .post-count {
      display: inline-block;
      background: ${color};
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-top: 16px;
    }

    .container { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }

    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 20px;
      color: var(--color-text);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title::before {
      content: '';
      width: 4px;
      height: 24px;
      background: ${color};
      border-radius: 2px;
    }

    .featured-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 20px;
      margin-bottom: 48px;
    }

    .post-card {
      background: var(--color-surface);
      border-radius: 12px;
      padding: 24px;
      border: 1px solid var(--color-border);
      transition: all 200ms ease;
      display: block;
      color: var(--color-text);
    }
    .post-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.08);
      border-color: ${color};
      text-decoration: none;
    }
    .post-card h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 8px;
      line-height: 1.4;
      color: var(--color-text);
    }
    .post-card .date {
      font-size: 0.8rem;
      color: var(--color-text-muted);
      margin-bottom: 8px;
    }
    .post-card .excerpt {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .posts-list { margin-bottom: 48px; }
    .posts-list-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 16px 0;
      border-bottom: 1px solid var(--color-border);
      gap: 16px;
    }
    .posts-list-item:hover { background: #f1f5f9; margin: 0 -16px; padding: 16px; border-radius: 8px; border-bottom-color: transparent; }
    .posts-list-item a {
      font-weight: 500;
      color: var(--color-text);
      flex: 1;
    }
    .posts-list-item a:hover { color: ${color}; text-decoration: none; }
    .posts-list-item .date {
      font-size: 0.8rem;
      color: var(--color-text-muted);
      white-space: nowrap;
    }

    .related-categories { margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--color-border); }
    .cat-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
    .cat-tag {
      display: inline-block;
      padding: 8px 16px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      transition: all 150ms ease;
    }
    .cat-tag:hover {
      border-color: ${color};
      color: ${color};
      text-decoration: none;
      background: ${color}10;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 32px;
      font-weight: 500;
      color: var(--color-text-secondary);
    }
    .back-link:hover { color: ${color}; }

    @media (max-width: 640px) {
      .header h1 { font-size: 1.75rem; }
      .featured-grid { grid-template-columns: 1fr; }
      .posts-list-item { flex-direction: column; gap: 4px; }
    }
  </style>
</head>
<body>

<header class="header">
  <div class="header-inner">
    <nav class="breadcrumb">
      <a href="/">Home</a> / <a href="/Blog/">Blog</a> / ${cat.name}
    </nav>
    <h1>${cat.name}</h1>
    <p>${description}</p>
    <span class="post-count">${cat.posts.length} articles</span>
  </div>
</header>

<main class="container">
  ${featuredPosts.length > 0 ? `
  <h2 class="section-title">Featured Articles</h2>
  <div class="featured-grid">
    ${featuredPosts.map(post => `
    <a href="${post.url}" class="post-card">
      <div class="date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
      <h3>${escapeHtml(post.title)}</h3>
      ${post.description ? `<p class="excerpt">${escapeHtml(post.description)}</p>` : ''}
    </a>`).join('')}
  </div>
  ` : ''}

  ${remainingPosts.length > 0 ? `
  <h2 class="section-title">All Articles</h2>
  <div class="posts-list">
    ${remainingPosts.map(post => `
    <div class="posts-list-item">
      <a href="${post.url}">${escapeHtml(post.title)}</a>
      <span class="date">${new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    </div>`).join('')}
  </div>
  ` : ''}

  <div class="related-categories">
    <h2 class="section-title">Browse Other Categories</h2>
    <div class="cat-tags">
      ${Object.values(categories)
        .filter(c => c.name !== cat.name && c.posts.length >= 5)
        .sort((a, b) => b.posts.length - a.posts.length)
        .slice(0, 15)
        .map(c => `<a href="/category/${c.slug}/" class="cat-tag">${c.name} (${c.posts.length})</a>`)
        .join('')}
    </div>
  </div>

  <a href="/Blog/" class="back-link">&larr; Back to Blog</a>
</main>

</body>
</html>`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Create category directories and pages
const categoryDir = path.join(__dirname, '../category');
if (!fs.existsSync(categoryDir)) {
  fs.mkdirSync(categoryDir, { recursive: true });
}

Object.values(categories).forEach(cat => {
  const catDir = path.join(categoryDir, cat.slug);
  if (!fs.existsSync(catDir)) {
    fs.mkdirSync(catDir, { recursive: true });
  }

  const html = generateCategoryPage(cat);
  fs.writeFileSync(path.join(catDir, 'index.html'), html);
  console.log(`Created: /category/${cat.slug}/ (${cat.posts.length} posts)`);
});

// Create category index page
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>All Categories | Legal Guides & Templates | Terms.Law</title>
  <meta name="description" content="Browse all legal guide categories: AI, contracts, demand letters, incorporation, and more. Free legal resources from a California attorney.">
  <link rel="canonical" href="https://terms.law/category/">

  <script async src="https://www.googletagmanager.com/gtag/js?id=G-901N2Y3CDZ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-901N2Y3CDZ');
  </script>

  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --color-primary: #3b82f6;
      --color-bg: #f8fafc;
      --color-surface: #ffffff;
      --color-border: #e2e8f0;
      --color-text: #0f172a;
      --color-text-secondary: #475569;
      --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-sans); background: var(--color-bg); color: var(--color-text); line-height: 1.6; }
    a { color: var(--color-primary); text-decoration: none; }

    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 50px 24px;
      text-align: center;
      color: white;
    }
    .header h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 12px; }
    .header p { font-size: 1.1rem; opacity: 0.9; }

    .container { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .cat-card {
      background: var(--color-surface);
      border-radius: 12px;
      padding: 24px;
      border: 1px solid var(--color-border);
      transition: all 200ms ease;
      display: block;
      color: var(--color-text);
    }
    .cat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
    .cat-card h2 { font-size: 1.1rem; font-weight: 600; margin-bottom: 4px; }
    .cat-card .count { font-size: 0.875rem; color: var(--color-text-secondary); }

    .back-link { display: inline-block; margin-top: 32px; font-weight: 500; }
  </style>
</head>
<body>

<header class="header">
  <h1>All Categories</h1>
  <p>Browse ${Object.keys(categories).length} categories with ${posts.filter(p => p.title).length}+ legal guides</p>
</header>

<main class="container">
  <div class="categories-grid">
    ${Object.values(categories)
      .sort((a, b) => b.posts.length - a.posts.length)
      .map(cat => `
    <a href="/category/${cat.slug}/" class="cat-card">
      <h2>${cat.name}</h2>
      <span class="count">${cat.posts.length} articles</span>
    </a>`).join('')}
  </div>

  <a href="/Blog/" class="back-link">&larr; Back to Blog</a>
</main>

</body>
</html>`;

fs.writeFileSync(path.join(categoryDir, 'index.html'), indexHtml);
console.log(`\nCreated: /category/ index page`);
console.log(`\nTotal: ${Object.keys(categories).length} category pages created`);
