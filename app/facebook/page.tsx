'use client';
import React, { useState, useMemo } from 'react';
import { Facebook, Users, MessageCircle, ThumbsUp, TrendingUp, Clock, BarChart3, Activity, Eye, Share2, Target } from 'lucide-react';
import { MOCK_CONTACTS, MOCK_CAMPAIGNS, getChannelStats, type Contact, type Campaign } from '@/lib/mock-data';

interface FacebookPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const FacebookPage: React.FC<FacebookPageProps> = ({ searchParams }) => {
  const [timeRange, setTimeRange] = useState('30d');
  
  const facebookStats = getChannelStats('facebook');
  const facebookContacts = MOCK_CONTACTS.filter(c => c.source === 'facebook');
  const facebookCampaigns = MOCK_CAMPAIGNS.filter(c => c.channel === 'facebook' || c.channel === 'both');

  // Mock recent activity data
  const recentActivity = [
    {
      id: '1',
      type: 'comment',
      contact: 'mike.wellness',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      message: 'Great tips! Just what I needed for my fitness journey',
      time: '3 minutes ago',
      post_type: 'post'
    },
    {
      id: '2',
      type: 'message',
      contact: 'david.strong',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      message: 'Can you tell me more about your workout programs?',
      time: '8 minutes ago',
      post_type: 'messenger'
    },
    {
      id: '3',
      type: 'reaction',
      contact: 'alex.trainer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      message: 'Reacted 💪 to your post about protein supplements',
      time: '15 minutes ago',
      post_type: 'post'
    },
    {
      id: '4',
      type: 'share',
      contact: 'fitness.coach.sam',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
      message: 'Shared your workout routine post',
      time: '32 minutes ago',
      post_type: 'post'
    }
  ];

  // Mock audience insights
  const audienceInsights = {
    demographics: {
      age_groups: [
        { range: '18-24', percentage: 15 },
        { range: '25-34', percentage: 35 },
        { range: '35-44', percentage: 28 },
        { range: '45-54', percentage: 16 },
        { range: '55+', percentage: 6 }
      ],
      gender: {
        male: 58,
        female: 42
      },
      top_locations: [
        { city: 'Los Angeles, CA', percentage: 18 },
        { city: 'New York, NY', percentage: 15 },
        { city: 'Chicago, IL', percentage: 12 },
        { city: 'Houston, TX', percentage: 10 },
        { city: 'Miami, FL', percentage: 8 }
      ]
    }
  };

  // Mock engagement metrics
  const engagementData = {
    pageViews: 12560,
    pageFollowers: 8430,
    postEngagements: 2340,
    messageResponses: 156,
    avgResponseTime: '14m',
    reachGrowth: '+18%'
  };

