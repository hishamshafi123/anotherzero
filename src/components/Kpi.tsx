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
      <div className="p-2 rounded-xl bg-blue-50 text-blue-700">{icon}</div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {helper && <div className="text-xs text-slate-500 mt-1">{helper}</div>}
      </div>
      <ArrowUpRight className="text-slate-300" />
    </CardContent>
  </Card>
);

export default Kpi;
