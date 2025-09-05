import React from "react";

const FilterPill: React.FC<React.PropsWithChildren<{ active?: boolean; onClick?: () => void }>> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-xl text-sm border transition ${
      active ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
    }`}
  >
    {children}
  </button>
);

export default FilterPill;
