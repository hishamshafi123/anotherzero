import React from "react";

interface TemplateCardProps {
  title: string;
  body: string;
  onDuplicate?: () => void;
  onEdit?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ title, body, onDuplicate, onEdit }) => (
  <div className="border border-gray-700 rounded-xl p-3 bg-gray-800/50">
    <div className="text-xs uppercase tracking-wide text-gray-400">{title}</div>
    <div className="mt-1 text-white">{body}</div>
    <div className="mt-2 flex items-center gap-2">
      <button 
        onClick={onDuplicate}
        className="rounded-lg border border-gray-600 px-2 py-1 text-xs text-gray-300 hover:bg-gray-700"
      >
        Duplicate
      </button>
      <button 
        onClick={onEdit}
        className="rounded-lg bg-blue-600 text-white px-2 py-1 text-xs hover:bg-blue-700"
      >
        Edit
      </button>
    </div>
  </div>
);

export default TemplateCard;
