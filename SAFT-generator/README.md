# SAFT (Simple Agreement for Future Tokens) Generator

A comprehensive generator for creating customized SAFT agreements compliant with securities regulations.

## Overview

This SAFT Generator allows users to create legally-sound Simple Agreements for Future Tokens for token pre-sales. The generator includes options for different token distribution models, regulatory compliance settings, and investment terms.

## Features

- **Live Preview with Highlighting:** Real-time document preview that updates and highlights changes as users complete the form
- **MS Word Document Generation:** Export properly formatted SAFT agreements to Microsoft Word
- **Tab-Based Navigation:** Intuitive interface divided into logical sections for easier form completion
- **Educational Components:** Comprehensive tooltips and regulatory information boxes to help users understand complex legal and technical concepts
- **Responsive Design:** Works seamlessly on all screen sizes

## Technical Details

### File Structure

- `index.html` - Main entry point
- `styles.css` - CSS styling for the generator
- `saft-generator.js` - Main React component
- `docx-generator.js` - Word document generation functionality

### Components

1. **Form Panel**
   - Company Information
   - Offering Details
   - Token Information
   - Investment Terms
   - Regulatory Compliance
   - Closing Provisions

2. **Preview Panel**
   - Real-time document preview
   - Highlighted changes
   - Auto-scrolling to changed content

3. **Navigation**
   - Tab-based navigation
   - Previous/Next buttons
   - Action buttons (Copy, Download, Schedule Consultation)

### Key Technical Features

- **Yellow Highlighting:** Changed content is highlighted in yellow and automatically scrolled into view
- **HTML-to-DOC Conversion:** Uses HTML formatting for proper Word document generation
- **Percentage Input Controls:** Custom input controls for percentage values
- **Tooltips and Warning Indicators:** Helpful explanations and warnings for high-risk provisions

## Usage

1. Fill out the form sections in order, or navigate freely between tabs
2. Preview your SAFT agreement in real-time on the right panel
3. Copy the generated text to clipboard or download as a Word document
4. Schedule a consultation for legal advice on your specific SAFT requirements

## Regulatory Considerations

This generator includes educational information about regulatory requirements but should not be considered legal advice. Users should consult with a qualified attorney before finalizing and using any SAFT agreement.

## Maintenance Notes

- The `getSectionToHighlight` and `getTextToHighlight` functions control which text is highlighted when form fields change
- The document generation logic is in the `generateSAFTText` function
- Word document formatting is handled in the `docx-generator.js` file

## Troubleshooting

- If Word document generation fails, users can still copy the text to clipboard
- For highlighting issues, check the regex patterns in the `getTextToHighlight` function
- For form validation issues, add appropriate validation logic to the `handleChange` function

## License

This generator is proprietary and owned by terms.law.