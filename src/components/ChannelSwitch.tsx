import React from "react";
import type { Channel } from '@/hooks/use-dashboard-filters';

interface ChannelSwitchProps {
  value: Channel;
  onChange: (v: Channel) => void;
}

const ChannelSwitch: React.FC<ChannelSwitchProps> = ({ value, onChange }) => (
  <div className="inline-flex rounded-xl border border-gray-600 overflow-hidden">
    {(["All", "Instagram", "Facebook"] as const).map((v: Channel) => (
      <button
        key={v}
        onClick={() => onChange(v)}
        className={`px-3 py-2 text-sm transition ${value === v ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
        aria-pressed={value === v}
      >
        {v}
      </button>
    ))}
  </div>
);

export default ChannelSwitch;
