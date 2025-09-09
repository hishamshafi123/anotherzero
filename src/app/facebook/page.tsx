'use client';
import React, { useState, useEffect } from 'react';
import { Facebook, Users, TrendingUp, MessageSquare, Target, Activity, Eye, Share2, Trophy, BarChart3 } from 'lucide-react';
import { getChannelStats, getContactsByChannel, getCampaignsByChannel, type Contact, type Campaign } from '@/lib/supabase-queries';

export default function FacebookPage() {
  const [facebookContacts, setFacebookContacts] = useState<Contact[]>([]);
  const [facebookCampaigns, setFacebookCampaigns] = useState<Campaign[]>([]);
  const [facebookStats, setFacebookStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      try {
        const [contactsData, campaignsData, statsData] = await Promise.all([
          getContactsByChannel('facebook'),
          getCampaignsByChannel('facebook'),
          getChannelStats('facebook')
        ]);
        setFacebookContacts(contactsData);
        setFacebookCampaigns(campaignsData);
        setFacebookStats(statsData);
      } catch (error) {
        console.error('Error loading Facebook data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Facebook data...</p>
        </div>
      </div>
    );
  }
  
  const topPerformers = facebookContacts
    .sort((a, b) => b.engagement_score - a.engagement_score)
    .slice(0, 5);
  
  const recentActivity: any[] = []; // Placeholder until events table is implemented
  
  const topInterests = ['Fitness', 'Nutrition', 'Weight Loss', 'Supplements', 'Wellness'];
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Facebook className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-white">Facebook</h1>
        </div>
        <p className="text-gray-400">Monitor Facebook activity and engagement</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Contacts</p>
              <p className="text-2xl font-semibold text-white">{facebookStats.totalContacts}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Interest Rate</p>
              <p className="text-2xl font-semibold text-white">{facebookStats.interestedRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Engagement</p>
              <p className="text-2xl font-semibold text-white">{facebookStats.avgEngagement}</p>
            </div>
            <Activity className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Campaigns</p>
              <p className="text-2xl font-semibold text-white">{facebookStats.activeCampaigns}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Recent Facebook Activity</h2>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const contact = facebookContacts.find(c => c.id === activity.contact_id);
              if (!contact) return null;
              
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-750 rounded-lg">
                  <img
                    src={contact.avatar_url}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white text-sm">{contact.handle}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{formatDate(activity.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-300">{activity.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {activity.type === 'click' && <Eye className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-green-500" />}
                    {activity.type === 'campaign' && <Share2 className="h-4 w-4 text-blue-500" />}
                  </div>
                </div>
              );
            })}
          </div>
          
          <button className="w-full mt-4 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition text-sm">
            View All Activity
          </button>
        </div>
        
        {/* Top Interests */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Top Interests</h2>
          </div>
          
          <div className="space-y-3">
            {topInterests.map((interest, index) => (
              <div key={interest} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-400 w-6 text-center">#{index + 1}</span>
                  <span className="text-sm font-medium text-blue-400">{interest}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-gray-400">{Math.floor(Math.random() * 30) + 15} contacts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-white">Top Performing Contacts</h2>
          </div>
          
          <div className="space-y-4">
            {topPerformers.map((contact, index) => (
              <div key={contact.id} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700 text-xs font-medium text-gray-300">
                  {index + 1}
                </div>
                <img
                  src={contact.avatar_url}
                  alt={contact.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-medium text-white text-sm">{contact.name}</div>
                  <div className="text-xs text-gray-400">{contact.handle}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{contact.engagement_score}</div>
                  <div className="text-xs text-gray-400">engagement</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Campaign Performance */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Campaign Performance</h2>
          </div>
          
          <div className="space-y-4">
            {facebookCampaigns.slice(0, 3).map((campaign) => (
              <div key={campaign.id} className="p-4 bg-gray-750 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white text-sm">{campaign.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'running' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-400">Sent</p>
                    <p className="text-sm font-medium text-white">{campaign.sent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Clicks</p>
                    <p className="text-sm font-medium text-white">{campaign.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">CTR</p>
                    <p className="text-sm font-medium text-blue-400">{campaign.ctr.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
            View All Campaigns
          </button>
        </div>
      </div>
      
      {/* Audience Insights */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-white">Audience Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Age Demographics</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">25-34</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                  <span className="text-xs text-gray-400">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">35-44</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }} />
                  </div>
                  <span className="text-xs text-gray-400">30%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">18-24</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }} />
                  </div>
                  <span className="text-xs text-gray-400">25%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Gender Split</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Female</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '58%' }} />
                  </div>
                  <span className="text-xs text-gray-400">58%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Male</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }} />
                  </div>
                  <span className="text-xs text-gray-400">42%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Peak Activity</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">7-9 PM</span>
                <span className="text-xs text-blue-400">Peak engagement</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">12-2 PM</span>
                <span className="text-xs text-gray-400">Lunch break activity</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Weekend</span>
                <span className="text-xs text-gray-400">35% higher response</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-blue-500 transition group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Create Facebook Campaign</div>
              <div className="text-sm text-gray-400">Launch a new targeted campaign</div>
            </div>
          </div>
        </button>
        
        <button className="p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-blue-500 transition group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Manage Contacts</div>
              <div className="text-sm text-gray-400">View and organize your contacts</div>
            </div>
          </div>
        </button>
        
        <button className="p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-blue-500 transition group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Analytics Dashboard</div>
              <div className="text-sm text-gray-400">Deep dive into performance data</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}