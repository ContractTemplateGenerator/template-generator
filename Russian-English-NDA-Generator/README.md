# Dual Language NDA Generator (English/Russian)

A comprehensive React-based tool that generates professional Non-Disclosure Agreements (NDAs) with side-by-side English and Russian text. Designed for international business use, this generator creates legally sound documents that can be enforced in both US and Russian jurisdictions.

Visit the live tool at: https://terms.law/nda-generator

## Features

### Side-by-Side Bilingual Display
- English text on the left and Russian translation on the right
- Proper alignment between corresponding paragraphs
- Consistent formatting across both languages

### Live Preview with Highlighting
- Real-time document preview that updates as you complete the form
- Yellow highlighting for recently changed content
- Auto-scroll to show changed sections

### MS Word Document Generation
- Downloads properly formatted bilingual NDAs as MS Word files
- Correct handling of Cyrillic characters
- Professional formatting for legal documents

### Educational Components
- Tooltips explaining legal concepts in both jurisdictions
- Information about cross-border NDA enforcement
- Highlights important differences between Russian and US legal requirements

### Legal Options
- Multiple confidentiality definition options (Broad, Medium, Narrow, Custom)
- Flexible protection periods and termination notice requirements
- Choice of governing law (US states or Russian Federation)
- Optional clauses for specific requirements

## File Structure

```
Russian-English-NDA-Generator/
├── index.html          # Main entry point
├── styles.css          # Styling with professional aesthetic
├── nda-generator.js    # Main React component
├── docx-generator.js   # MS Word document generation
└── README.md          # Documentation
```

## Usage

1. **Select Interface Language**: Use the English/Russian toggle to switch the interface language
2. **Complete Party Information**: Enter the details for both the disclosing and receiving parties
3. **Configure Agreement Terms**: Set the effective date, purpose of disclosure, and confidentiality definition
4. **Choose Legal Framework**: Select governing law, jurisdiction, and protection period
5. **Add Optional Clauses**: Select any additional terms needed
6. **Generate Document**: Use "Copy to Clipboard" or "Download MS Word" buttons

## Key Features Explained

### Confidentiality Definitions
- **Broad**: Includes all information that should reasonably be considered confidential
- **Medium**: Covers non-public business information and trade secrets
- **Narrow**: Limited to explicitly marked confidential information
- **Custom**: Allows drafting your own definition

### Governing Law Options
- California, USA
- Delaware, USA  
- New York, USA
- Russian Federation

### Language Control
- Choose which language version prevails in case of discrepancies
- Options: English, Russian, or Both Equally

## Legal Considerations

### Cross-Border Enforcement
- Use exact legal entity names as in registration documents
- Consider local marking requirements (especially for Russian law)
- Reasonable scope and specific jurisdiction clauses improve enforceability

### Key Differences Between US and Russian Law
- US recognizes oral and written NDAs; Russia requires written form
- Russian law requires specific "Commercial Secret" markings
- US courts may award punitive damages; Russian courts limit to actual losses
- Indefinite confidentiality may be harder to enforce under Russian law

## Technical Details

- Built with React 18
- Uses HTML-to-DOC conversion for Word document generation
- Responsive design for all screen sizes
- Real-time preview with smart highlighting system

## Development

To run locally:
1. Clone the repository
2. Open `index.html` in a modern web browser
3. No build process required - runs directly in browser

To modify:
- Edit `nda-generator.js` for component logic
- Modify `styles.css` for appearance changes
- Update `docx-generator.js` for Word document formatting

## Author

Created by Sergei Tokmakov, Esq.
- California Bar #279869
- Website: https://terms.law
- Schedule consultation: https://terms.law/call/

## License

This tool is provided for educational and practical use. Please ensure any agreements generated are reviewed by qualified legal counsel for your specific situation.

## Changelog

### Version 1.0.0 (Initial Release)
- Full bilingual NDA generation
- MS Word export functionality
- Educational tooltips and legal guidance
- Cross-border enforcement considerations
- Responsive design for all devices