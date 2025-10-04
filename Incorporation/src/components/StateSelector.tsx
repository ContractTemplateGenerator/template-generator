import { useState } from "react";
import { STATE_NAMES } from "../utils/states";

type StateData = {
  name: string;
  popular?: boolean;
  annualReport?: string;
  advantages: string[];
  disadvantages: string[];
  fees: { LLC: number; Corp: number };
};

const STATE_DATA: Record<string, StateData> = {
  DE: {
    name: "Delaware",
    popular: true,
    annualReport: "LLC: $300 due June 1st | Corp: Report + tax due March 1st",
    advantages: [
      "Most business-friendly court system",
      "Strong legal precedents for business disputes",
      "Next-day filing available for $1,000"
    ],
    disadvantages: [
      "Corp: Franchise tax spikes with >5,000 authorized shares",
      "Initial filing costs $89-90",
      "Must pay tax even with no income"
    ],
    fees: { LLC: 90, Corp: 89 }
  },
  CA: {
    name: "California",
    annualReport: "Biennial report $20 every 2 years",
    advantages: [
      "Home state advantages if you live here",
      "Established business infrastructure",
      "No registered agent required if resident"
    ],
    disadvantages: [
      "Annual franchise tax $800 minimum (LLC first-year waiver ended 2023)",
      "Complex compliance requirements",
      "Initial filing fees $70-100",
      "Must pay tax even with no income"
    ],
    fees: { LLC: 70, Corp: 100 }
  }
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentState: string;
  onSelectState: (state: string) => void;
  entity: string;
};

export default function StateSelector({ isOpen, onClose, currentState, onSelectState, entity }: Props) {
  const [selectedState, setSelectedState] = useState(currentState);

  if (!isOpen) return null;

  const handleSelect = () => {
    onSelectState(selectedState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-xl bg-white shadow-xl border border-gray-200 max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Choose Your State of Incorporation</h3>
            <p className="text-sm text-gray-600 mt-1">Compare states and select the best option for your business</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-lg">ℹ</span>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-800 mb-2">When Can You Choose Any State?</h4>
                <div className="text-sm text-blue-700 space-y-2">
                  <p><strong>You can incorporate in ANY state if:</strong></p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>No physical presence required (SaaS, AI platforms, e-commerce)</li>
                    <li>No employees in your home state</li>
                    <li>No nexus/substantial business activity in expensive states</li>
                  </ul>
                  <p><strong>Must use home state if:</strong> Physical office, employees, or substantial business presence in that state.</p>
                  <p className="font-medium">💡 Many clients save thousands by choosing Delaware over California, New York, or other high-fee states.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {Object.entries(STATE_DATA).map(([stateCode, stateData]) => (
              <div
                key={stateCode}
                onClick={() => setSelectedState(stateCode)}
                className={`border-2 rounded-xl p-5 cursor-pointer transition-colors ${
                  selectedState === stateCode
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedState === stateCode
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}>
                      {selectedState === stateCode && <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-semibold text-gray-900">{stateData.name}</h4>
                        {stateData.popular && (
                          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                            Most Popular
                          </span>
                        )}
                      </div>
                      {stateData.annualReport && (
                        <div className="text-sm text-gray-600 mt-1">{stateData.annualReport}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">${stateData.fees[entity as keyof typeof stateData.fees]}</div>
                    <div className="text-sm text-gray-500">State filing fee</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-700 text-sm">Advantages</span>
                    </div>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {stateData.advantages.map((advantage, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500 text-xs mt-0.5">✓</span>
                          <span>{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="font-medium text-orange-700 text-sm">Considerations</span>
                    </div>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {stateData.disadvantages.map((disadvantage, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-orange-500 text-xs mt-0.5">!</span>
                          <span>{disadvantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <div className="text-sm text-gray-600">
            Selected: <span className="font-medium">{STATE_DATA[selectedState]?.name}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn-secondary px-6 py-3 min-h-[44px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              className="btn-primary px-6 py-3 min-h-[44px]"
            >
              Select {STATE_DATA[selectedState]?.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}