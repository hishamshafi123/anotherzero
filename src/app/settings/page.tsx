'use client';
import React, { useState } from 'react';
import { Settings, User, Key, Bell, Zap, Database, Save, Eye, EyeOff } from 'lucide-react';

const SETTINGS_SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'integrations', label: 'Integrations', icon: Key },
  { id: 'automation', label: 'Automation', icon: Zap },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data', label: 'Data & Export', icon: Database },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@anothezero.com',
    company: 'AnotherZero',
    timezone: 'America/Los_Angeles',
    instagramConnected: true,
    facebookConnected: true,
    webhookUrl: 'https://api.anothezero.com/webhooks/meta',
    apiKey: 'ak_live_1234567890abcdef',
    autoResponder: true,
    leadScoring: true,
    smartTags: true,
    emailNotifications: true,
    slackNotifications: false,
    discordNotifications: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
          <select
            value={formData.timezone}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSection = () => (
    <div className="space-y-6">
      {/* Social Media Connections */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Social Media Integrations</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-white">Instagram Business</h4>
                <p className="text-sm text-gray-400">Connect your Instagram Business account</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {formData.instagramConnected && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Connected</span>
              )}
              <button className={`px-4 py-2 rounded-lg text-sm transition ${
                formData.instagramConnected 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}>
                {formData.instagramConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-white">Facebook Pages</h4>
                <p className="text-sm text-gray-400">Connect your Facebook business pages</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {formData.facebookConnected && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Connected</span>
              )}
              <button className={`px-4 py-2 rounded-lg text-sm transition ${
                formData.facebookConnected 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}>
                {formData.facebookConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">API & Webhooks</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Webhook URL</label>
            <input
              type="url"
              value={formData.webhookUrl}
              onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://your-domain.com/webhooks"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={formData.apiKey}
                readOnly
                className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <button className="mt-2 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition">
              Regenerate API Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAutomationSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Automation Rules</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-600">
            <div>
              <h4 className="font-medium text-white">Auto-Responder</h4>
              <p className="text-sm text-gray-400">Automatically respond to interested contacts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoResponder}
                onChange={(e) => handleInputChange('autoResponder', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-600">
            <div>
              <h4 className="font-medium text-white">Smart Lead Scoring</h4>
              <p className="text-sm text-gray-400">Automatically score leads based on engagement</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.leadScoring}
                onChange={(e) => handleInputChange('leadScoring', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-600">
            <div>
              <h4 className="font-medium text-white">Smart Tagging</h4>
              <p className="text-sm text-gray-400">Automatically tag contacts based on interests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.smartTags}
                onChange={(e) => handleInputChange('smartTags', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-600">
            <div>
              <h4 className="font-medium text-white">Email Notifications</h4>
              <p className="text-sm text-gray-400">Receive campaign updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-600">
            <div>
              <h4 className="font-medium text-white">Slack Integration</h4>
              <p className="text-sm text-gray-400">Send notifications to Slack channel</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.slackNotifications}
                onChange={(e) => handleInputChange('slackNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-750 rounded-lg border border-gray-600">
            <h4 className="font-medium text-white mb-2">Export Data</h4>
            <p className="text-sm text-gray-400 mb-4">Download your contact and campaign data</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                Export Contacts
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                Export Campaigns
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                Export Analytics
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <h4 className="font-medium text-red-400 mb-2">Danger Zone</h4>
            <p className="text-sm text-gray-400 mb-4">Irreversible and destructive actions</p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
              Delete All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Configure your CRM preferences and automation</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {SETTINGS_SECTIONS.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            {activeSection === 'profile' && renderProfileSection()}
            {activeSection === 'integrations' && renderIntegrationsSection()}
            {activeSection === 'automation' && renderAutomationSection()}
            {activeSection === 'notifications' && renderNotificationsSection()}
            {activeSection === 'data' && renderDataSection()}
            
            {/* Save Button */}
            {['profile', 'integrations', 'automation', 'notifications'].includes(activeSection) && (
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Changes will be saved automatically</p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}