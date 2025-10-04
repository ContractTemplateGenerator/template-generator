import React from "react";
type Props = { open:boolean; onClose:()=>void; title?:string; children:React.ReactNode; };
export default function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-base font-semibold">{title ?? "Preview"}</h3>
          <button onClick={onClose} className="btn-ghost rounded-xl">Close</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}