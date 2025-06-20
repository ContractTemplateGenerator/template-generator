# Corporation Cost Matrix - 50 State Comparison

An interactive React application that provides a comprehensive comparison of corporation formation and ongoing costs across all 50 US states.

## 🚀 Features

- **Real-time filtering** by state name, cost range, and report frequency
- **Sortable columns** for easy comparison
- **Multi-state comparison** (up to 3 states side-by-side)
- **CSV export** functionality
- **Updated 2025 data** with recent corrections
- **Cost color coding** for quick visual analysis
- **Responsive design** for mobile and desktop

## 📊 Key Data Points

For each state, the matrix includes:
- Incorporation filing fee
- Amendment fee
- Periodic report fees and frequency
- Franchise tax or mandatory annual fees
- 5-year total cost projection
- Special notes and requirements

## 🔄 2025 Updates

This version includes major corrections based on 2025 research:

- **Mississippi**: Now correctly shows annual reports required ($25 for corporations)
- **Missouri**: Corrected to show corporations DO need annual reports ($20 fee)
- **Ohio**: Updated incorporation fee to correct $99 (was $125)
- **Pennsylvania**: Major change - now requires annual reports starting 2025 ($7 fee)
- **Oklahoma**: Confirmed no annual reports for domestic corporations
- **South Carolina**: Confirmed no Secretary of State annual reports

## 🛠 Technology Stack

- **React 18** with hooks for state management
- **Vite** for fast development and building
- **Vanilla CSS** with CSS custom properties
- **Responsive design** principles

## 📁 Project Structure

```
corporation-cost-matrix/
├── src/
│   ├── App.jsx          # Main React component
│   ├── main.jsx         # React app entry point
│   └── index.css        # Styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## 💡 Usage

1. **Search**: Type any state name to filter results
2. **Filter by cost**: Select a cost range to narrow down options
3. **Filter by frequency**: Choose report frequency (None/Annual/Biennial)
4. **Sort**: Click any column header to sort
5. **Compare**: Select up to 3 states and click "COMPARE SELECTED"
6. **Export**: Click "EXPORT CSV" to download filtered data

## 📈 Cost Categories

The application uses color coding:
- **Green**: Low cost/favorable
- **Orange**: Medium cost
- **Red**: High cost/expensive

## ⚠️ Disclaimer

All data is sourced from official state websites and was last updated January 2025. The 5-Year Total assumes one amendment filing per year and all applicable annual/biennial reports and taxes for five years. Due dates and fees may change - always verify current requirements with the state's official website.

## 📄 License

MIT License - feel free to use this for educational or commercial purposes.

## 👨‍💼 Author

Created by Sergei Tokmakov, California Attorney (CA Bar #279869)
- Website: [terms.law](https://terms.law)
- Specializing in business formation and corporate law

## 🤝 Contributing

Feel free to submit issues or pull requests to improve the data accuracy or functionality.
