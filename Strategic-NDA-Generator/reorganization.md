# Strategic NDA Generator - Reorganization

This folder contains the core files for the Strategic NDA Generator, including its dedicated chatbox component.

## Reorganization

The chatbox components have been moved into the Strategic NDA Generator folder, while the API remains in the root `/api` directory (as required by Vercel for serverless functions).

### Files Organization:

- **Main Generator Files**:
  - `index.html`: Main HTML file
  - `styles.css`: Main styling
  - `nda-generator.js`: Core generator logic
  - `docx-generator.js`: Word document generation functionality
  - `final-preview-tab.js`: Final preview functionality

- **Chatbox Components**:
  - `components/chatbox-groq.js`: Groq-powered AI assistant component
  - `components/chatbox.css`: Styling for the chatbox component

- **API** (located in root `/api` directory):
  - `/api/nda-groq-chat.js`: API endpoint for the chatbox to communicate with Groq

## Changes Made

1. Moved `/components/chatbox-groq.js` to `/Strategic-NDA-Generator/components/chatbox-groq.js`
2. Moved `/components/chatbox.css` to `/Strategic-NDA-Generator/components/chatbox.css`
3. Created NDA-specific API at `/api/nda-groq-chat.js` (moved from original `/api/groq-chat.js`)
4. Updated API URL references in the code to point to `/api/nda-groq-chat`
5. Updated HTML file to reference the new component locations

## Benefits of Reorganization

- More modular structure - generator components are self-contained
- Easier maintenance - changes to this generator's components don't affect others
- Better organization - related UI components are kept together
- Proper API routing - API functions remain in the root `/api` directory as required by Vercel
- Clear separation - NDA-specific chatbox and API are clearly distinguished from other generators
