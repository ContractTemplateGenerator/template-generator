import React, { useState, useEffect } from 'react';

const CaseValueCalculator = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    disputeAmount: 2500,
    disputeType: 'consumer',
    paymentMethod: 'credit_card',
    hasWrittenContract: true,
    hasEmailTrail: true,
    hasPaymentRecords: true,
    hasScreenshots: false,
    opponentType: 'small_business',
    timeWithinChargeback: true,
    state: 'CA',
    urgency: 'moderate',
    hourlyRate: 50
  });
  
  const [results, setResults] = useState(null);
  const [expandedPath, setExpandedPath] = useState(null);

  // Evidence strength calculation
  const calculateEvidenceScore = () => {
    let score = 40; // baseline
    if (formData.hasWrittenContract) score += 25;
    if (formData.hasEmailTrail) score += 15;
    if (formData.hasPaymentRecords) score += 20;
    if (formData.hasScreenshots) score += 10;
    return Math.min(score, 95);
  };

  // Opponent settlement likelihood
  const getOpponentProfile = () => {
    const profiles = {
      individual: { settlementRate: 0.35, collectionDifficulty: 'High', description: 'May ignore, harder to collect' },
      small_business: { settlementRate: 0.65, collectionDifficulty: 'Medium', description: 'Reputation-sensitive, likely to settle' },
      corporation: { settlementRate: 0.45, collectionDifficulty: 'Low', description: 'Legal process, slower but reliable' },
      platform_seller: { settlementRate: 0.75, collectionDifficulty: 'Low', description: 'Platform leverage available' }
    };
    return profiles[formData.opponentType];
  };

  // Calculate all pathway EVs
  const calculatePathways = () => {
    const amount = formData.disputeAmount;
    const evidenceScore = calculateEvidenceScore() / 100;
    const opponent = getOpponentProfile();
    const hourlyRate = formData.hourlyRate;

    const pathways = [
      {
        id: 'chargeback',
        name: 'Credit Card Chargeback',
        icon: '💳',
        available: formData.paymentMethod === 'credit_card' && formData.timeWithinChargeback,
        cost: 0,
        timeCost: 2 * hourlyRate,
        timeframe: '1-3 weeks',
        successRate: formData.timeWithinChargeback ? 0.72 : 0,
        recovery: amount,
        description: 'Dispute through your credit card company',
        pros: ['Free', 'Fast', 'No lawyer needed'],
        cons: ['Time-limited', 'May need documentation', 'Can affect merchant relationship']
      },
      {
        id: 'platform_dispute',
        name: 'Platform Dispute',
        icon: '🖥️',
        available: formData.opponentType === 'platform_seller',
        cost: 0,
        timeCost: 1.5 * hourlyRate,
        timeframe: '1-2 weeks',
        successRate: 0.68 * evidenceScore,
        recovery: amount,
        description: 'Dispute through marketplace platform (eBay, Amazon, etc.)',
        pros: ['Free', 'Quick resolution', 'Platform favors buyers'],
        cons: ['Platform-specific rules', 'May limit future purchases']
      },
      {
        id: 'self_demand',
        name: 'DIY Demand Letter',
        icon: '✉️',
        available: true,
        cost: 0,
        timeCost: 3 * hourlyRate,
        timeframe: '2-4 weeks',
        successRate: 0.25 * evidenceScore * opponent.settlementRate,
        recovery: amount,
        description: 'Write and send your own formal demand letter',
        pros: ['Free', 'Good first step', 'Creates paper trail'],
        cons: ['Lower impact than attorney letter', 'Requires follow-through']
      },
      {
        id: 'attorney_demand',
        name: 'Attorney Demand Letter',
        icon: '⚖️',
        available: true,
        cost: 350,
        timeCost: 0.5 * hourlyRate,
        timeframe: '2-4 weeks',
        successRate: 0.55 * evidenceScore * opponent.settlementRate,
        recovery: amount,
        description: 'Professional demand letter on attorney letterhead',
        pros: ['High credibility', 'Legal expertise', 'Often resolves disputes'],
        cons: ['Upfront cost', 'Not guaranteed']
      },
      {
        id: 'small_claims',
        name: 'Small Claims Court',
        icon: '🏛️',
        available: amount <= 12500, // CA limit
        cost: amount <= 1500 ? 30 : amount <= 5000 ? 50 : 75,
        timeCost: 8 * hourlyRate,
        timeframe: '2-3 months',
        successRate: 0.65 * evidenceScore,
        recovery: amount,
        description: 'File a lawsuit in small claims court',
        pros: ['Binding judgment', 'No lawyer needed', 'Low filing fees'],
        cons: ['Time in court', 'Collection still required', 'Stress']
      },
      {
        id: 'regulatory',
        name: 'Consumer Complaint (AG/FTC)',
        icon: '🏢',
        available: formData.disputeType === 'consumer',
        cost: 0,
        timeCost: 2 * hourlyRate,
        timeframe: '1-6 months',
        successRate: 0.15,
        recovery: amount,
        description: 'File complaint with Attorney General or FTC',
        pros: ['Free', 'Creates official record', 'May trigger investigation'],
        cons: ['Low individual resolution rate', 'Slow', 'No guarantee of action']
      }
    ];

    return pathways.filter(p => p.available).map(p => {
      const grossEV = p.successRate * p.recovery;
      const totalCost = p.cost + p.timeCost;
      const netEV = grossEV - totalCost;
      const roi = totalCost > 0 ? ((grossEV - totalCost) / totalCost * 100) : (grossEV > 0 ? 999 : 0);
      
      return {
        ...p,
        grossEV,
        netEV,
        totalCost,
        roi,
        successRateDisplay: Math.round(p.successRate * 100),
        recommendation: netEV > amount * 0.5 ? 'strong' : netEV > 0 ? 'moderate' : 'weak'
      };
    }).sort((a, b) => b.netEV - a.netEV);
  };

  useEffect(() => {
    if (step >= 4) {
      setResults(calculatePathways());
    }
  }, [step, formData]);

  const GaugeChart = ({ value, max, label, color = '#10b981' }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const rotation = (percentage / 100) * 180;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-16 overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 rounded-t-full"></div>
          <div 
            className="absolute inset-0 rounded-t-full origin-bottom"
            style={{
              background: `conic-gradient(${color} ${rotation}deg, transparent ${rotation}deg)`,
              clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 50% 0, 0 0)'
            }}
          ></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-white rounded-t-full"></div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-lg font-bold" style={{ color }}>
            {Math.round(value)}%
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">{label}</div>
      </div>
    );
  };

  const EVRangeBar = ({ pathway }) => {
    const maxEV = formData.disputeAmount * 1.2;
    const evPosition = Math.max(0, Math.min((pathway.netEV / maxEV) * 100, 100));
    const costPosition = Math.max(0, Math.min((pathway.totalCost / maxEV) * 100, 100));
    
    const getBarColor = () => {
      if (pathway.netEV > formData.disputeAmount * 0.5) return 'bg-green-500';
      if (pathway.netEV > 0) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
        {/* Cost zone */}
        <div 
          className="absolute left-0 top-0 bottom-0 bg-red-200"
          style={{ width: `${costPosition}%` }}
        ></div>
        {/* EV marker */}
        <div 
          className={`absolute top-0 bottom-0 w-1 ${getBarColor()}`}
          style={{ left: `${evPosition}%` }}
        ></div>
        {/* Labels */}
        <div className="absolute inset-0 flex items-center justify-between px-2 text-xs">
          <span className="text-red-600 font-medium">${pathway.totalCost} cost</span>
          <span className={`font-bold ${pathway.netEV > 0 ? 'text-green-600' : 'text-red-600'}`}>
            EV: ${Math.round(pathway.netEV)}
          </span>
        </div>
      </div>
    );
  };

  const PathwayCard = ({ pathway, isExpanded, onToggle }) => {
    const getRecommendationBadge = () => {
      if (pathway.recommendation === 'strong') {
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">RECOMMENDED</span>;
      }
      if (pathway.recommendation === 'moderate') {
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">VIABLE</span>;
      }
      return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">NOT ADVISED</span>;
    };

    return (
      <div className={`border rounded-xl overflow-hidden transition-all ${
        pathway.recommendation === 'strong' ? 'border-green-300 bg-green-50/30' : 
        pathway.recommendation === 'moderate' ? 'border-yellow-200' : 'border-gray-200'
      }`}>
        <div 
          className="p-4 cursor-pointer hover:bg-gray-50"
          onClick={onToggle}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{pathway.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{pathway.name}</h4>
                  {getRecommendationBadge()}
                </div>
                <p className="text-sm text-gray-500">{pathway.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${pathway.netEV > 0 ? 'text-green-600' : 'text-red-500'}`}>
                ${Math.round(pathway.netEV)}
              </div>
              <div className="text-xs text-gray-500">Expected Value</div>
            </div>
          </div>
          
          <div className="mt-3">
            <EVRangeBar pathway={pathway} />
          </div>
          
          <div className="mt-3 flex justify-between text-sm">
            <div className="flex gap-4">
              <span className="text-gray-600">
                <span className="font-medium text-green-600">{pathway.successRateDisplay}%</span> success rate
              </span>
              <span className="text-gray-600">
                <span className="font-medium">{pathway.timeframe}</span>
              </span>
            </div>
            <span className="text-blue-600">{isExpanded ? '▲ Less' : '▼ More details'}</span>
          </div>
        </div>
        
        {isExpanded && (
          <div className="px-4 pb-4 border-t bg-white">
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h5 className="font-medium text-green-700 text-sm mb-2">✓ Pros</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {pathway.pros.map((pro, i) => <li key={i}>• {pro}</li>)}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-red-700 text-sm mb-2">✗ Cons</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {pathway.cons.map((con, i) => <li key={i}>• {con}</li>)}
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-700 text-sm mb-2">📊 Detailed Breakdown</h5>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                  <div className="text-gray-500">Out-of-pocket</div>
                  <div className="font-semibold">${pathway.cost}</div>
                </div>
                <div>
                  <div className="text-gray-500">Time cost</div>
                  <div className="font-semibold">${Math.round(pathway.timeCost)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Potential recovery</div>
                  <div className="font-semibold">${pathway.recovery}</div>
                </div>
                <div>
                  <div className="text-gray-500">ROI</div>
                  <div className={`font-semibold ${pathway.roi > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {pathway.roi > 100 ? '100+' : Math.round(pathway.roi)}%
                  </div>
                </div>
              </div>
            </div>
            
            <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              Start This Pathway →
            </button>
          </div>
        )}
      </div>
    );
  };

  // Steps UI
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          💰 How much are you owed?
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">$</span>
          <input
            type="number"
            value={formData.disputeAmount}
            onChange={(e) => setFormData({...formData, disputeAmount: parseInt(e.target.value) || 0})}
            className="w-full pl-10 pr-4 py-4 text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <input
          type="range"
          min="100"
          max="25000"
          step="100"
          value={formData.disputeAmount}
          onChange={(e) => setFormData({...formData, disputeAmount: parseInt(e.target.value)})}
          className="w-full mt-2 accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>$100</span>
          <span>$25,000</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📂 What type of dispute is this?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'consumer', label: 'Consumer/Refund', icon: '🛒' },
            { id: 'business', label: 'Business/Contract', icon: '📋' },
            { id: 'employment', label: 'Employment/Wages', icon: '💼' },
            { id: 'landlord', label: 'Landlord/Tenant', icon: '🏠' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setFormData({...formData, disputeType: type.id})}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                formData.disputeType === type.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-xl mr-2">{type.icon}</span>
              <span className="font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          💳 How did you pay?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'credit_card', label: 'Credit Card', hasChargeback: true },
            { id: 'debit_card', label: 'Debit Card', hasChargeback: true },
            { id: 'bank_transfer', label: 'Bank Transfer/Wire', hasChargeback: false },
            { id: 'cash', label: 'Cash/Check', hasChargeback: false },
            { id: 'crypto', label: 'Crypto', hasChargeback: false },
            { id: 'no_payment', label: 'No payment made', hasChargeback: false }
          ].map(method => (
            <button
              key={method.id}
              onClick={() => setFormData({...formData, paymentMethod: method.id})}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                formData.paymentMethod === method.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium">{method.label}</span>
              {method.hasChargeback && (
                <div className="text-xs text-green-600 mt-1">✓ Chargeback possible</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {(formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.timeWithinChargeback}
              onChange={(e) => setFormData({...formData, timeWithinChargeback: e.target.checked})}
              className="w-5 h-5 rounded"
            />
            <span className="text-sm">
              <strong>Was this within the last 120 days?</strong>
              <br />
              <span className="text-gray-600">Most credit cards allow chargebacks within 60-120 days</span>
            </span>
          </label>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          👤 Who is the other party?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'individual', label: 'Individual Person', description: 'Private party' },
            { id: 'small_business', label: 'Small Business', description: 'Local company' },
            { id: 'corporation', label: 'Corporation', description: 'Large company' },
            { id: 'platform_seller', label: 'Online Seller', description: 'eBay, Amazon, etc.' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setFormData({...formData, opponentType: type.id})}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                formData.opponentType === type.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{type.label}</div>
              <div className="text-xs text-gray-500">{type.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          📎 What evidence do you have? <span className="text-gray-400">(check all that apply)</span>
        </label>
        <div className="space-y-3">
          {[
            { id: 'hasWrittenContract', label: 'Written contract or agreement', weight: '+25%', icon: '📄' },
            { id: 'hasEmailTrail', label: 'Email or text message trail', weight: '+15%', icon: '📧' },
            { id: 'hasPaymentRecords', label: 'Payment receipts or records', weight: '+20%', icon: '🧾' },
            { id: 'hasScreenshots', label: 'Screenshots or photos', weight: '+10%', icon: '📸' }
          ].map(evidence => (
            <label
              key={evidence.id}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData[evidence.id] 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={formData[evidence.id]}
                onChange={(e) => setFormData({...formData, [evidence.id]: e.target.checked})}
                className="w-5 h-5 rounded"
              />
              <span className="text-xl">{evidence.icon}</span>
              <span className="flex-1 font-medium">{evidence.label}</span>
              <span className="text-green-600 text-sm font-medium">{evidence.weight}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-700">Evidence Strength Score</span>
          <span className="text-2xl font-bold text-green-600">{calculateEvidenceScore()}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
            style={{ width: `${calculateEvidenceScore()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Weak</span>
          <span>Strong</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          💵 What's your time worth? (per hour)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="15"
            max="200"
            step="5"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({...formData, hourlyRate: parseInt(e.target.value)})}
            className="flex-1 accent-blue-600"
          />
          <div className="w-20 text-right">
            <span className="text-xl font-bold">${formData.hourlyRate}</span>
            <span className="text-gray-500 text-sm">/hr</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          This helps calculate the true cost of DIY options vs. professional help
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => {
    if (!results) return null;
    
    const bestPath = results[0];
    const evidenceScore = calculateEvidenceScore();
    const opponent = getOpponentProfile();

    return (
      <div className="space-y-6">
        {/* Summary Dashboard */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl">
          <h3 className="text-lg font-medium mb-4">📊 Your Case Analysis</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">${formData.disputeAmount}</div>
              <div className="text-xs text-gray-400">Claim Amount</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{evidenceScore}%</div>
              <div className="text-xs text-gray-400">Evidence Strength</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{Math.round(opponent.settlementRate * 100)}%</div>
              <div className="text-xs text-gray-400">Settlement Likelihood</div>
            </div>
          </div>

          {/* Best option highlight */}
          <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{bestPath.icon}</span>
              <div>
                <div className="text-sm text-green-300">Best Option</div>
                <div className="text-xl font-bold">{bestPath.name}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-2xl font-bold text-green-400">${Math.round(bestPath.netEV)}</div>
                <div className="text-xs text-gray-400">Expected Value</div>
              </div>
            </div>
          </div>
        </div>

        {/* Settlement Range Visualization */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4">📈 Settlement Range Estimate</h3>
          <div className="relative h-16 bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 rounded-lg">
            <div className="absolute inset-x-0 top-0 flex justify-between text-xs text-gray-500 px-2 -mt-5">
              <span>$0</span>
              <span>Full Recovery: ${formData.disputeAmount}</span>
            </div>
            
            {/* Likely settlement range */}
            <div 
              className="absolute top-2 bottom-2 bg-blue-500/30 border-2 border-blue-500 rounded"
              style={{ 
                left: `${(formData.disputeAmount * 0.3 / formData.disputeAmount) * 100}%`,
                right: `${100 - (formData.disputeAmount * 0.85 / formData.disputeAmount) * 100}%`
              }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-blue-600 whitespace-nowrap">
                Likely Range: ${Math.round(formData.disputeAmount * 0.3)} - ${Math.round(formData.disputeAmount * 0.85)}
              </div>
            </div>

            {/* EV marker */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-green-600"
              style={{ left: `${Math.min((bestPath.grossEV / formData.disputeAmount) * 100, 100)}%` }}
            >
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-green-600 whitespace-nowrap">
                EV: ${Math.round(bestPath.grossEV)}
              </div>
            </div>
          </div>
        </div>

        {/* All Pathways */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">🛤️ All Available Pathways (Ranked by Expected Value)</h3>
          <div className="space-y-3">
            {results.map((pathway, index) => (
              <PathwayCard
                key={pathway.id}
                pathway={pathway}
                isExpanded={expandedPath === pathway.id}
                onToggle={() => setExpandedPath(expandedPath === pathway.id ? null : pathway.id)}
              />
            ))}
          </div>
        </div>

        {/* Strategic Recommendation */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-3">💡 Strategic Recommendation</h3>
          <div className="text-gray-700 space-y-2">
            {bestPath.id === 'chargeback' && (
              <p><strong>Start with the chargeback.</strong> It's free, fast, and has a {bestPath.successRateDisplay}% success rate. If that fails, you can still pursue other options.</p>
            )}
            {bestPath.id === 'attorney_demand' && (
              <p><strong>An attorney demand letter is your best investment.</strong> At $350, it offers the highest ROI given your evidence strength and opponent type.</p>
            )}
            {formData.disputeAmount > 5000 && bestPath.id !== 'small_claims' && (
              <p className="text-sm text-gray-600">For amounts over $5,000, consider combining a demand letter with small claims court as a backup strategy.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const steps = [
    { num: 1, title: 'Dispute Details' },
    { num: 2, title: 'Payment & Parties' },
    { num: 3, title: 'Evidence' },
    { num: 4, title: 'Analysis' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Free Legal Analysis Tool
          </div>
          <h1 className="text-3xl font-bold mb-2">
            What's Your Case <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Really</span> Worth?
          </h1>
          <p className="text-gray-400">
            Get an honest expected value calculation with multiple resolution pathways
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex justify-between">
            {steps.map((s, i) => (
              <button
                key={s.num}
                onClick={() => s.num <= step && setStep(s.num)}
                className="flex items-center gap-2"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  s.num === step ? 'bg-blue-500 text-white' :
                  s.num < step ? 'bg-green-500 text-white' :
                  'bg-slate-700 text-gray-400'
                }`}>
                  {s.num < step ? '✓' : s.num}
                </div>
                <span className={`text-sm hidden sm:inline ${
                  s.num === step ? 'text-white font-medium' : 'text-gray-500'
                }`}>{s.title}</span>
                {i < steps.length - 1 && (
                  <div className={`w-12 h-0.5 ml-2 ${
                    s.num < step ? 'bg-green-500' : 'bg-slate-700'
                  }`}></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 text-gray-600 font-medium hover:text-gray-800"
              >
                ← Back
              </button>
            ) : <div></div>}
            
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all"
              >
                Continue →
              </button>
            ) : (
              <button className="px-8 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all">
                Get Professional Demand Letter →
              </button>
            )}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex justify-center gap-6 mt-6 text-sm text-gray-400">
          <span>⚖️ CA Bar #279869</span>
          <span>🔒 No data stored</span>
          <span>📊 1,400+ cases analyzed</span>
        </div>
      </div>
    </div>
  );
};

export default CaseValueCalculator;
