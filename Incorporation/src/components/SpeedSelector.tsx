export type SpeedId = "standard"|"expedite"|"rush";

const STATE_EXPEDITED_FEES: Record<string, { expedited: number; rush: number }> = {
  'CA': { expedited: 350, rush: 500 }, // 24hr: $350, 4hr: $500
  'NY': { expedited: 25, rush: 75 },   // 24hr: $25, same day: $75
  'TX': { expedited: 25, rush: 50 },   // Next day: $25, estimated same day: $50
  'DE': { expedited: 50, rush: 100 },  // 24hr: $50, faster options available
  'AZ': { expedited: 35, rush: 70 },   // Expedited: $35, estimated rush: $70
  'MT': { expedited: 20, rush: 40 },   // 24hr: $20, estimated rush: $40
  'NV': { expedited: 50, rush: 100 },  // Estimated based on typical fees
  'WY': { expedited: 50, rush: 100 },  // Estimated based on typical fees
  'GA': { expedited: 50, rush: 100 },  // Estimated based on typical fees
  'FL': { expedited: 50, rush: 100 },  // Limited expedited options
  'CO': { expedited: 50, rush: 100 },  // Estimated based on typical fees
};

export const SPEEDS: Record<SpeedId, {label:string, description:string, timeline: string, price: number}> = {
  standard: { label:"Standard", description: "I file in 3 business days, state processes in 1-2 weeks", timeline: "15-20 days total", price: 0 },
  expedite: { label:"Expedited", description: "I file next business day, state processes in 2 business days", timeline: "3-5 days total", price: 99 },
  rush: { label:"Rush", description: "I file same day (if submitted before 10am PT), state processes next business day", timeline: "1-2 days total", price: 199 }
};
type Props = { selected: SpeedId; onSelect:(id:SpeedId)=>void; state: string; };
export default function SpeedSelector({ selected, onSelect, state }: Props) {
  // Calculate dynamic pricing based on state
  const getStatePrice = (basePrice: number, type: 'expedite' | 'rush') => {
    const fees = STATE_EXPEDITED_FEES[state] || { expedited: 50, rush: 100 };
    const stateFee = type === 'expedite' ? fees.expedited : fees.rush;
    return stateFee + 49; // State fee + $49 profit
  };

  const speeds = {
    standard: SPEEDS.standard,
    expedite: { ...SPEEDS.expedite, price: getStatePrice(0, 'expedite') },
    rush: { ...SPEEDS.rush, price: getStatePrice(0, 'rush') }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {Object.entries(speeds).map(([id, meta])=>{
        const active = id===selected;
        return (
          <button
            key={id}
            type="button"
            onClick={()=>onSelect(id as SpeedId)}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              active
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="font-medium text-gray-900">{meta.label}</div>
            <div className="text-xs text-gray-600 mt-1">{meta.description}</div>
            <div className="text-sm font-medium text-gray-900 mt-1">{meta.timeline}</div>
            <div className="text-sm font-medium text-blue-600 mt-1">
              {meta.price > 0 ? `+$${meta.price}` : "Included"}
            </div>
          </button>
        );
      })}
    </div>
  );
}