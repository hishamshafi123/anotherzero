'use client';
import React from "react";
import { useRouter } from 'next/navigation';
import { Plus, Search } from "lucide-react";
import FilterPill from "./FilterPill";
import ChannelSwitch from "./ChannelSwitch";
import { useDashboardFilters } from '@/hooks/use-dashboard-filters';

const Topbar: React.FC = () => {
  const router = useRouter();
  const { filters, setTimeRange, setChannel } = useDashboardFilters();

  const handleNewCampaign = () => {
    console.log('Navigating to new campaign page');
    router.push('/new-campaign');
  };

  return (
    <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur border-b border-gray-700">
      <div className="px-5 py-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search contacts, campaigns, messages…"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="hidden md:flex items-center gap-2">
          <FilterPill active={filters.timeRange === "7d"} onClick={() => setTimeRange("7d")}>
            7d
          </FilterPill>
          <FilterPill active={filters.timeRange === "30d"} onClick={() => setTimeRange("30d")}>
            30d
          </FilterPill>
          <FilterPill active={filters.timeRange === "90d"} onClick={() => setTimeRange("90d")}>
            90d
          </FilterPill>
        </div>

        <div className="flex items-center gap-2">
          <ChannelSwitch value={filters.channel} onChange={setChannel} />
          <button 
            onClick={handleNewCampaign}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition"
          >
            <Plus size={16} /> New Campaign
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
