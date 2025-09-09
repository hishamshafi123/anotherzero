import React from "react";

const CardTitle: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <h3 className={`text-white font-semibold ${className}`}>{children}</h3>
);

export default CardTitle;
