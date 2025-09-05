'use client';
import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import StepNumber from '@/components/StepNumber';
import Badge from '@/components/Badge';

interface StrategyEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

const StrategyEditorModal: React.FC<StrategyEditorModalProps> = ({ isOpen, onClose, data }) => {
  const [steps, setSteps] = useState([
    {
      id: 1,
      name: 'Initial DM',
      description: 'Auto-reply + qualify with 1 question → send website link (with UTM)',
      delay: '0 minutes',
      status: 'active',
      template: 'Intro (IG)'
    },
    {
      id: 2,
      name: 'Follow-up #1',
      description: '24h later if no click → soft nudge with social proof',
      delay: '24 hours',
      status: 'scheduled',
      template: 'Follow-up 24h'
    },
    {
      id: 3,
      name: 'Re-engagement',
      description: '7 days later if still interested → different offer',
      delay: '7 days',
      status: 'conditional',
      template: 'Re-engagement'
    }
  ]);

  const handleSave = () => {
    console.log('Saving automation strategy:', steps);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'scheduled': return 'slate';
      case 'conditional': return 'yellow';
      default: return 'slate';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Follow-up Strategy" size="xl">
      <div className="space-y-6">
        {/* Strategy Overview */}
        <div className="bg-slate-50 p-4 rounded-xl">
          <h4 className="font-medium text-slate-900 mb-2">Strategy Performance</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Completion Rate:</span>
              <div className="font-medium">73%</div>
            </div>
            <div>
              <span className="text-slate-600">Avg. Journey Time:</span>
              <div className="font-medium">5.2 days</div>
            </div>
            <div>
              <span className="text-slate-600">Conversion Rate:</span>
              <div className="font-medium">12.3%</div>
            </div>
          </div>
        </div>

        {/* Steps Editor */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-slate-900">Automation Steps</h4>
            <button className="text-blue-600 text-sm hover:text-blue-700">+ Add Step</button>
          </div>
          
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <StepNumber>{step.id}</StepNumber>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={step.name}
                        onChange={(e) => {
                          const newSteps = [...steps];
                          newSteps[index].name = e.target.value;
                          setSteps(newSteps);
                        }}
                        className="font-medium text-slate-900 bg-transparent border-none p-0 focus:outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <Badge tone={getStatusColor(step.status)}>
                          {step.status}
                        </Badge>
                        <button className="text-slate-400 hover:text-slate-600">⋮</button>
                      </div>
                    </div>
                    <textarea
                      value={step.description}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[index].description = e.target.value;
                        setSteps(newSteps);
                      }}
                      className="text-sm text-slate-600 mt-1 w-full bg-transparent border-none p-0 resize-none focus:outline-none"
                      rows={2}
                    />
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Delay:</span>
                        <select 
                          value={step.delay}
                          onChange={(e) => {
                            const newSteps = [...steps];
                            newSteps[index].delay = e.target.value;
                            setSteps(newSteps);
                          }}
                          className="border border-slate-200 rounded px-2 py-1 text-xs"
                        >
                          <option value="0 minutes">Immediately</option>
                          <option value="30 minutes">30 minutes</option>
                          <option value="1 hour">1 hour</option>
                          <option value="6 hours">6 hours</option>
                          <option value="24 hours">24 hours</option>
                          <option value="3 days">3 days</option>
                          <option value="7 days">7 days</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Template:</span>
                        <select 
                          value={step.template}
                          onChange={(e) => {
                            const newSteps = [...steps];
                            newSteps[index].template = e.target.value;
                            setSteps(newSteps);
                          }}
                          className="border border-slate-200 rounded px-2 py-1 text-xs"
                        >
                          <option value="Intro (IG)">Intro (IG)</option>
                          <option value="Intro (FB)">Intro (FB)</option>
                          <option value="Follow-up 24h">Follow-up 24h</option>
                          <option value="Re-engagement">Re-engagement</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl">
            <h5 className="font-medium text-slate-900 mb-3">Trigger Conditions</h5>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span>Interest level: Interested</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span>No previous campaigns</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>Specific tags only</span>
              </label>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl">
            <h5 className="font-medium text-slate-900 mb-3">Rate Limiting</h5>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-slate-600">Messages per hour:</label>
                <input type="number" defaultValue="50" className="ml-2 w-16 border border-slate-200 rounded px-2 py-1" />
              </div>
              <div>
                <label className="text-slate-600">Daily limit:</label>
                <input type="number" defaultValue="500" className="ml-2 w-16 border border-slate-200 rounded px-2 py-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button 
            onClick={onClose}
            className="flex-1 border border-slate-200 text-slate-700 py-2 px-4 rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button className="border border-slate-200 text-slate-700 py-2 px-4 rounded-xl hover:bg-slate-50 transition">
            Preview
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
          >
            Save Strategy
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StrategyEditorModal;