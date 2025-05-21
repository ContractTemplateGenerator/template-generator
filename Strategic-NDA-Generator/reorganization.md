# Strategic NDA Generator - Reorganization

This folder contains all necessary files for the Strategic NDA Generator, including its dedicated chatbox components and API.

## Reorganization

The chatbox components and API have been moved into the Strategic NDA Generator folder to make the generator more self-contained and modular.

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

- **API**:
  - `api/groq-chat.js`: API endpoint for the chatbox to communicate with Groq

- **Configuration**:
  - `vercel.json`: Configuration for API routes

## Changes Made

1. Moved `/components/chatbox-groq.js` to `/Strategic-NDA-Generator/components/chatbox-groq.js`
2. Moved `/components/chatbox.css` to `/Strategic-NDA-Generator/components/chatbox.css`
3. Moved `/api/groq-chat.js` to `/Strategic-NDA-Generator/api/groq-chat.js`
4. Updated API URL references in the code to point to the new location
5. Added vercel.json for API route handling
6. Updated HTML file to reference the new file locations

## Benefits of Reorganization

- More modular structure - each generator is self-contained
- Easier maintenance and updates - changes to one generator don't affect others
- Better organization - related files are kept together
- Clearer code separation - components specific to this generator are kept within its folder
