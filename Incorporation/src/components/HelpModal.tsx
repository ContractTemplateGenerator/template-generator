import React from "react";

type HelpItem = {
  title: string;
  advantages: string[];
  disadvantages: string[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: HelpItem[];
};

export default function HelpModal({ isOpen, onClose, title, items }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-xl bg-white shadow-xl border border-gray-200 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-6 overflow-y-auto" style={{maxHeight: 'calc(80vh - 120px)'}}>
          <div className="space-y-6">
            {items.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="p-4 border-r border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-700">Advantages</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {item.advantages.map((advantage, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium text-red-700">Disadvantages</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {item.disadvantages.map((disadvantage, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">×</span>
                          {disadvantage}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}