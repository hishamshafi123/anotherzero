import React from "react";

const Badge: React.FC<React.PropsWithChildren<{ tone?: "blue" | "slate" | "green" | "yellow"; className?: string }>> = ({ children, tone = "blue", className = "" }) => {
  const toneMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-green-50 text-green-700 border-green-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs ${toneMap[tone]} ${className}`}>{children}</span>;
};

export default Badge;
