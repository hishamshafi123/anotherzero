'use client';
import React from 'react';
import Modal from './ui/Modal';
import { ABTest } from '@/lib/mock-data';
import { Calendar, TrendingUp, Users } from 'lucide-react';
import Badge from './Badge';

interface ABTestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  testData: ABTest | null;
  onPromoteWinner?: (testId: string, winnerId: string) => void;
}

const ABTestDetailModal: React.FC<ABTestDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  testData,
  onPromoteWinner 
}) => {
  if (!testData || !testData.variants || testData.variants.length === 0) return null;

  const winner = testData.variants.reduce((prev, current) => 
    (current.ctr > prev.ctr) ? current : prev
  );

  const handlePromoteWinner = () => {
    if (onPromoteWinner && winner) {
      onPromoteWinner(testData.id, winner.id);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`A/B Test: ${testData?.name || 'Unknown Test'}`} size="lg">
      <div className="space-y-6">
        {/* Test Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-600" size={20} />
            <div>
              <div className="text-sm text-gray-500">Started</div>
              <div className="font-medium">{formatDate(testData.start_date)}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-600" size={20} />
            <div>
              <div className="text-sm text-gray-500">Confidence</div>
              <div className="font-medium">{testData.confidence_level}%</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="text-purple-600" size={20} />
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <Badge tone={testData.status === 'completed' ? "green" : "slate"}>
                {testData.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Description</h4>
          <p className="text-gray-600">{testData.description}</p>
        </div>

        {/* Variants Comparison */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Variant Performance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testData.variants.map((variant, index) => (
              <div 
                key={variant.id} 
                className={`border rounded-xl p-4 ${
                  variant.id === winner.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">{variant.name}</h5>
                  {variant.id === winner.id && (
                    <Badge tone="green">Winner</Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                  "{variant.message}"
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Sent</div>
                    <div className="font-medium text-lg">{variant.sent.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Clicks</div>
                    <div className="font-medium text-lg">{variant.clicks}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">CTR</div>
                    <div className="font-medium text-lg text-blue-600">{variant.ctr.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Conversions</div>
                    <div className="font-medium text-lg text-green-600">{variant.conversions}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistical Significance */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-medium text-blue-900 mb-2">Statistical Analysis</h4>
          <div className="text-sm text-blue-800">
            <p>
              With {testData.confidence_level}% confidence, <strong>{winner.name}</strong> is the 
              winning variant with a {winner.ctr.toFixed(1)}% CTR vs{' '}
              {testData.variants.find(v => v.id !== winner.id)?.ctr.toFixed(1)}% for the alternative.
            </p>
            {testData.status === 'completed' && testData.winner && (
              <p className="mt-2 text-green-800">
                ✅ This test has concluded and results are statistically significant.
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
          
          <div className="flex gap-3">
            {testData.status === 'completed' && !testData.winner && (
              <button
                onClick={handlePromoteWinner}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2"
              >
                <TrendingUp size={16} />
                Promote Winner
              </button>
            )}
            <button
              onClick={() => console.log('Duplicate test:', testData.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Duplicate Test
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ABTestDetailModal;