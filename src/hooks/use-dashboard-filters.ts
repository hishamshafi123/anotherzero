'use client';
import { useState, useCallback } from 'react';

export type TimeRange = '7d' | '30d' | '90d';
export type Channel = 'All' | 'Instagram' | 'Facebook';

export interface DashboardFilters {
  timeRange: TimeRange;
  channel: Channel;
}

export const useDashboardFilters = () => {
  const [filters, setFilters] = useState<DashboardFilters>({
    timeRange: '30d',
    channel: 'All'
  });

  const setTimeRange = useCallback((timeRange: TimeRange) => {
    console.log('Time range filter changed:', timeRange);
    setFilters(prev => ({ ...prev, timeRange }));
  }, []);

  const setChannel = useCallback((channel: Channel) => {
    console.log('Channel filter changed:', channel);
    setFilters(prev => ({ ...prev, channel }));
  }, []);

  const resetFilters = useCallback(() => {
    console.log('Filters reset to defaults');
    setFilters({
      timeRange: '30d',
      channel: 'All'
    });
  }, []);

  return {
    filters,
    setTimeRange,
    setChannel,
    resetFilters
  };
};