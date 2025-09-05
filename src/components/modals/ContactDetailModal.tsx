'use client';
import React, { useState, useMemo } from 'react';
import { 
  X, User, MessageCircle, MousePointer, Tag, Calendar, MapPin, 
  TrendingUp, Activity, Instagram, Facebook, Eye, Heart, Share2,
  Plus, Edit3, Blocks, Send, AlertTriangle, CheckCircle
} from 'lucide-react';
import { 
  MOCK_CONTACTS, MOCK_ACTIVITIES, MOCK_CAMPAIGNS, 
  getContactActivities, type Contact, type ActivityItem 
} from '@/lib/mock-data';

interface ContactDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactId?: string;
}

interface ContactDetailData {
  contact: Contact;
  activityTimeline: ActivityItem[];
  campaignHistory: Array<{
    id: string;
    campaignName: string;
    variant: string;
    status: 'sent' | 'clicked' | 'converted' | 'ignored';
    date: string;
    message: string;
  }>;
  clickHistory: Array<{
    id: string;
    url: string;
    timestamp: string;
    campaign_id: string;
    source_platform: 'instagram' | 'facebook';
  }>;
  engagementScore: number;
  tags: string[];
}

const ContactDetailModal: React.FC<ContactDetailModalProps> = ({ isOpen, onClose, contactId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newTag, setNewTag] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);

  // Get contact data
  const contact = useMemo(() => {
    if (!contactId) return null;
    return MOCK_CONTACTS.find(c => c.id === contactId) || null;
  }, [contactId]);

  // Mock detailed contact data
  const contactDetail: ContactDetailData | null = useMemo(() => {
    if (!contact) return null;

    return {
      contact,
      activityTimeline: [
        {
          id: '1',
          type: 'click',
          description: 'Clicked product link in September Supplement Launch campaign',
          timestamp: '2024-09-03T14:30:00Z',
          contact_id: contact.id,
          campaign_id: '1',
          metadata: { url: 'https://example.com/product/protein-blend', variant: 'Direct Approach' }
        },
        {
          id: '2',
          type: 'message',
          description: 'Sent DM response about product pricing',
          timestamp: '2024-09-03T14:25:00Z',
          contact_id: contact.id,
          metadata: { message_type: 'pricing_inquiry' }
        },
        {
          id: '3',
          type: 'campaign',
          description: 'Received campaign message from Weekend Warriors campaign',
          timestamp: '2024-09-03T14:20:00Z',
          contact_id: contact.id,
          campaign_id: '2',
          metadata: { variant: 'Weekend Focus' }
        },
        {
          id: '4',
          type: 'tag_added',
          description: 'Added tag: premium',
          timestamp: '2024-09-03T12:15:00Z',
          contact_id: contact.id,
          metadata: { tag: 'premium', added_by: 'system' }
        },
        {
          id: '5',
          type: 'status_changed',
          description: 'Status changed from neutral to interested',
          timestamp: '2024-09-02T16:45:00Z',
          contact_id: contact.id,
          metadata: { from: 'neutral', to: 'interested' }
        }
      ],
      campaignHistory: [
        {
          id: '1',
          campaignName: 'September Supplement Launch',
          variant: 'Direct Approach',
          status: 'clicked',
          date: '2024-09-03T14:30:00Z',
          message: 'Hey Sarah! Saw your fitness posts 💪 Check out our new protein blend'
        },
        {
          id: '2', 
          campaignName: 'Nutrition Education Series',
          variant: 'Educational Content',
          status: 'sent',
          date: '2024-08-25T10:15:00Z',
          message: 'Did you know that timing your nutrition can boost performance by 30%?'
        }
      ],
      clickHistory: [
        {
          id: '1',
          url: 'https://example.com/product/protein-blend',
          timestamp: '2024-09-03T14:30:00Z',
          campaign_id: '1',
          source_platform: contact.source
        },
        {
          id: '2',
          url: 'https://example.com/nutrition-guide',
          timestamp: '2024-08-25T10:45:00Z', 
          campaign_id: '3',
          source_platform: contact.source
        }
      ],
      engagementScore: contact.engagement_score,
      tags: contact.tags
    };
  }, [contact]);

  const handleAddTag = () => {
    if (newTag.trim() && contactDetail) {
      contactDetail.tags.push(newTag.trim());
      setNewTag('');
      setShowAddTag(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'click': return <MousePointer size={16} className="text-blue-400" />;
      case 'message': return <MessageCircle size={16} className="text-purple-400" />;
      case 'campaign': return <Send size={16} className="text-green-400" />;
      case 'tag_added': return <Tag size={16} className="text-yellow-400" />;
      case 'status_changed': return <TrendingUp size={16} className="text-orange-400" />;
      default: return <Activity size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clicked': return 'text-green-400';
      case 'converted': return 'text-blue-400'; 
      case 'sent': return 'text-gray-400';
      case 'ignored': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clicked': return <MousePointer size={14} />;
      case 'converted': return <CheckCircle size={14} />;
      case 'sent': return <Send size={14} />;
      case 'ignored': return <AlertTriangle size={14} />;
      default: return <Activity size={14} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'activity', label: 'Activity Timeline', icon: Activity },
    { id: 'campaigns', label: 'Campaigns', icon: Send },
    { id: 'engagement', label: 'Engagement', icon: TrendingUp }
  ];

  if (!isOpen || !contactDetail) return null;

  const { contact: contactData } = contactDetail;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={contactData.avatar_url} 
                alt={contactData.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{contactData.name}</h2>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">{contactData.handle}</span>
                  <div className="flex items-center gap-1">
                    {contactData.source === 'instagram' ? (
                      <Instagram size={16} className="text-pink-400" />
                    ) : (
                      <Facebook size={16} className="text-blue-400" />
                    )}
                    <span className="text-sm text-gray-400 capitalize">{contactData.source}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    contactData.interest_level === 'interested' 
                      ? 'bg-green-100 text-green-800' 
                      : contactData.interest_level === 'neutral'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {contactData.interest_level.toUpperCase()}
                  </span>
                </div>
                {contactData.location && (
                  <div className="flex items-center gap-1 mt-2">
                    <MapPin size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-400">{contactData.location}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-400">{contactData.engagement_score}%</div>
                <div className="text-sm text-gray-400">Engagement Score</div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6 border-b border-gray-700">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{contactData.clicks_count}</div>
              <div className="text-sm text-gray-400">Total Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{contactData.campaigns_count}</div>
              <div className="text-sm text-gray-400">Campaigns</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-400">
                {Math.floor((Date.now() - new Date(contactData.joined_at).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-gray-400">Days Active</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-400">{contactDetail.tags.length}</div>
              <div className="text-sm text-gray-400">Tags</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400 bg-gray-750'
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-750'
                  }`}
                >
                  <IconComponent size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Tags Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Tags</h3>
                  <button 
                    onClick={() => setShowAddTag(true)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    <Plus size={14} />
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {contactDetail.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                  {showAddTag && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        placeholder="New tag..."
                        className="px-2 py-1 bg-gray-700 text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                      <button onClick={handleAddTag} className="text-green-400 hover:text-green-300">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => setShowAddTag(false)} className="text-red-400 hover:text-red-300">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Joined:</span>
                    <span className="text-white ml-2">{formatTimestamp(contactData.joined_at)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Last Seen:</span>
                    <span className="text-white ml-2">{formatTimestamp(contactData.last_seen_at)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className={`ml-2 capitalize ${
                      contactData.status === 'active' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {contactData.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Source:</span>
                    <span className="text-white ml-2 capitalize">{contactData.source}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <MessageCircle size={16} />
                    Send Message
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                    <Edit3 size={16} />
                    Edit Contact
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    <Blocks size={16} />
                    Block Contact
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Activity Timeline</h3>
              <div className="space-y-4">
                {contactDetail.activityTimeline.map((activity) => (
                  <div key={activity.id} className="flex gap-4 p-4 bg-gray-700 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white mb-1">{activity.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={12} />
                        <span>{formatTimestamp(activity.timestamp)}</span>
                      </div>
                      {activity.metadata && (
                        <div className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300">
                          {Object.entries(activity.metadata).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-gray-500">{key}:</span> {String(value)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Campaign History</h3>
              <div className="space-y-4">
                {contactDetail.campaignHistory.map((campaign) => (
                  <div key={campaign.id} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{campaign.campaignName}</h4>
                        <p className="text-sm text-gray-400">Variant: {campaign.variant}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`${getStatusColor(campaign.status)}`}>
                          {getStatusIcon(campaign.status)}
                        </span>
                        <span className={`text-sm font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-800 rounded text-sm text-gray-300 mb-2">
                      {campaign.message}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTimestamp(campaign.date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'engagement' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Engagement Analysis</h3>
              
              {/* Engagement Score Breakdown */}
              <div className="p-4 bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-white mb-4">Engagement Score: {contactData.engagement_score}%</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Click Rate</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-600 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <span className="text-white text-sm">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Response Rate</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-600 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-white text-sm">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Campaign Participation</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-600 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <span className="text-white text-sm">90%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Click History */}
              <div>
                <h4 className="font-semibold text-white mb-4">Recent Clicks</h4>
                <div className="space-y-3">
                  {contactDetail.clickHistory.map((click) => (
                    <div key={click.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <div className="text-white font-medium text-sm">{click.url}</div>
                        <div className="text-xs text-gray-400">
                          Campaign ID: {click.campaign_id} • {formatTimestamp(click.timestamp)}
                        </div>
                      </div>
                      <div className="text-right">
                        {click.source_platform === 'instagram' ? (
                          <Instagram size={16} className="text-pink-400" />
                        ) : (
                          <Facebook size={16} className="text-blue-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-700 bg-gray-750">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Close
            </button>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Create Campaign
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailModal;