# Claude AI Ownership Chatbox

A specialized legal assistant chatbox for explaining AI-generated content ownership, specifically focused on Claude AI and similar language models.

## Features

- **Specialized Knowledge**: Focused exclusively on AI output ownership laws
- **No NDA Content**: Completely separate from the Strategic NDA assistant
- **Quick Actions**: Pre-set questions about common ownership concerns
- **Conversational**: Maintains context throughout the discussion
- **Professional Design**: Purple theme to differentiate from other chatboxes

## Quick Start for WordPress

### Option 1: Simple Button (Recommended)

Add this to a Custom HTML block in your WordPress post:

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

### Option 2: Inline Iframe

For an embedded chatbox that stays on the page:

```html
<iframe 
  src="https://template.terms.law/claude-ownership-chatbox/" 
  style="position: fixed; bottom: 20px; right: 20px; width: 400px; height: 560px; 
         border: none; z-index: 9999; border-radius: 12px; 
         box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);"
  title="AI Output Ownership Legal Assistant">
</iframe>
```

## API Endpoint

The chatbox uses a dedicated API endpoint: `/api/claude-ownership-groq-chat`

This endpoint is completely separate from the NDA chatbox and has its own:
- System prompt focused on AI ownership
- No knowledge of NDAs or contracts
- Specialized quick actions for ownership questions

## Customization

### Quick Actions
The chatbox includes these pre-set questions:
1. "Do I own what Claude creates for me?"
2. "Can I use Claude's output commercially?"
3. "Do I need to give attribution?"
4. "What about copyright infringement?"
5. "Can I claim copyright on AI output?"

### Styling
- Purple theme (#5E3AE2) to differentiate from other chatboxes
- Fixed position in bottom-right corner
- Responsive design for mobile

## Topics Covered

The assistant can discuss:
- Ownership rights of AI-generated content
- Claude's Terms of Service regarding outputs
- Copyright implications and protections
- Fair use and transformative use
- Commercial usage rights
- Attribution requirements
- Service provider vs. ownership models
- Legal uncertainties in AI law

## Important Notes

- This is NOT legal advice - always includes disclaimers
- Focuses on general principles, not specific cases
- Emphasizes consulting an attorney for specific situations
- Acknowledges rapidly evolving nature of AI law

## Files Structure

```
claude-ownership-chatbox/
├── index.html              # Main chatbox component
├── chatbox-styles.css      # Styling
├── wordpress-embed.html    # WordPress embed code
└── README.md              # This file
```

## Deployment

1. Upload the folder to your server at: `/claude-ownership-chatbox/`
2. Ensure the API endpoint is deployed
3. Add the embed code to your WordPress post
4. Test the chatbox functionality

## Testing

Click the purple chat button and try these questions:
- "Do I own what Claude creates?"
- "Can I sell AI-generated content?"
- "What if the AI copies someone's work?"
- "Do I need to disclose AI was used?"

The assistant should provide detailed, legally-informed responses without any knowledge of NDAs or contract terms.