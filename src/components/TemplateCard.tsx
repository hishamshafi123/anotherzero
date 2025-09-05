import React from "react";

interface TemplateCardProps {
  title: string;
  body: string;
  onDuplicate?: () => void;
  onEdit?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ title, body, onDuplicate, onEdit }) => (
  <div className="border border-slate-200 rounded-xl p-3">
    <div className="text-xs uppercase tracking-wide text-slate-500">{title}</div>
    <div className="mt-1 text-slate-900">{body}</div>
    <div className="mt-2 flex items-center gap-2">
      <button 
        onClick={onDuplicate}
        className="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
      >
        Duplicate
      </button>
      <button 
        onClick={onEdit}
        className="rounded-lg bg-slate-900 text-white px-2 py-1 text-xs hover:bg-black"
      >
        Edit
      </button>
    </div>
  </div>
);

export default TemplateCard;
