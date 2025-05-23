# Chatbox Implementation Summary

## You now have TWO separate chatboxes:

### 1. Strategic NDA Chatbox (Original)
- **API**: `/api/nda-groq-chat.js`
- **Purpose**: Helps with NDA creation and understanding
- **Knowledge**: NDA sections, terms, legal provisions
- **Theme**: Default blue/gray
- **Location**: `/Strategic-NDA-Generator/`

### 2. Claude AI Ownership Chatbox (New)
- **API**: `/api/claude-ownership-groq-chat.js`
- **Purpose**: Explains AI output ownership laws
- **Knowledge**: Copyright, ownership, commercial use of AI content
- **Theme**: Purple (#5E3AE2)
- **Location**: `/claude-ownership-chatbox/`

## Key Differences:

1. **Completely Separate APIs**: Each chatbox has its own endpoint with different system prompts
2. **No Knowledge Overlap**: The AI ownership chatbox knows nothing about NDAs
3. **Different Quick Actions**: Each has questions specific to its domain
4. **Visual Distinction**: Purple theme for AI ownership vs standard theme for NDA

## To Add to Your Blog Post:

Just add this HTML to a Custom HTML block in WordPress:

```html
<button onclick="window.open('https://template.terms.law/claude-ownership-chatbox/', 'AIOwnershipChat', 'width=440,height=600')" 
        style="position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; 
               border-radius: 50%; background: #5E3AE2; color: white; border: none; 
               cursor: pointer; box-shadow: 0 4px 12px rgba(94, 58, 226, 0.3); z-index: 9999;">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
</button>
```

## Next Steps:

1. Deploy the `/claude-ownership-chatbox/` folder to your server
2. Deploy the new API endpoint
3. Add the button code to your WordPress post
4. Test to ensure it's working

The chatbox will appear as a purple button in the bottom right corner of your blog post!