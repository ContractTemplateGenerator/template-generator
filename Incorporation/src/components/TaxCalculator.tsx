import { useState, useEffect } from 'react';

type Props = {
  state: string;
  entity: string;
};

interface TaxCalculation {
  type: string;
  amount: number;
  description: string;
  breakdown?: string[];
}

// Delaware Franchise Tax Calculator
function calculateDelawareFranchiseTax(authorizedShares: number, issuedShares: number, grossAssets: number): TaxCalculation[] {
  const results: TaxCalculation[] = [];

  // Authorized Shares Method
  let authorizedTax = 175; // Base for ≤5,000 shares
  if (authorizedShares > 5000) {
    if (authorizedShares <= 10000) {
      authorizedTax = 250;
    } else {
      const additionalBlocks = Math.ceil((authorizedShares - 10000) / 10000);
      authorizedTax = 250 + (additionalBlocks * 85);
    }
  }

  results.push({
    type: 'Authorized Shares Method',
    amount: authorizedTax,
    description: `Based on ${authorizedShares.toLocaleString()} authorized shares`,
    breakdown: [
      authorizedShares <= 5000 ? '≤5,000 shares: $175' :
      authorizedShares <= 10000 ? '5,001-10,000 shares: $250' :
      `${authorizedShares.toLocaleString()} shares: $250 base + ${Math.ceil((authorizedShares - 10000) / 10000)} blocks × $85`
    ]
  });

  // Assumed Par Value Capital (APVC) Method
  const assumedPar = grossAssets / Math.max(issuedShares, 1);
  const apvc = assumedPar * authorizedShares;
  const apvcUnits = Math.max(1, Math.ceil(apvc / 1000000));
  const apvcTax = Math.max(400, apvcUnits * 400);

  results.push({
    type: 'Assumed Par Value Capital Method',
    amount: apvcTax,
    description: `Based on $${grossAssets.toLocaleString()} assets and ${issuedShares.toLocaleString()} issued shares`,
    breakdown: [
      `Assumed Par: $${assumedPar.toFixed(6)}`,
      `APVC: $${apvc.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
      `Tax units: ${apvcUnits} × $400 = $${apvcTax.toLocaleString()}`
    ]
  });

  // Annual Report Fee
  results.push({
    type: 'Annual Report Fee',
    amount: 50,
    description: 'Required annual filing fee'
  });

  return results;
}

// Nevada Commerce Tax Calculator
function calculateNevadaCommerceTax(grossRevenue: number): TaxCalculation[] {
  const results: TaxCalculation[] = [];

  if (grossRevenue <= 4000000) {
    results.push({
      type: 'Commerce Tax',
      amount: 0,
      description: 'No commerce tax - revenue ≤ $4,000,000'
    });
  } else {
    const taxableRevenue = grossRevenue - 4000000;
    const commerceTax = Math.round(taxableRevenue * 0.00206); // 0.206%

    results.push({
      type: 'Commerce Tax',
      amount: commerceTax,
      description: `Based on $${grossRevenue.toLocaleString()} gross revenue`,
      breakdown: [
        `Taxable revenue: $${taxableRevenue.toLocaleString()} (revenue - $4M threshold)`,
        `Tax rate: 0.206%`,
        `Commerce tax: $${commerceTax.toLocaleString()}`
      ]
    });
  }

  return results;
}

// California LLC Tax Calculator
function calculateCaliforniaLLCTax(grossReceipts: number): TaxCalculation[] {
  const results: TaxCalculation[] = [];

  // Annual LLC tax based on gross receipts
  let llcTax = 800; // Minimum tax
  if (grossReceipts >= 250000) {
    if (grossReceipts < 1000000) {
      llcTax = 900;
    } else if (grossReceipts < 5000000) {
      llcTax = 2500;
    } else if (grossReceipts < 25000000) {
      llcTax = 6000;
    } else {
      llcTax = 11790;
    }
  }

  results.push({
    type: 'Annual LLC Tax',
    amount: llcTax,
    description: `Based on $${grossReceipts.toLocaleString()} gross receipts`,
    breakdown: [
      grossReceipts < 250000 ? 'Under $250K: $800 minimum' :
      grossReceipts < 1000000 ? '$250K - $999K: $900' :
      grossReceipts < 5000000 ? '$1M - $4.99M: $2,500' :
      grossReceipts < 25000000 ? '$5M - $24.99M: $6,000' :
      '$25M+: $11,790'
    ]
  });

  // Statement of Information fee
  results.push({
    type: 'Statement of Information',
    amount: 20,
    description: 'Biennial filing requirement'
  });

  return results;
}

export default function TaxCalculator({ state, entity }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [authorizedShares, setAuthorizedShares] = useState(1000000);
  const [issuedShares, setIssuedShares] = useState(1000000);
  const [grossAssets, setGrossAssets] = useState(1000000);
  const [grossRevenue, setGrossRevenue] = useState(1000000);
  const [grossReceipts, setGrossReceipts] = useState(1000000);
  const [calculations, setCalculations] = useState<TaxCalculation[]>([]);

  useEffect(() => {
    let results: TaxCalculation[] = [];

    if (state === 'DE' && (entity === 'Corp' || entity === 'PBC' || entity === 'PC')) {
      results = calculateDelawareFranchiseTax(authorizedShares, issuedShares, grossAssets);
    } else if (state === 'NV' && grossRevenue > 0) {
      results = calculateNevadaCommerceTax(grossRevenue);
    } else if (state === 'CA' && entity === 'LLC') {
      results = calculateCaliforniaLLCTax(grossReceipts);
    }

    setCalculations(results);
  }, [state, entity, authorizedShares, issuedShares, grossAssets, grossRevenue, grossReceipts]);

  const shouldShowCalculator = () => {
    return (state === 'DE' && ['Corp', 'PBC', 'PC'].includes(entity)) ||
           (state === 'NV') ||
           (state === 'CA' && entity === 'LLC');
  };

  if (!shouldShowCalculator()) {
    return null;
  }

  const recommendedMethod = calculations.length > 1 ?
    calculations.slice(0, -1).reduce((min, calc) => calc.amount < min.amount ? calc : min) :
    null;

  return (
    <div className="bg-white rounded-lg p-4 border border-blue-200 mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm font-semibold text-blue-900 hover:text-blue-700"
      >
        <div className="flex items-center gap-2">
          🧮 Tax Calculator
          {state === 'DE' && <span className="text-xs text-blue-600">(Delaware Franchise Tax)</span>}
          {state === 'NV' && <span className="text-xs text-blue-600">(Nevada Commerce Tax)</span>}
          {state === 'CA' && <span className="text-xs text-blue-600">(California LLC Tax)</span>}
        </div>
        <span className="text-blue-600">{isExpanded ? '−' : '+'}</span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-4">

        {/* Delaware Corporation Tax Calculator */}
        {state === 'DE' && ['Corp', 'PBC', 'PC'].includes(entity) && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Authorized Shares: {authorizedShares.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="10000000"
                step="1000"
                value={authorizedShares}
                onChange={(e) => setAuthorizedShares(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1K</span>
                <span>10M</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Issued Shares: {issuedShares.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="10000000"
                step="1000"
                value={issuedShares}
                onChange={(e) => setIssuedShares(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1K</span>
                <span>10M</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Gross Assets: ${grossAssets.toLocaleString()}
              </label>
              <input
                type="range"
                min="100000"
                max="100000000"
                step="10000"
                value={grossAssets}
                onChange={(e) => setGrossAssets(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$100K</span>
                <span>$100M</span>
              </div>
            </div>
          </div>
        )}

        {/* Nevada Commerce Tax Calculator */}
        {state === 'NV' && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Gross Revenue: ${grossRevenue.toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max="50000000"
              step="100000"
              value={grossRevenue}
              onChange={(e) => setGrossRevenue(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>$50M</span>
            </div>
          </div>
        )}

        {/* California LLC Tax Calculator */}
        {state === 'CA' && entity === 'LLC' && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Gross Receipts: ${grossReceipts.toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max="50000000"
              step="50000"
              value={grossReceipts}
              onChange={(e) => setGrossReceipts(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>$50M</span>
            </div>
          </div>
        )}

      {/* Results */}
      <div className="mt-4 space-y-2">
        {calculations.map((calc, index) => (
          <div
            key={index}
            className={`p-2 rounded border text-xs ${
              recommendedMethod && calc.type === recommendedMethod.type
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium text-gray-900">{calc.type}</span>
              <span className="font-bold text-gray-900">
                ${calc.amount.toLocaleString()}
                {recommendedMethod && calc.type === recommendedMethod.type && (
                  <span className="ml-1 text-green-600">(Recommended)</span>
                )}
              </span>
            </div>
            <div className="text-gray-600 text-xs">{calc.description}</div>
            {calc.breakdown && (
              <div className="mt-1 space-y-1">
                {calc.breakdown.map((item, i) => (
                  <div key={i} className="text-xs text-gray-500">• {item}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {state === 'DE' && calculations.length > 1 && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
          <strong>Total Annual Cost:</strong> ${(recommendedMethod?.amount || 0) + 50}
          <span className="text-blue-600 ml-1">(Lower method + $50 annual report fee)</span>
        </div>
      )}

        <div className="mt-3 text-xs text-gray-500">
          <p>
            <strong>Note:</strong> This calculator provides estimates based on current rates.
            Consult with a tax professional for precise calculations and planning.
          </p>
        </div>
        </div>
      )}
    </div>
  );
}