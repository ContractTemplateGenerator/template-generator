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

## Voice & Branding - CRITICAL

**This is Sergei Tokmakov's personal attorney service, NOT an anonymous corporate "we" service.**

- **NEVER use "we", "our", "us"** - always use "I", "my", "mine"
- Introduce as: "I'm Sergei Tokmakov, a California attorney"
- This personal touch is a KEY selling point - clients work directly with an attorney, not an anonymous firm
- Replace any plural corporate language with personal attorney language

Examples:
- ❌ "Our templates address..." → ✅ "My templates address..." or "These templates address..."
- ❌ "We cover the following..." → ✅ "I cover the following..."
- ❌ "Contact our team..." → ✅ "Contact me..."
- ❌ "Our services include..." → ✅ "My services include..."

## Standard Fee Structure

When displaying attorney fees on site pages, use these rates:

- **Hourly rate:** $240/hr
- **Demand letters:** $450 flat fee (base starting point)
- **Contingency:** 33-40% of recovery
- **Case evaluation:** Paid consultation

Do NOT use ranges like "$300-$500/hr" or "$800-$1,500" for demand letters.
The hourly rate is a flat $240/hr. Demand letters start at $450.

## Other Guidelines:
- Copyright year: 2025
- Contact: owner@terms.law (mailto link)
- Calendly: inline embed with `hide_gdpr_banner=1`, NOT popup
- No "free consultation" language
- No phone numbers
