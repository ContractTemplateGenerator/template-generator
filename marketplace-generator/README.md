# Marketplace Seller Agreement Generator

A modern React-based application for generating professional marketplace seller agreements with PayPal paywall integration.

## Features

- **PayPal Paywall**: Secure $19.95 one-time payment integration
- **Live Document Preview**: Real-time updates as you fill out the form
- **Comprehensive Form Sections**:
  - Marketplace Information
  - Commission Structure & Fees
  - Product Requirements
  - Fulfillment & Returns
  - Termination Terms
  - Legal Terms
- **Export Options**:
  - Copy to clipboard
  - Download as Word document (.docx)
  - Print-friendly view
- **Professional UI**: Clean, responsive design with progress tracking
- **Mobile Responsive**: Works on all device sizes

## Key Fix

This version fixes the critical bug where only the first section of the document preview was updating. Now **ALL form fields properly update the document preview in real-time**.

## Technology Stack

- React 18+ with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- PayPal SDK for payments
- docx library for Word document generation
- file-saver for downloads

## Installation & Setup

1. Navigate to the project directory:
   ```bash
   cd template-generator/marketplace-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Payment**: Complete the $19.95 PayPal payment to unlock the generator
2. **Fill Forms**: Complete each section of the agreement form
3. **Preview**: Watch the document preview update in real-time
4. **Export**: Use the export options to copy, download, or print your agreement

## Project Structure

```
src/
├── components/
│   ├── FormSections/         # Individual form components
│   ├── DocumentPreview.tsx   # Live preview component
│   ├── ExportOptions.tsx     # Export functionality
│   └── PayPalPaywall.tsx     # Payment integration
├── types/                    # TypeScript type definitions
├── App.tsx                   # Main application component
└── main.tsx                  # Application entry point
```

## PayPal Integration

The application uses PayPal's production environment with the provided credentials. Payment status is stored in localStorage for session persistence.

## Development Notes

- The preview update fix uses proper React state management with `useCallback` hooks
- All form changes trigger immediate preview updates
- Export functionality generates comprehensive Word documents
- Mobile-responsive design with Tailwind CSS

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

This project is for commercial use as a marketplace seller agreement generator.

---

Generated with Claude Code - A modern solution for marketplace agreement generation.