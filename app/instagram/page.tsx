'use client';
import React, { useState, useMemo } from 'react';
import { Instagram, Users, MessageCircle, Heart, TrendingUp, Clock, Tag, Activity, Eye, Share2 } from 'lucide-react';
import { MOCK_CONTACTS, MOCK_CAMPAIGNS, getChannelStats, type Contact, type Campaign } from '@/lib/mock-data';

interface InstagramPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const InstagramPage: React.FC<InstagramPageProps> = ({ searchParams }) => {
  const [timeRange, setTimeRange] = useState('30d');
  
  const instagramStats = getChannelStats('instagram');
  const instagramContacts = MOCK_CONTACTS.filter(c => c.source === 'instagram');
  const instagramCampaigns = MOCK_CAMPAIGNS.filter(c => c.channel === 'instagram' || c.channel === 'both');

  // Mock recent activity data
  const recentActivity = [
    {
      id: '1',
      type: 'comment',
      contact: '@sarah_fitness',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b193?w=40&h=40&fit=crop&crop=face',
      message: 'This looks amazing! Where can I get this?',
      time: '2 minutes ago',
      post_type: 'story'
    },
    {
      id: '2',
      type: 'dm',
      contact: '@fitness_jenny',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      message: 'Tell me more about your supplement recommendations',
      time: '5 minutes ago',
      post_type: 'post'
    },
    {
      id: '3',
      type: 'story_view',
      contact: '@healthy_lisa',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
      message: 'Viewed your story about protein timing',
      time: '12 minutes ago',
      post_type: 'story'
    },
    {
      id: '4',
      type: 'follow',
      contact: '@mike_gains',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      message: 'Started following you',
      time: '25 minutes ago',
      post_type: 'profile'
    }
  ];

  // Mock trending hashtags
  const trendingHashtags = [
    { tag: '#fitness', count: 1243, growth: '+12%' },
    { tag: '#supplements', count: 987, growth: '+8%' },
    { tag: '#workout', count: 756, growth: '+15%' },
    { tag: '#nutrition', count: 654, growth: '+5%' },
    { tag: '#healthy', count: 543, growth: '+22%' },
    { tag: '#protein', count: 432, growth: '+18%' }
  ];

  // Mock engagement metrics
  const engagementData = {
    totalReach: 15420,
    impressions: 23870,
    engagementRate: 4.8,
    avgTimeSpent: '2m 34s',
    storyCompletionRate: 78,
    saveRate: 12.3
  };

  // Top performing posts
  const topPosts = [
    {
      id: '1',
      type: 'post',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      caption: 'Morning protein smoothie recipe 💪',
      likes: 2340,
      comments: 87,
      shares: 23,
      engagement_rate: 6.2,
      posted_at: '2024-09-02T08:00:00Z'
    },
    {
      id: '2',
      type: 'reel',
      thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
      caption: '5 exercises for home workouts',
      likes: 3540,
      comments: 124,
      shares: 89,
      engagement_rate: 8.4,
      posted_at: '2024-09-01T14:30:00Z'
    },
    {
      id: '3',
      type: 'story',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      caption: 'Quick HIIT session',
      views: 1870,
      replies: 34,
      engagement_rate: 5.8,
      posted_at: '2024-09-03T16:15:00Z'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageCircle size={16} className="text-blue-400" />;
      case 'dm': return <MessageCircle size={16} className="text-purple-400" />;
      case 'story_view': return <Eye size={16} className="text-green-400" />;
      case 'follow': return <Users size={16} className="text-pink-400" />;
      default: return <Activity size={16} className="text-gray-400" />;
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return '📷';
      case 'reel': return '🎬';
      case 'story': return '🎭';
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
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Instagram Analytics</h1>
              <p className="text-gray-400">Track your Instagram performance and engagement</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
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
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                <Users className="h-6 w-6 text-pink-400" />
              </div>
              <div className="text-sm text-green-400 font-medium">+12%</div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{instagramStats.totalContacts}</div>
            <div className="text-sm text-gray-400">Instagram Contacts</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                <Heart className="h-6 w-6 text-pink-400" />
              </div>
              <div className="text-sm text-green-400 font-medium">+8%</div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{instagramStats.interestedRate}%</div>
            <div className="text-sm text-gray-400">Interest Rate</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-pink-400" />
              </div>
              <div className="text-sm text-green-400 font-medium">+15%</div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{engagementData.engagementRate}%</div>
            <div className="text-sm text-gray-400">Engagement Rate</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                <Activity className="h-6 w-6 text-pink-400" />
              </div>
              <div className="text-sm text-green-400 font-medium">+5%</div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{instagramStats.activeCampaigns}</div>
            <div className="text-sm text-gray-400">Active Campaigns</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Engagement Overview */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Engagement Overview</h3>
              <button className="text-sm text-gray-400 hover:text-white transition">View Details</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{engagementData.totalReach.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Total Reach</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">{engagementData.impressions.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Impressions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{engagementData.storyCompletionRate}%</div>
                <div className="text-xs text-gray-400">Story Completion</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">{engagementData.saveRate}%</div>
                <div className="text-xs text-gray-400">Save Rate</div>
              </div>
            </div>
          </div>

          {/* Top Performing Posts */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Top Performing Content</h3>
              <button className="text-sm text-gray-400 hover:text-white transition">View All</button>
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
                    <h4 className="font-medium text-white mb-1">{post.caption}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{formatTime(post.posted_at)}</span>
                      <div className="flex items-center gap-3">
                        {post.type === 'story' ? (
                          <>
                            <span className="flex items-center gap-1">
                              <Eye size={14} /> {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle size={14} /> {post.replies}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center gap-1">
                              <Heart size={14} /> {post.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle size={14} /> {post.comments}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 size={14} /> {post.shares}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-pink-400 mb-1">{post.engagement_rate}%</div>
                    <div className="text-xs text-gray-400">Engagement</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Instagram Campaigns</h3>
              <button className="text-sm text-gray-400 hover:text-white transition">Manage Campaigns</button>
            </div>
            <div className="space-y-4">
              {instagramCampaigns.slice(0, 3).map((campaign) => (
                <div key={campaign.id} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">{campaign.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      campaign.status === 'running' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {campaign.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-white">{campaign.sent.toLocaleString()}</div>
                      <div className="text-gray-400">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-400">{campaign.clicks.toLocaleString()}</div>
                      <div className="text-gray-400">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-pink-400">{campaign.ctr}%</div>
                      <div className="text-gray-400">CTR</div>
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

          {/* Trending Hashtags */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Trending Hashtags</h3>
              <Tag className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {trendingHashtags.map((hashtag) => (
                <div key={hashtag.tag} className="flex items-center justify-between">
                  <div>
                    <span className="text-pink-400 font-medium">{hashtag.tag}</span>
                    <div className="text-xs text-gray-400">{hashtag.count} posts</div>
                  </div>
                  <div className="text-sm text-green-400 font-medium">{hashtag.growth}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition">
                Create Instagram Campaign
              </button>
              <button className="w-full text-left p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                Export Instagram Contacts
              </button>
              <button className="w-full text-left p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                View Analytics Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramPage;