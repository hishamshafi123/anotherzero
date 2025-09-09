'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Users, MessageSquare, Calendar } from 'lucide-react';

export default function NewCampaignPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    channel: 'instagram',
    message: '',
    audience: 'interested',
    schedule: 'now'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/campaigns/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to campaigns page with success message
        router.push('/campaigns?success=true&message=Campaign started, will take a minute to load');
      } else {
        throw new Error('Failed to send campaign');
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Failed to send campaign. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">New Campaign</h1>
        <p className="text-slate-600 mt-1">Create a new Instagram or Facebook campaign</p>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter campaign name"
            />
          </div>

          <div>
            <label htmlFor="channel" className="block text-sm font-medium text-slate-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Channel
            </label>
            <select
              id="channel"
              name="channel"
              value={formData.channel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div>
            <label htmlFor="audience" className="block text-sm font-medium text-slate-700 mb-2">
              Target Audience
            </label>
            <select
              id="audience"
              name="audience"
              value={formData.audience}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="interested">Interested Contacts</option>
              <option value="engaged">Highly Engaged</option>
              <option value="all">All Contacts</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Campaign Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your campaign message..."
            />
          </div>

          <div>
            <label htmlFor="schedule" className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Schedule
            </label>
            <select
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="now">Send Now</option>
              <option value="later">Schedule for Later</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-700 text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending Campaign...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Campaign
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}