'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Play, Pause, Copy, Archive, BarChart3, MousePointer, TrendingUp, Calendar, Filter } from 'lucide-react';
import { getCampaigns, getCampaignStats, type Campaign } from '../../lib/supabase-queries';

interface CampaignsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const CampaignsPage: React.FC<CampaignsPageProps> = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [campaignStats, setCampaignStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      try {
        console.log('🚀 CampaignsPage - Starting to load data...');
        const [campaignsData, statsData] = await Promise.all([
          getCampaigns(),
          getCampaignStats()
        ]);
        console.log('✅ CampaignsPage - Data loaded:', {
          campaignsCount: campaignsData.length,
          campaigns: campaignsData,
          stats: statsData
        });
        setCampaigns(campaignsData);
        setCampaignStats(statsData);
      } catch (error) {
        console.error('❌ CampaignsPage - Error loading campaigns:', error);
      } finally {
        console.log('✅ CampaignsPage - Loading finished');
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCampaigns = useMemo(() => {
    if (statusFilter === 'all') return campaigns;
    return campaigns.filter(campaign => campaign.status === statusFilter);
  }, [campaigns, statusFilter]);

  // Loading state check after all hooks
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'instagram': return '📱';
      case 'facebook': return '👥';
      case 'both': return '🌐';
      default: return '📢';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCampaignAction = (campaignId: string, action: string) => {
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === campaignId) {
        switch (action) {
          case 'pause':
            return { ...campaign, status: 'paused' as Campaign['status'] };
          case 'resume':
            return { ...campaign, status: 'running' as Campaign['status'] };
          case 'archive':
            return { ...campaign, status: 'completed' as Campaign['status'] };
          default:
            return campaign;
        }
      }
      return campaign;
    }));
  };

  const calculateProgress = (campaign: Campaign) => {
    if (campaign.audience_size === 0) return 0;
    return Math.round(((campaign.sent ?? 0) / campaign.audience_size) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
            <p className="text-gray-400">Create and manage your marketing campaigns</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus size={18} />
            New Campaign
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{campaignStats?.totalCampaigns || 0}</div>
            <div className="text-sm text-gray-400">Total Campaigns</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <Play className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{campaignStats?.activeCampaigns || 0}</div>
            <div className="text-sm text-gray-400">Active Campaigns</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <MousePointer className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{campaignStats?.avgCtr ? (campaignStats.avgCtr * 100).toFixed(1) : 0}%</div>
            <div className="text-sm text-gray-400">Average CTR</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-600/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{campaignStats?.totalConversions || 0}</div>
            <div className="text-sm text-gray-400">Total Conversions</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex gap-2">
            {['all', 'running', 'scheduled', 'paused', 'completed', 'draft'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-600 rounded-full text-xs">
                    {campaigns.filter(c => c.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition">
            {/* Campaign Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getChannelIcon(campaign.channel)}</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{campaign.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
                      {campaign.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">{campaign.channel}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                {campaign.status === 'running' ? (
                  <button
                    onClick={() => handleCampaignAction(campaign.id, 'pause')}
                    className="p-2 hover:bg-gray-700 rounded-lg transition"
                    title="Pause Campaign"
                  >
                    <Pause size={16} className="text-yellow-400" />
                  </button>
                ) : campaign.status === 'paused' ? (
                  <button
                    onClick={() => handleCampaignAction(campaign.id, 'resume')}
                    className="p-2 hover:bg-gray-700 rounded-lg transition"
                    title="Resume Campaign"
                  >
                    <Play size={16} className="text-green-400" />
                  </button>
                ) : null}
                <button
                  className="p-2 hover:bg-gray-700 rounded-lg transition"
                  title="Duplicate Campaign"
                >
                  <Copy size={16} className="text-gray-400" />
                </button>
                <button
                  onClick={() => handleCampaignAction(campaign.id, 'archive')}
                  className="p-2 hover:bg-gray-700 rounded-lg transition"
                  title="Archive Campaign"
                >
                  <Archive size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Campaign Description */}
            {campaign.description && (
              <p className="text-sm text-gray-400 mb-4">{campaign.description}</p>
            )}

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-white font-medium">{calculateProgress(campaign)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${calculateProgress(campaign)}%` }}
                ></div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{(campaign.sent ?? 0).toLocaleString()}</div>
                <div className="text-xs text-gray-400">Sent</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">{(campaign.clicks ?? 0).toLocaleString()}</div>
                <div className="text-xs text-gray-400">Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">{campaign.ctr}%</div>
                <div className="text-xs text-gray-400">CTR</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">{campaign.conversions}</div>
                <div className="text-xs text-gray-400">Conversions</div>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">Campaign Target:</div>
              <div className="text-sm text-gray-300 capitalize">{campaign.interest_filter || 'All contacts'}</div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={12} />
                {campaign.status === 'scheduled' && campaign.schedule_start_at 
                  ? `Starts ${formatDate(campaign.schedule_start_at)}` 
                  : formatDate(campaign.created_at)}
              </div>
              <div className="text-xs text-gray-400">
                by {campaign.created_by || 'Unknown'}
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm font-medium">
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Performance Chart Section */}
      <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Campaign Performance Trends</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">7d</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">30d</button>
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">90d</button>
          </div>
        </div>

        {/* Mock Chart Placeholder */}
        <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <div className="text-gray-400">Campaign performance chart will be displayed here</div>
            <div className="text-gray-500 text-sm mt-1">CTR trends, click volumes, and conversion rates over time</div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold text-white mb-2">No campaigns found</h3>
          <p className="text-gray-400 mb-6">
            {statusFilter === 'all' 
              ? "Create your first campaign to start reaching your audience"
              : `No campaigns with ${statusFilter} status`
            }
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Create Campaign
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;