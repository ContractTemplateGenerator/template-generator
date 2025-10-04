export type Owner = { name: string; percent: number; };
type Props = {
  owner: Owner; index: number;
  onChange: (field: keyof Owner, value: string) => void;
  onRemove: () => void; canRemove: boolean;
};
export default function OwnershipRow({ owner, index, onChange, onRemove, canRemove }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr,120px,80px] items-center">
      <input
        className="input"
        placeholder={`${index === 0 ? "Primary owner" : "Additional owner"} name`}
        value={owner.name}
        onChange={(e)=>onChange("name", e.target.value)}
      />
      <input
        className="input"
        placeholder="%"
        type="number"
        min={0}
        max={100}
        value={Number.isFinite(owner.percent)?owner.percent:""}
        onChange={(e)=>onChange("percent", e.target.value)}
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className={`btn text-sm ${canRemove? "btn-secondary hover:bg-red-50 hover:text-red-600":"opacity-40 cursor-not-allowed"}`}
      >
        Remove
      </button>
    </div>
  );
}