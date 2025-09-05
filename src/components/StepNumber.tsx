import React from "react";

const StepNumber: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">{children}</div>
);

export default StepNumber;