  // Top performing posts
  const topPosts = [
    {
      id: '1',
      type: 'post',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      content: 'Transform your morning routine with these 5 simple exercises! 💪 Perfect for beginners.',
      likes: 1240,
      comments: 67,
      shares: 45,
      engagement_rate: 7.8,
      reach: 18500,
      posted_at: '2024-09-02T10:00:00Z'
    },
    {
      id: '2',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
      content: '3-minute HIIT workout you can do anywhere - no equipment needed!',
      likes: 2180,
      comments: 124,
      shares: 89,
      engagement_rate: 9.2,
      reach: 25800,
      posted_at: '2024-09-01T16:30:00Z'
    },
    {
      id: '3',
      type: 'carousel',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      content: 'Meal prep ideas for busy professionals - slide to see all 5 recipes!',
      likes: 890,
      comments: 43,
      shares: 67,
      engagement_rate: 6.4,
      reach: 15600,
      posted_at: '2024-08-31T12:15:00Z'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageCircle size={16} className="text-blue-400" />;
      case 'message': return <MessageCircle size={16} className="text-purple-400" />;
      case 'reaction': return <ThumbsUp size={16} className="text-green-400" />;
      case 'share': return <Share2 size={16} className="text-orange-400" />;
      default: return <Activity size={16} className="text-gray-400" />;
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return '📝';
      case 'video': return '🎥';
      case 'carousel': return '🖼️';
      default: return '📱';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Facebook className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Facebook Analytics</h1>
              <p className="text-gray-400">Monitor your Facebook page performance and audience insights</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-sm text-green-400 font-medium">+8%</div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{facebookStats.totalContacts}</div>
            <div className="text-sm text-gray-400">Facebook Contacts</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-sm text-green-400 font-medium">+15%</div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{facebookStats.interestedRate}%</div>
            <div className="text-sm text-gray-400">Interest Rate</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Eye className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-sm text-green-400 font-medium">{engagementData.reachGrowth}</div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{engagementData.pageViews.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Page Views</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-sm text-blue-400 font-medium">{engagementData.avgResponseTime}</div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{engagementData.messageResponses}</div>
            <div className="text-sm text-gray-400">Messages This Month</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Page Performance */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Page Performance</h3>
              <button className="text-sm text-gray-400 hover:text-white transition">View Insights</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{engagementData.pageFollowers.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Page Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">{engagementData.postEngagements.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Post Engagements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{engagementData.avgResponseTime}</div>
                <div className="text-xs text-gray-400">Avg Response Time</div>
              </div>
            </div>
          </div>

          {/* Top Performing Posts */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Top Performing Posts</h3>
              <button className="text-sm text-gray-400 hover:text-white transition">View All Posts</button>
            </div>
            <div className="space-y-4">
              {topPosts.map((post) => (
                <div key={post.id} className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                  <div className="relative">
                    <img 
                      src={post.thumbnail} 
                      alt="Post thumbnail"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="absolute -top-1 -right-1 text-lg">
                      {getPostTypeIcon(post.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1 line-clamp-2">{post.content}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{formatTime(post.posted_at)}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <ThumbsUp size={14} /> {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={14} /> {post.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 size={14} /> {post.shares}
                        </span>
                      </div>
                      <span className="text-blue-400">Reach: {post.reach.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-400 mb-1">{post.engagement_rate}%</div>
                    <div className="text-xs text-gray-400">Engagement</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Facebook Campaigns</h3>
              <button className="text-sm text-gray-400 hover:text-white transition">Manage Campaigns</button>
            </div>
            <div className="space-y-4">
              {facebookCampaigns.slice(0, 3).map((campaign) => (
                <div key={campaign.id} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">{campaign.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      campaign.status === 'running' 
                        ? 'bg-green-100 text-green-800' 
                        : campaign.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-white">{campaign.sent.toLocaleString()}</div>
                      <div className="text-gray-400">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-400">{campaign.clicks.toLocaleString()}</div>
                      <div className="text-gray-400">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-400">{campaign.ctr}%</div>
                      <div className="text-gray-400">CTR</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-400">{campaign.conversions}</div>
                      <div className="text-gray-400">Conversions</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <img 
                    src={activity.avatar} 
                    alt={activity.contact}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getActivityIcon(activity.type)}
                      <span className="font-medium text-white text-sm">{activity.contact}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{activity.message}</p>
                    <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audience Demographics */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Audience Demographics</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            
            {/* Age Groups */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Age Groups</h4>
              <div className="space-y-2">
                {audienceInsights.demographics.age_groups.map((group) => (
                  <div key={group.range} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{group.range}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(group.percentage / 35) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-white w-8 text-right">{group.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender Split */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Gender Split</h4>
              <div className="flex gap-4">
                <div className="flex-1 text-center">
                  <div className="text-xl font-bold text-blue-400">{audienceInsights.demographics.gender.male}%</div>
                  <div className="text-xs text-gray-400">Male</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xl font-bold text-pink-400">{audienceInsights.demographics.gender.female}%</div>
                  <div className="text-xs text-gray-400">Female</div>
                </div>
              </div>
            </div>

            {/* Top Locations */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Top Locations</h4>
              <div className="space-y-2">
                {audienceInsights.demographics.top_locations.map((location) => (
                  <div key={location.city} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{location.city}</span>
                    <span className="text-sm text-blue-400">{location.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Create Facebook Campaign
              </button>
              <button className="w-full text-left p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                Export Facebook Contacts
              </button>
              <button className="w-full text-left p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                View Page Insights
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacebookPage;