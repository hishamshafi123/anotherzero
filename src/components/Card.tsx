import React from "react";

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-2xl shadow-sm ${className}`}>{children}</div>
);

export default Card;
