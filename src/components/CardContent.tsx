import React from "react";

const CardContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

export default CardContent;
