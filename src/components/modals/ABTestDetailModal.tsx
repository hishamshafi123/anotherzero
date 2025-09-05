'use client';
import React from 'react';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/Badge';

interface ABTestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

const ABTestDetailModal: React.FC<ABTestDetailModalProps> = ({ isOpen, onClose, data }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="A/B Test Details" size="lg">
      <div className="space-y-6">
        {/* Test Overview */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {data?.test || 'A/B Test'}
            </h3>
            <p className="text-slate-600">Running for 7 days</p>
          </div>
          <Badge tone={data?.pValue < 0.05 ? 'green' : 'slate'}>
            {data?.status || 'Running'}
          </Badge>
        </div>

        {/* Variants Comparison */}
        <div className="grid grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-xl p-4">
            <h4 className="font-medium text-slate-900 mb-3">Variant A</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Click-through Rate</span>
                <span className="font-medium">{Math.round((data?.variantA?.ctr || 0.42) * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Clicks</span>
                <span className="font-medium">{data?.variantA?.clicks || 132}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Messages Sent</span>
                <span className="font-medium">314</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Message Preview</div>
              <div className="text-sm">"Hey! Quick question about your brand..."</div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-green-50 border-green-200">
            <h4 className="font-medium text-slate-900 mb-3">Variant B <Badge tone="green" className="ml-2">Winner</Badge></h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Click-through Rate</span>
                <span className="font-medium">{Math.round((data?.variantB?.ctr || 0.49) * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Clicks</span>
                <span className="font-medium">{data?.variantB?.clicks || 160}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Messages Sent</span>
                <span className="font-medium">327</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
              <div className="text-xs text-slate-500 mb-1">Message Preview</div>
              <div className="text-sm">"Hey! I have a quick question for you about your brand..."</div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-slate-50 p-4 rounded-xl">
          <h4 className="font-medium text-slate-900 mb-3">Statistical Analysis</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Confidence Level:</span>
              <div className="font-medium">95%</div>
            </div>
            <div>
              <span className="text-slate-600">P-value:</span>
              <div className="font-medium">{data?.pValue?.toFixed(3) || '0.030'}</div>
            </div>
            <div>
              <span className="text-slate-600">Improvement:</span>
              <div className="font-medium text-green-600">+16.7%</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition">
            Promote Winner
          </button>
          <button className="flex-1 border border-slate-200 text-slate-700 py-2 px-4 rounded-xl hover:bg-slate-50 transition">
            Continue Test
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ABTestDetailModal;