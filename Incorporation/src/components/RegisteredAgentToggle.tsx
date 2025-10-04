export default function RegisteredAgentToggle({ selected, onToggle }:{selected:boolean; onToggle:(v:boolean)=>void;}) {
  return (
    <button type="button" onClick={()=>onToggle(!selected)}
      className={`chip ${selected? "border-brand-300 bg-brand-50 text-brand-700":"border-slate-300 hover:bg-slate-50"}`}>
      Registered Agent
    </button>
  );
}