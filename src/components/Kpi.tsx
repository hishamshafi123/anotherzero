import React from "react";
import Card from "./Card";
import CardContent from "./CardContent";
import { ArrowUpRight } from "lucide-react";

const Kpi: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
  helper?: string;
}> = ({ label, value, icon, helper }) => (
  <Card>
    <CardContent className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">{icon}</div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wide text-gray-400">{label}</div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {helper && <div className="text-xs text-gray-400 mt-1">{helper}</div>}
      </div>
      <ArrowUpRight className="text-gray-500" />
    </CardContent>
  </Card>
);

export default Kpi;
