'use client';
import React, { useState } from 'react';
import { ArrowLeft, Send, Eye, Users, Calendar, Target, MessageSquare, Instagram, Facebook } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    channel: 'both',
    audience: 'interested',
    scheduleType: 'now',
    scheduledDate: '',
    scheduledTime: '',
    messageTemplate: '',
    testVariant: false,
    variantB: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare campaign data for n8n webhook
      const campaignPayload = {
        ...formData,
        createdAt: new Date().toISOString(),
        status: formData.scheduleType === 'now' ? 'running' : 'scheduled',
        timestamp: Date.now()
      };
      
      console.log('🚀 Sending campaign data to n8n webhook...');
      console.log('📍 Webhook URL:', 'https://n8n.anas.codes/webhook-test/46f147c3-c946-47cd-a613-212f8e06d7b6');
      console.log('📦 Campaign payload:', JSON.stringify(campaignPayload, null, 2));
      
      // Send to our API route (which forwards to n8n webhook)
      const response = await fetch('/api/send-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignPayload)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ Campaign sent to n8n successfully!');
        console.log('📡 n8n response:', result.n8nResponse);
        alert('✅ Campaign sent to n8n successfully!');
        // Redirect to campaigns page after successful submission
        router.push('/campaigns');
      } else {
        console.error('❌ Failed to send campaign:', result.error || `${response.status} ${response.statusText}`);
        alert(`❌ Failed to send campaign: ${result.error || 'Please try again.'}`);
      }
      
    } catch (error) {
      console.error('❌ Error sending campaign to n8n:', error);
      alert('Error sending campaign. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Create New Campaign</h1>
            <p className="text-gray-400">Design and launch your next messaging campaign</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        {/* Campaign Details */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Campaign Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Summer Fitness Promo"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Channel
              </label>
              <select
                value={formData.channel}
                onChange={(e) => handleInputChange('channel', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="both">Both Instagram & Facebook</option>
                <option value="instagram">Instagram Only</option>
                <option value="facebook">Facebook Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audience Selection */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Audience Selection</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Audience
              </label>
              <select
                value={formData.audience}
                onChange={(e) => handleInputChange('audience', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="interested">Interested Contacts (4 contacts)</option>
                <option value="neutral">Neutral Contacts (1 contact)</option>
                <option value="all">All Active Contacts (5 contacts)</option>
                <option value="high-engagement">High Engagement (3 contacts)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Total Reach</span>
                </div>
                <div className="text-2xl font-bold text-white">4</div>
                <div className="text-xs text-gray-400">contacts</div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Instagram className="h-4 w-4 text-pink-400" />
                  <span className="text-sm text-gray-300">Instagram</span>
                </div>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-xs text-gray-400">contacts</div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Facebook className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Facebook</span>
                </div>
                <div className="text-2xl font-bold text-white">1</div>
                <div className="text-xs text-gray-400">contacts</div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">Est. CTR</span>
                </div>
                <div className="text-2xl font-bold text-white">15%</div>
                <div className="text-xs text-gray-400">predicted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Template */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Message Template</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Primary Message
              </label>
              <textarea
                rows={4}
                required
                value={formData.messageTemplate}
                onChange={(e) => handleInputChange('messageTemplate', e.target.value)}
                placeholder="Hey {first_name}! 👋 I noticed you're into fitness. Check out our latest supplement blend that's perfect for your goals → {link}"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="mt-2 text-xs text-gray-400">
                Available variables: {'{'}first_name{'}'}, {'{'}handle{'}'}, {'{'}link{'}'}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="testVariant"
                checked={formData.testVariant}
                onChange={(e) => handleInputChange('testVariant', e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="testVariant" className="text-sm text-gray-300">
                Create A/B test variant
              </label>
            </div>

            {formData.testVariant && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Variant B Message
                </label>
                <textarea
                  rows={4}
                  value={formData.variantB}
                  onChange={(e) => handleInputChange('variantB', e.target.value)}
                  placeholder="Hi {first_name}! Looking to level up your fitness game? Here's something that caught my eye for you → {link}"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Scheduling */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Scheduling</h2>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="scheduleType"
                  value="now"
                  checked={formData.scheduleType === 'now'}
                  onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Send Immediately</span>
                </div>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="scheduleType"
                  value="scheduled"
                  checked={formData.scheduleType === 'scheduled'}
                  onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">Schedule for Later</span>
                </div>
              </label>
            </div>

            {formData.scheduleType === 'scheduled' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition border border-gray-600"
          >
            Cancel
          </button>
          
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition border border-gray-600"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${
              loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending to n8n...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {formData.scheduleType === 'now' ? 'Send Campaign' : 'Schedule Campaign'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}