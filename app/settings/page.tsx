'use client';
import React, { useState } from 'react';
import { 
  User, Key, Bell, Download, Upload, Users, Webhook, Shield, 
  Database, MessageSquare, Instagram, Facebook, Save, 
  RefreshCw, AlertCircle, CheckCircle, Settings as SettingsIcon 
} from 'lucide-react';

interface SettingsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SettingsPage: React.FC<SettingsPageProps> = ({ searchParams }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock user data
  const [userProfile, setUserProfile] = useState({
    name: 'Admin User',
    email: 'admin@anothezero.com',
    role: 'Administrator',
    timezone: 'America/Los_Angeles',
    language: 'English',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  });

  // Mock API keys
  const [apiKeys, setApiKeys] = useState({
    instagram: {
      clientId: 'ig_****_****_****_1234',
      status: 'connected',
      lastSync: '2024-09-03T14:30:00Z'
    },
    facebook: {
      clientId: 'fb_****_****_****_5678',
      status: 'connected', 
      lastSync: '2024-09-03T14:25:00Z'
    },
    webhook: {
      url: 'https://api.anothezero.com/webhooks/campaigns',
      secret: 'whsec_****_****_****_9012',
      status: 'active'
    }
  });

  // Mock notification settings
  const [notifications, setNotifications] = useState({
    email: {
      campaignUpdates: true,
      newContacts: true,
      systemAlerts: true,
      weeklyReports: false
    },
    browser: {
      campaignComplete: true,
      highEngagement: true,
      systemMaintenance: true
    },
    frequency: 'instant' // instant, daily, weekly
  });

  // Mock team members
  const [teamMembers, setTeamMembers] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@anothezero.com',
      role: 'Marketing Manager',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b193?w=40&h=40&fit=crop&crop=face',
      status: 'active',
      lastActive: '2024-09-03T16:45:00Z'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@anothezero.com',
      role: 'Sales Rep',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      status: 'active',
      lastActive: '2024-09-03T12:20:00Z'
    },
    {
      id: '3',
      name: 'Lisa Park',
      email: 'lisa@anothezero.com',
      role: 'Content Manager',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
      status: 'inactive',
      lastActive: '2024-09-01T09:15:00Z'
    }
  ]);

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'integrations', label: 'Integrations', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'data', label: 'Data & Privacy', icon: Database },
    { id: 'system', label: 'System Settings', icon: SettingsIcon }
  ];

  const handleSave = () => {
    console.log('Saving settings...');
    setHasUnsavedChanges(false);
    // TODO: Implement save logic
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setHasUnsavedChanges(true);
    // TODO: Update state based on section
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active': return 'text-green-400';
      case 'disconnected':
      case 'inactive': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active': return <CheckCircle size={16} className="text-green-400" />;
      case 'disconnected':
      case 'inactive': return <AlertCircle size={16} className="text-red-400" />;
      default: return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Profile Information</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <img 
                    src={userProfile.avatar} 
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Change Photo
                    </button>
                    <p className="text-sm text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                    <select 
                      value={userProfile.timezone}
                      onChange={(e) => handleInputChange('profile', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                    <select 
                      value={userProfile.language}
                      onChange={(e) => handleInputChange('profile', 'language', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Security</h3>
              <div className="space-y-4">
                <button className="flex items-center gap-3 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition w-full text-left">
                  <Shield size={20} />
                  <div>
                    <div className="font-medium">Change Password</div>
                    <div className="text-sm text-gray-400">Last changed 3 months ago</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition w-full text-left">
                  <Key size={20} />
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-400">Not enabled</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Social Media Integrations</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                      <Instagram size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Instagram Basic Display</div>
                      <div className="text-sm text-gray-400">Client ID: {apiKeys.instagram.clientId}</div>
                      <div className="text-xs text-gray-500">Last sync: {new Date(apiKeys.instagram.lastSync).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(apiKeys.instagram.status)}
                      <span className={`text-sm font-medium ${getStatusColor(apiKeys.instagram.status)}`}>
                        {apiKeys.instagram.status}
                      </span>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Facebook size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Facebook Graph API</div>
                      <div className="text-sm text-gray-400">Client ID: {apiKeys.facebook.clientId}</div>
                      <div className="text-xs text-gray-500">Last sync: {new Date(apiKeys.facebook.lastSync).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(apiKeys.facebook.status)}
                      <span className={`text-sm font-medium ${getStatusColor(apiKeys.facebook.status)}`}>
                        {apiKeys.facebook.status}
                      </span>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Webhooks</h3>
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Webhook size={20} className="text-blue-400" />
                    <div>
                      <div className="font-medium text-white">Campaign Webhook</div>
                      <div className="text-sm text-gray-400">Receive campaign event notifications</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(apiKeys.webhook.status)}
                    <span className={`text-sm font-medium ${getStatusColor(apiKeys.webhook.status)}`}>
                      {apiKeys.webhook.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Webhook URL</label>
                    <input
                      type="url"
                      value={apiKeys.webhook.url}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Webhook Secret</label>
                    <input
                      type="password"
                      value={apiKeys.webhook.secret}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {Object.entries(notifications.email).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-white">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                      <div className="text-sm text-gray-400">
                        {key === 'campaignUpdates' && 'Get notified when campaigns start, pause, or complete'}
                        {key === 'newContacts' && 'Receive alerts when new contacts are added to your database'}
                        {key === 'systemAlerts' && 'Important system updates and maintenance notifications'}
                        {key === 'weeklyReports' && 'Weekly performance summary delivered to your inbox'}
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleInputChange('notifications', `email.${key}`, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Browser Notifications</h3>
              <div className="space-y-4">
                {Object.entries(notifications.browser).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-white">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleInputChange('notifications', `browser.${key}`, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Notification Frequency</h3>
              <div className="space-y-3">
                {['instant', 'daily', 'weekly'].map((freq) => (
                  <label key={freq} className="flex items-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
                    <input
                      type="radio"
                      name="frequency"
                      value={freq}
                      checked={notifications.frequency === freq}
                      onChange={(e) => handleInputChange('notifications', 'frequency', e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-white capitalize">{freq}</div>
                      <div className="text-sm text-gray-400">
                        {freq === 'instant' && 'Receive notifications immediately'}
                        {freq === 'daily' && 'Daily digest at 9:00 AM'}
                        {freq === 'weekly' && 'Weekly summary on Mondays'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Team Members</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Invite Member
              </button>
            </div>

            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-white">{member.name}</div>
                      <div className="text-sm text-gray-400">{member.email}</div>
                      <div className="text-xs text-gray-500">Last active: {formatLastActive(member.lastActive)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{member.role}</div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(member.status)}
                        <span className={`text-xs font-medium ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 transition">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-4">Role Permissions</h4>
              <div className="space-y-4">
                <div>
                  <div className="font-medium text-white mb-2">Administrator</div>
                  <div className="text-sm text-gray-400">Full access to all features and settings</div>
                </div>
                <div>
                  <div className="font-medium text-white mb-2">Marketing Manager</div>
                  <div className="text-sm text-gray-400">Manage campaigns, contacts, and view analytics</div>
                </div>
                <div>
                  <div className="font-medium text-white mb-2">Sales Rep</div>
                  <div className="text-sm text-gray-400">View contacts and campaigns, limited editing</div>
                </div>
                <div>
                  <div className="font-medium text-white mb-2">Content Manager</div>
                  <div className="text-sm text-gray-400">Manage templates and campaign content</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Data Export & Import</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Download size={24} className="text-blue-400" />
                    <div>
                      <h4 className="font-semibold text-white">Export Data</h4>
                      <p className="text-sm text-gray-400">Download your CRM data</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Export All Contacts
                    </button>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Export Campaign Data
                    </button>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Export Analytics Report
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Upload size={24} className="text-green-400" />
                    <div>
                      <h4 className="font-semibold text-white">Import Data</h4>
                      <p className="text-sm text-gray-400">Import contacts from CSV</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      Import Contacts
                    </button>
                    <div className="text-xs text-gray-400">
                      Supported formats: CSV, Excel
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Data Retention</h3>
              <div className="p-6 bg-gray-700 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Contact Data</div>
                      <div className="text-sm text-gray-400">How long to keep contact information</div>
                    </div>
                    <select className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600">
                      <option>Keep indefinitely</option>
                      <option>1 year</option>
                      <option>2 years</option>
                      <option>5 years</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Campaign Analytics</div>
                      <div className="text-sm text-gray-400">Analytics data retention period</div>
                    </div>
                    <select className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600">
                      <option>Keep indefinitely</option>
                      <option>6 months</option>
                      <option>1 year</option>
                      <option>2 years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Privacy Settings</h3>
              <div className="p-6 bg-gray-700 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Data Processing Agreement</div>
                      <div className="text-sm text-gray-400">GDPR compliant data processing</div>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                      View Agreement
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Cookie Policy</div>
                      <div className="text-sm text-gray-400">Manage cookie preferences</div>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-white mb-4">Application</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Version:</span>
                      <span className="text-white">2.1.4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Updated:</span>
                      <span className="text-white">Sep 1, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Environment:</span>
                      <span className="text-white">Production</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-white mb-4">Database</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Contacts:</span>
                      <span className="text-white">12,480</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Campaigns:</span>
                      <span className="text-white">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Templates:</span>
                      <span className="text-white">23</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">System Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">API Status</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle size={16} className="text-green-400" />
                      <span className="text-green-400 text-sm">Operational</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">99.9% uptime</div>
                </div>

                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Database</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle size={16} className="text-green-400" />
                      <span className="text-green-400 text-sm">Healthy</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Response time: 45ms</div>
                </div>

                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Integrations</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle size={16} className="text-green-400" />
                      <span className="text-green-400 text-sm">Connected</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">All services online</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Maintenance</h3>
              <div className="p-6 bg-gray-700 rounded-lg">
                <div className="space-y-4">
                  <button className="flex items-center gap-3 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition w-full text-left">
                    <RefreshCw size={20} />
                    <div>
                      <div className="font-medium">Clear Cache</div>
                      <div className="text-sm text-yellow-200">Clear application cache to improve performance</div>
                    </div>
                  </button>
                  
                  <button className="flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full text-left">
                    <AlertCircle size={20} />
                    <div>
                      <div className="font-medium">Reset System</div>
                      <div className="text-sm text-red-200">Restart all system services (maintenance mode required)</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Manage your account, integrations, and system preferences</p>
          </div>
          {hasUnsavedChanges && (
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Save size={18} />
              Save Changes
            </button>
          )}
        </div>

        {hasUnsavedChanges && (
          <div className="p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-yellow-400" />
              <span className="text-yellow-400">You have unsaved changes</span>
            </div>
          </div>
        )}
      </div>

      {/* Settings Navigation */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:w-3/4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;