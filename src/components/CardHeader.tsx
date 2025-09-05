import React from "react";

const CardHeader: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <div className={`px-5 pt-4 pb-2 border-b border-slate-100 ${className}`}>{children}</div>
);

export default CardHeader;
