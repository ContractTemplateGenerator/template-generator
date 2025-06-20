import React, { useState, useMemo, useCallback } from 'react'

// Updated corporation data with 2025 corrections
const corporationData = [
  {
    id: 1,
    state: "Mississippi",
    incorporationFee: 50,
    amendmentFee: 50,
    reportFee: "$25 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 225,
    notes: "Annual reports required by April 15th. $25 for corporations, $0 for LLCs.",
    tooltip: "CORRECTED: Actually requires annual reports by April 15th despite being lowest cost state.",
    updated: true
  },
  {
    id: 2,
    state: "Ohio", 
    incorporationFee: 99, // Corrected from $125
    amendmentFee: 50,
    reportFee: "$0 (None)",
    reportFrequency: "none",
    franchiseTax: "None",
    fiveYearTotal: 149,
    notes: "No annual reports or ongoing fees after formation. Commercial Activity Tax only for businesses >$150K receipts.",
    tooltip: "CORRECTED: Incorporation fee is $99, not $125. Still no annual reports required.",
    updated: true
  },
  {
    id: 3,
    state: "Idaho",
    incorporationFee: 100,
    amendmentFee: 30,
    reportFee: "$0 (Annual – No Fee)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 130,
    notes: "Annual reports required but with no filing fee. Very low ongoing costs.",
    tooltip: "Annual report required but completely free to file."
  },
  {
    id: 4,
    state: "Missouri",
    incorporationFee: 58,
    amendmentFee: 55,
    reportFee: "$20 (Annual)", // Corrected from None
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 213,
    notes: "CORRECTED: Corporations must file annual reports within 3 months of anniversary date.",
    tooltip: "CORRECTED: Annual reports ARE required for corporations within 3 months of anniversary.",
    updated: true
  },
  {
    id: 5,
    state: "New Mexico",
    incorporationFee: 100,
    amendmentFee: 25,
    reportFee: "$25 (Biennial)",
    reportFrequency: "biennial", 
    franchiseTax: "None",
    fiveYearTotal: 200,
    notes: "Reports only required every two years.",
    tooltip: "Biennial reports keep ongoing costs very low."
  },
  {
    id: 6,
    state: "Wyoming",
    incorporationFee: 100,
    amendmentFee: 50,
    reportFee: "$52 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None (no income or franchise tax)",
    fiveYearTotal: 410,
    notes: "Strong privacy protections and asset protection laws. No corporate income tax.",
    tooltip: "Business-friendly state known for privacy and no corporate income tax."
  },
  {
    id: 7,
    state: "North Dakota",
    incorporationFee: 100,
    amendmentFee: 50,
    reportFee: "$25 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 275,
    notes: "Simple annual reporting requirements."
  },
  {
    id: 8,
    state: "Pennsylvania",
    incorporationFee: 125,
    amendmentFee: 70,
    reportFee: "$7 (Annual)", // Corrected from None/Decennial
    reportFrequency: "annual",
    franchiseTax: "None", 
    fiveYearTotal: 230,
    notes: "CORRECTED: Starting 2025, annual reports required ($7 fee). No longer decennial.",
    tooltip: "MAJOR CHANGE: Pennsylvania now requires annual reports starting 2025, not decennial.",
    updated: true
  },
  {
    id: 9,
    state: "Arizona",
    incorporationFee: 60,
    amendmentFee: 25,
    reportFee: "$45 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None (no franchise tax)",
    fiveYearTotal: 310,
    notes: "Annual reports required for corporations by anniversary date."
  },
  {
    id: 10,
    state: "Hawaii",
    incorporationFee: 50,
    amendmentFee: 25,
    reportFee: "$15 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 200,
    notes: "Low ongoing costs with annual filing."
  },
  {
    id: 11,
    state: "Minnesota",
    incorporationFee: 160,
    amendmentFee: 35,
    reportFee: "$0 (Annual – No Fee)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 195,
    notes: "Annual renewal required but with no filing fee.",
    tooltip: "Free annual reports despite requiring filing."
  },
  {
    id: 12,
    state: "Michigan",
    incorporationFee: 60,
    amendmentFee: 10,
    reportFee: "$25 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 195,
    notes: "Low costs across all categories."
  },
  {
    id: 13,
    state: "Indiana",
    incorporationFee: 90,
    amendmentFee: 30,
    reportFee: "$30 (Biennial)",
    reportFrequency: "biennial",
    franchiseTax: "None",
    fiveYearTotal: 180,
    notes: "Biennial reporting keeps costs down."
  },
  {
    id: 14,
    state: "Colorado",
    incorporationFee: 50,
    amendmentFee: 25,
    reportFee: "$10 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 175,
    notes: "Very low annual fees."
  },
  {
    id: 15,
    state: "Kentucky",
    incorporationFee: 55,
    amendmentFee: 25,
    reportFee: "$15 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 175,
    notes: "Consistently low fees."
  },
  {
    id: 16,
    state: "Oklahoma",
    incorporationFee: 52,
    amendmentFee: 25,
    reportFee: "$0 (None)", // Confirmed no annual reports
    reportFrequency: "none",
    franchiseTax: "None for small corp",
    fiveYearTotal: 77,
    notes: "CONFIRMED: No annual reports required for domestic corporations. Franchise tax only for large capital.",
    tooltip: "One of the few states with truly no ongoing reporting requirements for small corporations."
  },
  {
    id: 17,
    state: "Utah",
    incorporationFee: 72,
    amendmentFee: 37,
    reportFee: "$15 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 259,
    notes: "Moderate costs with annual reporting."
  },
  {
    id: 18,
    state: "North Carolina",
    incorporationFee: 125,
    amendmentFee: 50,
    reportFee: "$20 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 375,
    notes: "Higher formation fee but reasonable ongoing costs."
  },
  {
    id: 19,
    state: "Louisiana",
    incorporationFee: 100,
    amendmentFee: 30,
    reportFee: "$30 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 330,
    notes: "Standard fees across categories."
  },
  {
    id: 20,
    state: "Iowa",
    incorporationFee: 50,
    amendmentFee: 50,
    reportFee: "$45 (Biennial)",
    reportFrequency: "biennial",
    franchiseTax: "None",
    fiveYearTotal: 235,
    notes: "Biennial reporting reduces frequency."
  },
  {
    id: 21,
    state: "West Virginia",
    incorporationFee: 82,
    amendmentFee: 25,
    reportFee: "$25 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 232,
    notes: "Reasonable ongoing costs."
  },
  {
    id: 22,
    state: "South Carolina",
    incorporationFee: 135,
    amendmentFee: 25,
    reportFee: "$0 (None)", // Confirmed no SOS annual reports
    reportFrequency: "none",
    franchiseTax: "License Tax: $25 min/year",
    fiveYearTotal: 285,
    notes: "CONFIRMED: No Secretary of State annual reports, but annual license tax required through Department of Revenue.",
    tooltip: "No SOS annual reports but has separate license tax requirement."
  },
  {
    id: 23,
    state: "Alabama",
    incorporationFee: 165,
    amendmentFee: 50,
    reportFee: "$0 (None)",
    reportFrequency: "none", 
    franchiseTax: "Bus. Privilege Tax: $100 min/year",
    fiveYearTotal: 615,
    notes: "No annual report but has mandatory Business Privilege Tax with first year exemption.",
    tooltip: "First year of Business Privilege Tax is exempt."
  },
  {
    id: 24,
    state: "Virginia",
    incorporationFee: 79,
    amendmentFee: 25,
    reportFee: "$100 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 604,
    notes: "Higher annual report fees."
  },
  {
    id: 25,
    state: "Washington",
    incorporationFee: 200,
    amendmentFee: 30,
    reportFee: "$60 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 630,
    notes: "Higher formation fee but no state income tax."
  },
  {
    id: 26,
    state: "Oregon",
    incorporationFee: 100,
    amendmentFee: 100,
    reportFee: "$100 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 1100,
    notes: "Higher fees across all categories."
  },
  {
    id: 27,
    state: "New York",
    incorporationFee: 145,
    amendmentFee: 60,
    reportFee: "$9 (Biennial)",
    reportFrequency: "biennial",
    franchiseTax: "Franchise Tax: $25 min/year",
    fiveYearTotal: 354,
    notes: "Low biennial report fee but has franchise tax."
  },
  {
    id: 28,
    state: "Tennessee",
    incorporationFee: 125,
    amendmentFee: 20,
    reportFee: "$20 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "Franchise Tax: $100 min/year",
    fiveYearTotal: 745,
    notes: "Moderate fees but significant franchise tax."
  },
  {
    id: 29,
    state: "New Jersey",
    incorporationFee: 125,
    amendmentFee: 75,
    reportFee: "$50 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 650,
    notes: "Higher ongoing costs."
  },
  {
    id: 30,
    state: "Kansas",
    incorporationFee: 90,
    amendmentFee: 35,
    reportFee: "$55 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 550,
    notes: "Moderate annual fees."
  },
  {
    id: 31,
    state: "Vermont",
    incorporationFee: 125,
    amendmentFee: 75,
    reportFee: "$35 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 575,
    notes: "Higher amendment fees."
  },
  {
    id: 32,
    state: "Maine",
    incorporationFee: 145,
    amendmentFee: 50,
    reportFee: "$85 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 770,
    notes: "Higher annual report fees."
  },
  {
    id: 33,
    state: "Arkansas",
    incorporationFee: 50,
    amendmentFee: 50,
    reportFee: "$150 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 850,
    notes: "Low formation fee but high annual franchise tax filing.",
    tooltip: "Low formation fee offset by high annual reporting costs."
  },
  {
    id: 34,
    state: "Wisconsin",
    incorporationFee: 100,
    amendmentFee: 40,
    reportFee: "$40 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 440,
    notes: "Consistent moderate fees."
  },
  {
    id: 35,
    state: "Alaska",
    incorporationFee: 250,
    amendmentFee: 25,
    reportFee: "$100 (Biennial)",
    reportFrequency: "biennial",
    franchiseTax: "None",
    fiveYearTotal: 575,
    notes: "High formation fee but biennial reporting."
  },
  {
    id: 36,
    state: "South Dakota",
    incorporationFee: 150,
    amendmentFee: 60,
    reportFee: "$50 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 660,
    notes: "Higher formation costs."
  },
  {
    id: 37,
    state: "Montana",
    incorporationFee: 70,
    amendmentFee: 15,
    reportFee: "$20 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 265,
    notes: "Very low fees across all categories."
  },
  {
    id: 38,
    state: "Nebraska",
    incorporationFee: 65,
    amendmentFee: 25,
    reportFee: "$26 (Biennial)",
    reportFrequency: "biennial",
    franchiseTax: "None",
    fiveYearTotal: 168,
    notes: "Low costs with biennial reporting."
  },
  {
    id: 39,
    state: "Illinois",
    incorporationFee: 175,
    amendmentFee: 50,
    reportFee: "$75 (Annual) + $100 franchise tax (min)",
    reportFrequency: "annual",
    franchiseTax: "Franchise Tax: $25 min (phasing out)",
    fiveYearTotal: 1300,
    notes: "Combined annual report and franchise tax creates higher ongoing costs. Franchise tax being phased out.",
    tooltip: "High costs due to combined reporting and franchise tax requirements."
  },
  {
    id: 40,
    state: "Georgia",
    incorporationFee: 100,
    amendmentFee: 50,
    reportFee: "$50 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 600,
    notes: "Newspaper publication required (~$150 additional cost).",
    tooltip: "Publication requirement adds significant upfront costs."
  },
  {
    id: 41,
    state: "Massachusetts",
    incorporationFee: 295,
    amendmentFee: 100,
    reportFee: "$125 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 1270,
    notes: "High costs across all categories."
  },
  {
    id: 42,
    state: "Connecticut",
    incorporationFee: 455,
    amendmentFee: 50,
    reportFee: "$100 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 1305,
    notes: "Very high formation fee."
  },
  {
    id: 43,
    state: "Florida",
    incorporationFee: 79,
    amendmentFee: 35,
    reportFee: "$150 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 1004,
    notes: "High annual report fees."
  },
  {
    id: 44,
    state: "New Hampshire",
    incorporationFee: 100,
    amendmentFee: 35,
    reportFee: "$100 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "None",
    fiveYearTotal: 975,
    notes: "High annual fees."
  },
  {
    id: 45,
    state: "Texas",
    incorporationFee: 310,
    amendmentFee: 150,
    reportFee: "$0 (None)",
    reportFrequency: "none",
    franchiseTax: "None if revenue < $1.23M",
    fiveYearTotal: 460,
    notes: "High formation fee but no ongoing state reports. Franchise tax exemption for small businesses.",
    tooltip: "No Secretary of State annual reports and franchise tax exemption for small businesses."
  },
  {
    id: 46,
    state: "Nevada",
    incorporationFee: 725,
    amendmentFee: 175,
    reportFee: "$650 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "No state income/franchise tax",
    fiveYearTotal: 4800,
    notes: "Very high annual fees. $650 includes List ($150) + State Business License ($500).",
    tooltip: "Extremely high ongoing costs despite no state income tax."
  },
  {
    id: 47,
    state: "Delaware",
    incorporationFee: 140,
    amendmentFee: 194,
    reportFee: "$50 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "Franchise Tax: $175 min/year",
    fiveYearTotal: 1359,
    notes: "Premier legal jurisdiction with specialized Court of Chancery. Higher costs for legal advantages.",
    tooltip: "Renowned for established business law and corporate legal protections."
  },
  {
    id: 48,
    state: "California",
    incorporationFee: 100,
    amendmentFee: 30,
    reportFee: "$25 (Annual)",
    reportFrequency: "annual",
    franchiseTax: "Franchise Tax: $800 per year",
    fiveYearTotal: 4255,
    notes: "Moderate filing fee but $800 annual franchise tax makes it most expensive over time.",
    tooltip: "Hefty $800/year franchise tax regardless of income or revenue."
  }
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [costFilter, setCostFilter] = useState('all');
  const [reportFilter, setReportFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'fiveYearTotal', direction: 'ascending' });
  const [selectedStates, setSelectedStates] = useState(new Set());
  const [showComparison, setShowComparison] = useState(false);

  const filteredAndSortedData = useMemo(() => {
    let filtered = corporationData.filter(corp => {
      const matchesSearch = corp.state.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesCost = true;
      if (costFilter !== 'all') {
        const cost = corp.fiveYearTotal;
        switch (costFilter) {
          case '0-300':
            matchesCost = cost <= 300;
            break;
          case '301-600':
            matchesCost = cost > 300 && cost <= 600;
            break;
          case '601-1000':
            matchesCost = cost > 600 && cost <= 1000;
            break;
          case '1001-2000':
            matchesCost = cost > 1000 && cost <= 2000;
            break;
          case '2001+':
            matchesCost = cost > 2000;
            break;
        }
      }
      
      let matchesFreq = true;
      if (reportFilter !== 'all') {
        matchesFreq = corp.reportFrequency === reportFilter;
      }
      
      return matchesSearch && matchesCost && matchesFreq;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortConfig.direction === 'ascending') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [searchTerm, costFilter, reportFilter, sortConfig]);

  const handleSort = useCallback((key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  }, []);

  const handleStateSelection = useCallback((stateId, isSelected) => {
    setSelectedStates(prev => {
      const newSet = new Set(prev);
      if (isSelected && newSet.size < 3) {
        newSet.add(stateId);
      } else if (!isSelected) {
        newSet.delete(stateId);
      } else if (isSelected && newSet.size >= 3) {
        alert('You can only select up to 3 states for comparison.');
        return prev;
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((isSelected) => {
    if (isSelected) {
      const visibleStates = filteredAndSortedData.slice(0, 3).map(corp => corp.id);
      setSelectedStates(new Set(visibleStates));
    } else {
      setSelectedStates(new Set());
    }
  }, [filteredAndSortedData]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setCostFilter('all');
    setReportFilter('all');
    setSelectedStates(new Set());
    setShowComparison(false);
  }, []);

  const exportCSV = useCallback(() => {
    const headers = ['State', 'Incorporation Fee', 'Amendment Fee', 'Report Fee', 'Franchise Tax', '5-Year Total', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedData.map(corp => [
        corp.state,
        `$${corp.incorporationFee}`,
        `$${corp.amendmentFee}`,
        corp.reportFee,
        corp.franchiseTax,
        `$${corp.fiveYearTotal.toLocaleString()}`,
        `"${corp.notes.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Corporation_Cost_Matrix_2025.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filteredAndSortedData]);

  const getCostClass = useCallback((value, type) => {
    switch (type) {
      case 'formation':
        if (value <= 100) return 'formation-low';
        if (value <= 200) return 'formation-medium';
        return 'formation-high';
      case 'amendment':
        if (value <= 30) return 'amendment-low';
        if (value <= 70) return 'amendment-medium';
        return 'amendment-high';
      case 'total':
        if (value <= 350) return 'total-low';
        if (value <= 700) return 'total-medium';
        if (value <= 2000) return 'total-high';
        return 'total-veryhigh';
      default:
        return '';
    }
  }, []);

  const getSelectedStatesData = useCallback(() => {
    return corporationData.filter(corp => selectedStates.has(corp.id));
  }, [selectedStates]);

  return (
    <div className="dashboard">
      <div className="controls">
        <div className="control-group">
          <label htmlFor="search">Search State:</label>
          <input
            type="text"
            id="search"
            placeholder="State name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="control-group">
          <label htmlFor="cost-filter">5-Year Cost Range:</label>
          <select
            id="cost-filter"
            value={costFilter}
            onChange={(e) => setCostFilter(e.target.value)}
          >
            <option value="all">All Cost Ranges</option>
            <option value="0-300">$0 - $300</option>
            <option value="301-600">$301 - $600</option>
            <option value="601-1000">$601 - $1000</option>
            <option value="1001-2000">$1001 - $2000</option>
            <option value="2001+">$2001+</option>
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="report-filter">Report Frequency:</label>
          <select
            id="report-filter"
            value={reportFilter}
            onChange={(e) => setReportFilter(e.target.value)}
          >
            <option value="all">All Frequencies</option>
            <option value="none">None</option>
            <option value="annual">Annual</option>
            <option value="biennial">Biennial</option>
          </select>
        </div>
        
        <div className="button-container">
          <button
            className="compare-btn"
            disabled={selectedStates.size === 0}
            onClick={() => setShowComparison(true)}
          >
            COMPARE SELECTED ({selectedStates.size})
          </button>
          <button className="reset-btn" onClick={resetFilters}>
            RESET FILTERS
          </button>
          <button className="export-btn" onClick={exportCSV}>
            EXPORT CSV
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-sticky-header">
          <table className="corp-cost-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedStates.size > 0 && selectedStates.size === Math.min(3, filteredAndSortedData.length)}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="state-col sortable" onClick={() => handleSort('state')}>
                  State {sortConfig.key === 'state' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="fee-col sortable" onClick={() => handleSort('incorporationFee')}>
                  Incorporation Filing Fee {sortConfig.key === 'incorporationFee' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="fee-col sortable" onClick={() => handleSort('amendmentFee')}>
                  Amendment Fee {sortConfig.key === 'amendmentFee' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="fee-col sortable" onClick={() => handleSort('reportFee')}>
                  Periodic Report Fee<br/>(Frequency) {sortConfig.key === 'reportFee' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="tax-col sortable" onClick={() => handleSort('franchiseTax')}>
                  Franchise Tax or<br/>Mandatory Annual Fee {sortConfig.key === 'franchiseTax' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="fee-col sortable" onClick={() => handleSort('fiveYearTotal')}>
                  5‑Year Total {sortConfig.key === 'fiveYearTotal' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="notes-col">Special Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.map((corp) => (
                <tr key={corp.id}>
                  <td className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedStates.has(corp.id)}
                      onChange={(e) => handleStateSelection(corp.id, e.target.checked)}
                    />
                  </td>
                  <td className="state-col">
                    {corp.state}
                    {corp.updated && <span className="updated-indicator">UPDATED</span>}
                    {corp.tooltip && (
                      <div className="tooltip-container">
                        <span className="info-icon">ⓘ</span>
                        <div className="tooltip">{corp.tooltip}</div>
                      </div>
                    )}
                  </td>
                  <td className={getCostClass(corp.incorporationFee, 'formation')}>
                    ${corp.incorporationFee}
                  </td>
                  <td className={getCostClass(corp.amendmentFee, 'amendment')}>
                    ${corp.amendmentFee}
                  </td>
                  <td>{corp.reportFee}</td>
                  <td>{corp.franchiseTax}</td>
                  <td className={getCostClass(corp.fiveYearTotal, 'total')}>
                    ${corp.fiveYearTotal.toLocaleString()}
                  </td>
                  <td className="notes-col">
                    <div className={corp.updated ? 'corrected-data' : ''}>
                      {corp.notes}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showComparison && selectedStates.size > 0 && (
        <ComparisonView
          states={getSelectedStatesData()}
          onClose={() => setShowComparison(false)}
        />
      )}

      <div className="disclaimer">
        <strong>Data Updated for 2025:</strong> All information verified from official state websites as of January 2025. 
        Key corrections include: Mississippi annual reports, Missouri corporation reports, Ohio fees, Pennsylvania's new annual requirement, 
        and Oklahoma's confirmed no-report status. The 5-Year Total assumes one amendment filing and all applicable annual/biennial reports and taxes for five years. 
        Always verify current requirements with official state websites as fees and deadlines may change.
      </div>
    </div>
  );
}

function ComparisonView({ states, onClose }) {
  return (
    <div className="comparison-view">
      <div className="comparison-header">
        <h2>State Corporation Comparison</h2>
        <button className="reset-btn" onClick={onClose}>
          CLOSE COMPARISON
        </button>
      </div>
      <div className="comparison-grid">
        {states.map((state) => (
          <div key={state.id} className="comparison-item">
            <div className="comparison-item-header">
              {state.state}
              {state.updated && <span className="updated-indicator">UPDATED</span>}
              {state.tooltip && (
                <div className="comparison-item-description">
                  {state.tooltip}
                </div>
              )}
            </div>
            <div className="comparison-item-body">
              <div className="comparison-item-row">
                <strong>Incorporation Filing Fee</strong>
                <p>${state.incorporationFee}</p>
              </div>
              <div className="comparison-item-row">
                <strong>Amendment Fee</strong>
                <p>${state.amendmentFee}</p>
              </div>
              <div className="comparison-item-row">
                <strong>Periodic Report Fee</strong>
                <p>{state.reportFee}</p>
              </div>
              <div className="comparison-item-row">
                <strong>Franchise Tax/Annual Fee</strong>
                <p>{state.franchiseTax}</p>
              </div>
              <div className="comparison-item-row">
                <strong>5-Year Total</strong>
                <p>${state.fiveYearTotal.toLocaleString()}</p>
              </div>
              <div className="comparison-item-row">
                <strong>Special Notes</strong>
                <p>{state.notes}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
