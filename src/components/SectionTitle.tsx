import React from "react";

const SectionTitle: React.FC<React.PropsWithChildren<{ right?: React.ReactNode }>> = ({ children, right }) => (
  <div className="flex items-center justify-between mb-3">
    <h4 className="text-white font-semibold">{children}</h4>
    <div className="flex items-center gap-2">{right}</div>
  </div>
);

export default SectionTitle;
