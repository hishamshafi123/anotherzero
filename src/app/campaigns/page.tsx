'use client';
import React, { useState, useMemo } from 'react';
import { Play, Pause, BarChart3, Users, MousePointer, Plus, Calendar, Filter } from 'lucide-react';
import { MOCK_CAMPAIGNS, getCampaignStats } from '@/lib/mock-data';

const STATUS_COLORS = {
  running: 'bg-green-100 text-green-800 border-green-200',
  scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
  paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  draft: 'bg-purple-100 text-purple-800 border-purple-200',
};

const CHANNEL_COLORS = {
  instagram: 'bg-purple-100 text-purple-800 border-purple-200',
  facebook: 'bg-blue-100 text-blue-800 border-blue-200',
  both: 'bg-gradient-to-r from-purple-100 to-blue-100 text-gray-800 border-gray-200',
};

export default function CampaignsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  
  const campaignStats = getCampaignStats();
  
  const filteredCampaigns = useMemo(() => {
    return MOCK_CAMPAIGNS.filter(campaign => {
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      const matchesChannel = channelFilter === 'all' || campaign.channel === channelFilter || campaign.channel === 'both';
      return matchesStatus && matchesChannel;
    });
  }, [statusFilter, channelFilter]);
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4 text-green-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Campaigns</h1>
          <p className="text-gray-400 mt-1">Manage your Instagram and Facebook campaigns</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition">
          <Plus size={16} /> New Campaign
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Campaigns</p>
              <p className="text-2xl font-semibold text-white">{campaignStats.totalCampaigns}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-semibold text-white">{campaignStats.activeCampaigns}</p>
            </div>
            <Play className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Sent</p>
              <p className="text-2xl font-semibold text-white">{campaignStats.totalSent.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. CTR</p>
              <p className="text-2xl font-semibold text-white">{campaignStats.avgCTR.toFixed(1)}%</p>
            </div>
            <MousePointer className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Conversions</p>
              <p className="text-2xl font-semibold text-white">{campaignStats.totalConversions}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter by:</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="running">Running</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
            
            {/* Channel Filter */}
            <select 
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Channels</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="both">Both</option>
            </select>
          </div>
          
          <div className="ml-auto text-sm text-gray-400">
            {filteredCampaigns.length} of {MOCK_CAMPAIGNS.length} campaigns
          </div>
        </div>
      </div>
      
      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition">
            {/* Campaign Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{campaign.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{campaign.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {getStatusIcon(campaign.status)}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                  STATUS_COLORS[campaign.status as keyof typeof STATUS_COLORS]
                }`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </div>
            </div>
            
            {/* Campaign Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Channel</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                  CHANNEL_COLORS[campaign.channel as keyof typeof CHANNEL_COLORS]
                }`}>
                  {campaign.channel === 'both' ? 'Instagram + Facebook' : 
                   campaign.channel.charAt(0).toUpperCase() + campaign.channel.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Audience</span>
                <span className="text-sm text-white font-medium">{campaign.audience_size.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Created</span>
                <span className="text-sm text-gray-300">{formatDate(campaign.created_at)}</span>
              </div>
              
              {campaign.status === 'scheduled' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Starts</span>
                  <span className="text-sm text-blue-400">{formatDate(campaign.schedule_start_at)}</span>
                </div>
              )}
            </div>
            
            {/* Performance Metrics */}
            {campaign.sent > 0 && (
              <div className="border-t border-gray-700 pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-400">Sent</p>
                    <p className="text-lg font-semibold text-white">{campaign.sent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Clicks</p>
                    <p className="text-lg font-semibold text-white">{campaign.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">CTR</p>
                    <p className="text-lg font-semibold text-white">{campaign.ctr.toFixed(1)}%</p>
                  </div>
                </div>
                
                {/* CTR Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Click-through Rate</span>
                    <span className="text-gray-300">{campaign.ctr.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all" 
                      style={{ width: `${Math.min(campaign.ctr, 25) * 4}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Variants Info */}
            {campaign.variants.length > 1 && (
              <div className="border-t border-gray-700 pt-4 mt-4">
                <p className="text-xs text-gray-400 mb-2">A/B Testing ({campaign.variants.length} variants)</p>
                <div className="space-y-2">
                  {campaign.variants.slice(0, 2).map((variant, index) => (
                    <div key={variant.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">{variant.name}</span>
                      <span className="text-gray-400">{variant.weight}% • {variant.ctr.toFixed(1)}% CTR</span>
                    </div>
                  ))}
                  {campaign.variants.length > 2 && (
                    <p className="text-xs text-gray-500">+{campaign.variants.length - 2} more variants</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
              {campaign.status === 'running' && (
                <button className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition">
                  Pause
                </button>
              )}
              {campaign.status === 'paused' && (
                <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
                  Resume
                </button>
              )}
              {campaign.status === 'draft' && (
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                  Launch
                </button>
              )}
              <button className="flex-1 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCampaigns.length === 0 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
          <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No campaigns found</h3>
          <p className="text-gray-400 mb-4">No campaigns match your current filters.</p>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition">
            <Plus size={16} /> Create Your First Campaign
          </button>
        </div>
      )}
    </div>
  );
}