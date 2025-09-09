'use client';
import React, { useState } from 'react';
import Modal from './ui/Modal';
import { Save, Plus } from 'lucide-react';

export interface StrategyStep {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'scheduled' | 'conditional';
  delay?: string;
}

interface StrategyEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (steps: StrategyStep[]) => void;
}

const StrategyEditorModal: React.FC<StrategyEditorModalProps> = ({ isOpen, onClose, onSave }) => {
  const [steps, setSteps] = useState<StrategyStep[]>([
    {
      id: '1',
      name: 'Initial DM',
      description: 'Auto-reply + qualify with 1 question → send website link (with UTM)',
      status: 'active'
    },
    {
      id: '2', 
      name: 'Follow-up #1',
      description: '24h later if no click → soft nudge with social proof',
      status: 'scheduled',
      delay: '24h'
    },
    {
      id: '3',
      name: 'Re-engagement',
      description: '7 days later if still interested → different offer',
      status: 'conditional',
      delay: '7d'
    }
  ]);

  const handleSave = () => {
    onSave(steps);
    onClose();
  };

  const updateStep = (id: string, updates: Partial<StrategyStep>) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  const addStep = () => {
    const newStep: StrategyStep = {
      id: Date.now().toString(),
      name: 'New Step',
      description: 'Enter step description',
      status: 'conditional'
    };
    setSteps(prev => [...prev, newStep]);
  };

  const removeStep = (id: string) => {
    setSteps(prev => prev.filter(step => step.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';  
      case 'conditional': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Follow-up Strategy" size="lg">
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={step.name}
                    onChange={(e) => updateStep(step.id, { name: e.target.value })}
                    className="font-medium text-gray-900 border-none p-0 focus:outline-none focus:ring-0"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={step.status}
                      onChange={(e) => updateStep(step.id, { status: e.target.value as any })}
                      className={`px-2 py-1 rounded-full text-xs border-none ${getStatusColor(step.status)}`}
                    >
                      <option value="active">Active</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="conditional">Conditional</option>
                    </select>
                    {steps.length > 1 && (
                      <button
                        onClick={() => removeStep(step.id)}
                        className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  value={step.description}
                  onChange={(e) => updateStep(step.id, { description: e.target.value })}
                  className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg p-2 resize-none"
                  rows={2}
                />
                {step.status !== 'active' && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500">Delay:</label>
                    <input
                      type="text"
                      value={step.delay || ''}
                      onChange={(e) => updateStep(step.id, { delay: e.target.value })}
                      placeholder="e.g. 24h, 3d, 1w"
                      className="text-sm border border-gray-200 rounded px-2 py-1 w-24"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={addStep}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Step
        </button>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
          >
            <Save size={16} />
            Save Strategy
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StrategyEditorModal;