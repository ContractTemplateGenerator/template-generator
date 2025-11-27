# Dual Language Russian-English Consulting Agreement Generator

A professional, interactive web application for generating bilingual consulting agreements in English and Russian.

## Features

- **Dual Language Support**: Generates complete agreements in both English and Russian
- **Interactive Form Interface**: Easy-to-use tabbed interface for entering agreement details
- **Real-time Preview**: See your agreement as you fill out the form
- **Multiple Export Options**:
  - Copy to clipboard
  - Download as TXT
  - Download as DOCX (MS Word format)
- **Flexible Payment Options**: Supports hourly, fixed fee, or milestone-based payment structures
- **Customizable Legal Terms**: Choose governing law, termination periods, and optional clauses
- **Statement of Work Support**: Option to use separate SOW documents for project-specific details
- **Professional Template**: Based on attorney Sergei Tokmakov's professional consulting agreement template

## How to Use

1. Open `index.html` in a web browser
2. Fill out the form across the different tabs:
   - **Parties**: Company and consultant information
   - **Services**: Description of services to be provided
   - **Payment**: Payment structure and terms
   - **Legal Terms**: Governing law and optional clauses
   - **Summary**: Review your completed agreement
3. Toggle between English and Russian language interfaces using the flags at the top
4. Export your agreement using the download or copy buttons

## Form Sections

### Parties Tab
- Company name and address
- Consultant name and address
- Effective date of the agreement

### Services Tab
- Option to use Statement of Work (recommended) or define services directly
- Services description field (if not using SOW)

### Payment Tab
- Payment structure:  - Hourly rate
  - Fixed fee
  - Milestone-based
- Maximum hours (for hourly)
- Payment terms (Net 15/30/45/60)
- Expense reimbursement option

### Legal Terms Tab
- Governing law (state selection)
- Jurisdiction city
- Termination notice period
- Optional clauses:
  - Non-compete clause
  - Non-solicitation clause
  - Return of materials provision
  - Limitation of liability
  - Severability clause
- Controlling language selection (for conflict resolution)

## Key Agreement Provisions

The generated agreement includes all essential provisions:

1. **Services**: Defines scope of work and deliverables
2. **Payment**: Specifies compensation structure and payment terms
3. **Independent Contractor Status**: Clarifies non-employment relationship
4. **Intellectual Property**: Work product belongs to company
5. **Confidentiality**: Protects company information
6. **Warranties**: Professional standards and non-infringement
7. **Term and Termination**: Agreement duration and termination rights
8. **Limitation of Liability**: Protects both parties
9. **General Provisions**: Governing law, entire agreement, etc.

## Statement of Work Template

When "Use Statement of Work" is selected, the agreement includes a template SOW (Exhibit A) that can be used for individual projects.

## Legal Notes

- This generator creates a professional consulting agreement template
- The English version controls in case of conflict (or Russian, if selected)
- Designed for US-based companies working with consultants (including international consultants)
- Non-compete clauses may not be enforceable in California
- Consider consulting with a licensed attorney for complex situations

## Technical Details

- Built with React 18.2.0
- Uses Feather Icons for UI elements
- Generates MS Word-compatible documents (.doc format)
- Mobile-responsive design
- No server required - runs entirely in the browser

## Files

- `index.html` - Main HTML file
- `consulting-generator.js` - React application and UI logic
- `docx-generator.js` - Document generation functionality
- `styles.css` - Styling and layout
- `usa-flag.svg` - US flag icon for language toggle
- `russia-flag.svg` - Russian flag icon for language toggle

## Created By

Attorney Sergei Tokmakov, Esq.
California Bar #279869
[terms.law](https://terms.law)

## License

© 2024 Sergei Tokmakov. All rights reserved.
