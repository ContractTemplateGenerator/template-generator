# Lease Termination Notice Generator

A professional lease termination notice generator with AI-powered legal assistant chatbot.

## Features

### 📋 Notice Types
- **Landlord-to-Tenant**: Landlord terminating tenant's lease
- **Tenant-to-Landlord**: Tenant giving notice to terminate lease

### 🏠 Form Sections
1. **Notice Type Selection** - Choose direction and set date
2. **Parties & Property** - Names, addresses, property details
3. **Termination Details** - Dates, reasons, breach terms
4. **Contact & Additional Terms** - Contact info, security deposit, forwarding address

### ⚖️ Legal Features
- **Dynamic breach terms** based on notice direction:
  - **Landlord notices**: Tenant violations (non-payment, pets, noise, etc.)
  - **Tenant notices**: Landlord violations (habitability, harassment, illegal entry, etc.)
- **Proper legal formatting** with required elements
- **State-specific considerations** (CA default, expandable)
- **Conditional text** based on form completion

### 🤖 AI Legal Assistant (Groq API + Llama 70b)
- **Context-aware responses** using current form data
- **Specialized knowledge** in landlord-tenant law
- **California law focus** with specific Civil Code references
- **Real-time help** with notice periods, breach terms, legal requirements
- **Fallback responses** when API unavailable

### 💾 Export Options
- **Copy to Clipboard**
- **Download as MS Word** (.doc format)
- **Live preview** with highlighting of changed sections

## Technical Implementation

### Frontend (React)
- **React Hooks** for state management
- **Live preview** with section highlighting
- **Responsive design** with equal-sized panels
- **Tab navigation** with Previous/Next buttons
- **Real-time form validation**

### Backend API
- **Groq API integration** with Llama 3.3 70b model
- **Context-aware prompting** with form data
- **Fallback model chain** for reliability
- **CORS enabled** for frontend integration

### Files Structure
```
lease-termination-notice-generator/
├── index.html                     # Main HTML structure
├── styles.css                     # Complete responsive styling  
├── docx-generator.js              # Word document generation
├── lease-termination-generator.js # Main React component
└── api/
    └── lease-termination-chat.js  # Groq API endpoint
```

## API Integration

### Groq API Setup
1. Set `GROQ_API_KEY` environment variable
2. Deploy API endpoint to handle chat requests
3. Frontend calls `/api/lease-termination-chat`

### Model Fallback Chain
1. `llama-3.3-70b-versatile` (primary)
2. `llama3-70b-8192` (backup)
3. `llama-3.1-8b-instant` (fast)
4. `llama3-8b-8192` (reliable)
5. `gemma2-9b-it` (fallback)

## Key Improvements Made

### ✅ Fixed Issues
1. **Breach Terms**: Added separate lists for landlord vs tenant violations
2. **Forwarding Address**: Conditional text based on whether address provided
3. **AI Chatbox**: Replaced simple responses with Groq API integration
4. **Loading States**: Added spinners and disabled states for better UX

### ⚖️ Legal Accuracy
- **Direction-specific breach terms** ensure proper legal context
- **California law references** with specific Civil Code sections  
- **Professional formatting** matches legal notice standards
- **Required elements** included for enforceability

## Usage

### Basic Workflow
1. Select notice type (landlord-to-tenant or tenant-to-landlord)
2. Fill in party and property information
3. Set termination dates and select reason/breach terms
4. Add contact information and additional terms
5. Review live preview with highlighting
6. Copy to clipboard or download as Word document

### AI Assistant Help
- Ask about **notice periods**: "How long notice do I need to give?"
- Ask about **breach terms**: "What are common tenant violations?"
- Ask about **legal requirements**: "What makes a notice valid?"
- Ask about **next steps**: "What happens if tenant doesn't move out?"

## Deployment

### Iframe Embedding
```html
<iframe 
  src="https://template.terms.law/lease-termination-notice-generator/" 
  title="Lease Termination Notice Generator" 
  width="100%" 
  height="800px">
</iframe>
```

### Environment Variables Required
- `GROQ_API_KEY`: For AI chatbot functionality

## Legal Disclaimer

This generator provides legal document templates and general information. It does not constitute legal advice. Complex situations require consultation with a qualified attorney. Laws vary by jurisdiction and change over time.