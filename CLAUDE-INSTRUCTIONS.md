# Claude Code Instructions for Terms.Law Pages

## CRITICAL: Header and Navigation Links

**NEVER make up links. NEVER improvise navigation.**

When creating new pages, ALWAYS use the EXACT same header as existing landing pages:

```html
<header class="site-header">
  <div class="container">
    <div class="header-content">
      <nav class="header-nav">
        <a href="../index.html" class="nav-link home-logo" title="Home">
          <span class="logo-text">Terms.Law</span>
        </a>
        <a href="../Demand-Letters/demand-letters-landing.html" class="nav-link">Demands</a>
        <a href="../Templates/contract-library-landing.html" class="nav-link">Contracts</a>
        <a href="../INC/formation-landing.html" class="nav-link">Incorporation</a>
        <a href="../Blog/blog-landing.html" class="nav-link">Blog</a>
        <a href="mailto:owner@terms.law" class="header-email-cta">Email</a>
      </nav>
    </div>
  </div>
</header>
```

Adjust the `../` path prefix based on the file's location in the directory structure.

Mark the appropriate nav-link as `active` based on what section the page belongs to.

## DO NOT:
- Make up links like `https://terms.law/templates`, `https://terms.law/contact`, `https://terms.law/pricing`, etc.
- Add "Resources", "Pricing", "About", or any other navigation items that don't exist
- Use absolute URLs to terms.law for internal navigation (use relative paths)
- Improvise footer links - use the same pattern as the header

## Other Guidelines:
- Copyright year: 2025
- Contact: owner@terms.law (mailto link)
- Calendly: inline embed with `hide_gdpr_banner=1`, NOT popup
- No "free consultation" language
- No phone numbers
