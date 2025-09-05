'use client';
import React from 'react';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/Badge';

interface CampaignDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({ isOpen, onClose, data }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Campaign Details" size="lg">
      <div className="space-y-6">
        {/* Campaign Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {data?.name || 'Campaign Name'}
            </h3>
            <p className="text-slate-600">{data?.channel || 'Instagram'} • Created 5 days ago</p>
          </div>
          <Badge tone={data?.status === 'Running' ? 'green' : 'yellow'}>
            {data?.status || 'Running'}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-slate-900">{data?.sent?.toLocaleString() || '8,421'}</div>
            <div className="text-sm text-slate-600">Messages Sent</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-slate-900">{data?.clicks?.toLocaleString() || '3,612'}</div>
            <div className="text-sm text-slate-600">Clicks</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round((data?.ctr || 0.43) * 100)}%</div>
            <div className="text-sm text-slate-600">CTR</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-green-600">221</div>
            <div className="text-sm text-slate-600">Conversions</div>
          </div>
        </div>

        {/* Campaign Settings */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Campaign Settings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Target Audience:</span>
                <span>Interested contacts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Rate Limit:</span>
                <span>50/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Schedule:</span>
                <span>9 AM - 6 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">A/B Test:</span>
                <span>CTA Short vs Long</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 mb-3">Performance Timeline</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Campaign started</div>
                  <div className="text-xs text-slate-500">5 days ago</div>
                </div>
                <div className="text-sm text-slate-600">2,100 sent</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Peak performance</div>
                  <div className="text-xs text-slate-500">3 days ago</div>
                </div>
                <div className="text-sm text-slate-600">47% CTR</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Rate limit hit</div>
                  <div className="text-xs text-slate-500">2 days ago</div>
                </div>
                <div className="text-sm text-slate-600">Queue: 1,200</div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Template */}
        <div>
          <h4 className="font-medium text-slate-900 mb-3">Message Template</h4>
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="text-sm text-slate-900">
              {"Hey {{first_name}}! Want your brand featured in top outlets? Here's our PR pack → {{link}}"}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-500">Template: Intro (IG)</div>
              <button className="text-xs text-blue-600 hover:text-blue-700">Edit Template</button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="font-medium text-slate-900 mb-3">Recent Activity</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
              <span>Message sent to @sarah.brand</span>
              <span className="text-slate-500">2 min ago</span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
              <span>@john.doe clicked link</span>
              <span className="text-slate-500">5 min ago</span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
              <span>Message sent to @creative.co</span>
              <span className="text-slate-500">8 min ago</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button className="flex-1 border border-slate-200 text-slate-700 py-2 px-4 rounded-xl hover:bg-slate-50 transition">
            Pause Campaign
          </button>
          <button className="flex-1 border border-slate-200 text-slate-700 py-2 px-4 rounded-xl hover:bg-slate-50 transition">
            Edit Settings
          </button>
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition">
            View Full Report
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CampaignDetailModal;