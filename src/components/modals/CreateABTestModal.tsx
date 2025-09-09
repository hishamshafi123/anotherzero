'use client';
import React, { useState, useMemo } from 'react';
import { 
  X, ChevronLeft, ChevronRight, TestTube, Users, MessageSquare, 
  Settings, Eye, Calendar, Target, TrendingUp, Clock, 
  Instagram, Facebook, CheckCircle, AlertCircle, Save
} from 'lucide-react';

export interface CreateABTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  duplicateFromTest?: any;
  onCreateTest: (testData: any) => void;
}

interface TestFormData {
  // Step 1: Test Basics
  name: string;
  description: string;
  testType: 'message_content' | 'send_timing' | 'cta_placement' | 'personalization';
  primaryGoal: 'ctr' | 'reply_rate' | 'engagement' | 'conversion';
  channels: ('instagram' | 'facebook')[];
  
  // Step 2: Audience Targeting
  segments: string[];
  sampleSize: number;
  exclusions: string[];
  
  // Step 3: Variant Creation
  variants: Array<{
    id: string;
    name: string;
    message: string;
    allocation: number;
  }>;
  
  // Step 4: Test Parameters
  startDate: string;
  endDate: string;
  confidenceLevel: 90 | 95 | 99;
  minDetectableEffect: number;
  sendSettings: {
    rateLimit: number;
    timeZone: 'contact' | 'account';
    sendWindow: 'business' | 'extended' | 'always';
    frequencyCap: number;
  };
  
  // Additional flags
  sendImmediately: boolean;
}

const initialFormData: TestFormData = {
  name: '',
  description: '',
  testType: 'message_content',
  primaryGoal: 'ctr',
  channels: ['instagram'],
  segments: [],
  sampleSize: 400,
  exclusions: [],
  variants: [
    { id: 'control', name: 'Control', message: '', allocation: 50 },
    { id: 'variant_b', name: 'Variant B', message: '', allocation: 50 }
  ],
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  confidenceLevel: 95,
  minDetectableEffect: 10,
  sendSettings: {
    rateLimit: 50,
    timeZone: 'contact',
    sendWindow: 'business',
    frequencyCap: 1
  },
  sendImmediately: true
};

const steps = [
  { id: 1, name: 'Test Basics', icon: TestTube },
  { id: 2, name: 'Audience', icon: Users },
  { id: 3, name: 'Variants', icon: MessageSquare },
  { id: 4, name: 'Parameters', icon: Settings },
  { id: 5, name: 'Preview', icon: Eye }
];

const testTypes = [
  { id: 'message_content', label: 'Message Content', description: 'Test different message copy' },
  { id: 'send_timing', label: 'Send Timing', description: 'Test different send times' },
  { id: 'cta_placement', label: 'CTA Placement', description: 'Test where call-to-action appears' },
  { id: 'personalization', label: 'Personalization Level', description: 'Test different levels of customization' }
];

const primaryGoals = [
  { id: 'ctr', label: 'Click-through Rate', description: 'Most common success metric' },
  { id: 'reply_rate', label: 'Reply Rate', description: 'Measure response engagement' },
  { id: 'engagement', label: 'Engagement Score', description: 'Overall interaction quality' },
  { id: 'conversion', label: 'Conversion Rate', description: 'Final action completion' }
];

const audienceSegments = [
  { id: 'interested', name: 'Interested Contacts', count: 1247, description: 'Recommended for most tests' },
  { id: 'recent_engagers', name: 'Recent Engagers', count: 892, description: 'Engaged in last 30 days' },
  { id: 'high_value', name: 'High-Value Leads', count: 434, description: 'Clicked multiple campaigns' },
  { id: 'reengagement', name: 'Re-engagement Pool', count: 2156, description: 'No recent activity' }
];

const CreateABTestModal: React.FC<CreateABTestModalProps> = ({ 
  isOpen, 
  onClose, 
  duplicateFromTest,
  onCreateTest 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TestFormData>(
    duplicateFromTest ? { ...initialFormData, ...duplicateFromTest } : initialFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (updates: Partial<TestFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear related errors
    const clearedErrors = { ...errors };
    Object.keys(updates).forEach(key => {
      delete clearedErrors[key];
    });
    setErrors(clearedErrors);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Test name is required';
        if (formData.name.length < 3) newErrors.name = 'Test name must be at least 3 characters';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.channels.length === 0) newErrors.channels = 'At least one channel must be selected';
        break;
      
      case 2:
        if (formData.segments.length === 0) newErrors.segments = 'At least one audience segment must be selected';
        if (formData.sampleSize < 200) newErrors.sampleSize = 'Minimum sample size is 200 (100 per variant)';
        break;
      
      case 3:
        const hasEmptyVariant = formData.variants.some(v => !v.message.trim());
        if (hasEmptyVariant) newErrors.variants = 'All variants must have message content';
        const duplicateMessages = formData.variants.some((v, i) => 
          formData.variants.some((v2, i2) => i !== i2 && v.message === v2.message)
        );
        if (duplicateMessages) newErrors.variants = 'Variants must have different messages';
        break;
      
      case 4:
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
          newErrors.endDate = 'End date must be after start date';
        }
        const daysDiff = (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff < 7) newErrors.endDate = 'Test must run for at least 7 days';
        if (daysDiff > 30) newErrors.endDate = 'Test cannot run for more than 30 days';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleCreateTest = () => {
    if (validateStep(5)) {
      onCreateTest(formData);
      onClose();
    }
  };

  const calculateSampleSizeNeeded = useMemo(() => {
    const { confidenceLevel, minDetectableEffect } = formData;
    // Simplified sample size calculation
    const z = confidenceLevel === 99 ? 2.576 : confidenceLevel === 95 ? 1.96 : 1.645;
    const p = 0.1; // Assumed baseline rate
    const delta = minDetectableEffect / 100;
    const n = Math.ceil(2 * ((z * Math.sqrt(2 * p * (1 - p))) / delta) ** 2);
    return n * formData.variants.length;
  }, [formData.confidenceLevel, formData.minDetectableEffect, formData.variants.length]);

  const selectedSegmentCount = useMemo(() => {
    return formData.segments.reduce((sum, segmentId) => {
      const segment = audienceSegments.find(s => s.id === segmentId);
      return sum + (segment?.count || 0);
    }, 0);
  }, [formData.segments]);

  const canProceed = useMemo(() => {
    return validateStep(currentStep);
  }, [currentStep, formData]);

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1TestBasics formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 2:
        return <Step2AudienceTargeting formData={formData} updateFormData={updateFormData} errors={errors} selectedSegmentCount={selectedSegmentCount} />;
      case 3:
        return <Step3VariantCreation formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 4:
        return <Step4TestParameters formData={formData} updateFormData={updateFormData} errors={errors} calculateSampleSizeNeeded={calculateSampleSizeNeeded} />;
      case 5:
        return <Step5PreviewConfirmation formData={formData} selectedSegmentCount={selectedSegmentCount} calculateSampleSizeNeeded={calculateSampleSizeNeeded} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {duplicateFromTest ? 'Duplicate A/B Test' : 'Create A/B Test'}
              </h2>
              <p className="text-gray-400">Set up message testing experiments with statistical rigor</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition ${
                      isCompleted 
                        ? 'bg-green-600 border-green-600 text-white' 
                        : isActive 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'bg-gray-700 border-gray-600 text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle size={20} /> : <IconComponent size={20} />}
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                        {step.name}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-600'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Step {currentStep} of {steps.length}
            </div>
            
            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 text-gray-400 hover:text-white transition flex items-center gap-2"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
              )}
              
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              
              {currentStep < 5 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleCreateTest}
                  disabled={!canProceed}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  <TestTube size={16} />
                  Create Test
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Components
const Step1TestBasics: React.FC<{
  formData: TestFormData;
  updateFormData: (updates: Partial<TestFormData>) => void;
  errors: Record<string, string>;
}> = ({ formData, updateFormData, errors }) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TestTube className="text-blue-400" size={20} />
          Test Basics
        </h3>
        <p className="text-gray-400 mb-6">Define what you're testing and why</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Test Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Test Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              placeholder="September Supplement Pitch Test"
              className={`w-full px-4 py-3 bg-gray-700 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Testing casual vs professional tone for supplement outreach"
              rows={3}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition ${
                errors.description ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Channel Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Channels *
            </label>
            <div className="flex gap-3">
              {[
                { id: 'instagram', label: 'Instagram', icon: Instagram },
                { id: 'facebook', label: 'Facebook', icon: Facebook }
              ].map((channel) => {
                const IconComponent = channel.icon;
                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => {
                      const newChannels = formData.channels.includes(channel.id as any)
                        ? formData.channels.filter(c => c !== channel.id)
                        : [...formData.channels, channel.id as any];
                      updateFormData({ channels: newChannels });
                    }}
                    className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition ${
                      formData.channels.includes(channel.id as any)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <IconComponent size={18} />
                    {channel.label}
                  </button>
                );
              })}
            </div>
            {errors.channels && <p className="text-red-400 text-sm mt-1">{errors.channels}</p>}
          </div>
        </div>

        <div className="space-y-4">
          {/* Test Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Test Type
            </label>
            <div className="space-y-2">
              {testTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => updateFormData({ testType: type.id as any })}
                  className={`w-full text-left p-3 border rounded-xl transition ${
                    formData.testType === type.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm opacity-75">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Primary Goal
            </label>
            <div className="space-y-2">
              {primaryGoals.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => updateFormData({ primaryGoal: goal.id as any })}
                  className={`w-full text-left p-3 border rounded-xl transition ${
                    formData.primaryGoal === goal.id
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium">{goal.label}</div>
                  <div className="text-sm opacity-75">{goal.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step2AudienceTargeting: React.FC<{
  formData: TestFormData;
  updateFormData: (updates: Partial<TestFormData>) => void;
  errors: Record<string, string>;
  selectedSegmentCount: number;
}> = ({ formData, updateFormData, errors, selectedSegmentCount }) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="text-blue-400" size={20} />
          Audience Targeting
        </h3>
        <p className="text-gray-400 mb-6">Define who will receive this test</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {/* Audience Segments */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contact Segments *
            </label>
            <div className="space-y-2">
              {audienceSegments.map((segment) => (
                <div
                  key={segment.id}
                  className={`border rounded-xl p-4 cursor-pointer transition ${
                    formData.segments.includes(segment.id)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                  onClick={() => {
                    const newSegments = formData.segments.includes(segment.id)
                      ? formData.segments.filter(s => s !== segment.id)
                      : [...formData.segments, segment.id];
                    updateFormData({ segments: newSegments });
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{segment.name}</div>
                      <div className="text-sm opacity-75">{segment.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{segment.count.toLocaleString()}</div>
                      <div className="text-sm opacity-75">contacts</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.segments && <p className="text-red-400 text-sm mt-1">{errors.segments}</p>}
          </div>
        </div>

        <div>
          {/* Sample Size */}
          <div className="bg-gray-750 border border-gray-600 rounded-xl p-4 mb-4">
            <h4 className="font-medium text-white mb-3">Sample Size Calculator</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Available Contacts:</span>
                <span className="text-white font-medium">{selectedSegmentCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Requested Sample:</span>
                <span className="text-white font-medium">{formData.sampleSize.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Per Variant:</span>
                <span className="text-white font-medium">{Math.floor(formData.sampleSize / formData.variants.length).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-gray-600">
                <div className="flex items-center gap-2">
                  {formData.sampleSize <= selectedSegmentCount ? (
                    <CheckCircle className="text-green-400" size={16} />
                  ) : (
                    <AlertCircle className="text-red-400" size={16} />
                  )}
                  <span className={formData.sampleSize <= selectedSegmentCount ? 'text-green-400' : 'text-red-400'}>
                    {formData.sampleSize <= selectedSegmentCount ? 'Sample size available' : 'Insufficient audience'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sample Size
            </label>
            <input
              type="number"
              value={formData.sampleSize}
              onChange={(e) => updateFormData({ sampleSize: parseInt(e.target.value) || 0 })}
              min="200"
              max={selectedSegmentCount}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.sampleSize ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.sampleSize && <p className="text-red-400 text-sm mt-1">{errors.sampleSize}</p>}
            <p className="text-gray-400 text-sm mt-1">
              Minimum 200 contacts (100 per variant) for reliable results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step3VariantCreation: React.FC<{
  formData: TestFormData;
  updateFormData: (updates: Partial<TestFormData>) => void;
  errors: Record<string, string>;
}> = ({ formData, updateFormData, errors }) => {
  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    updateFormData({ variants: newVariants });
  };

  const addVariant = () => {
    if (formData.variants.length < 4) {
      const newVariant = {
        id: `variant_${String.fromCharCode(65 + formData.variants.length)}`,
        name: `Variant ${String.fromCharCode(65 + formData.variants.length)}`,
        message: '',
        allocation: Math.floor(100 / (formData.variants.length + 1))
      };
      
      // Redistribute allocation
      const newAllocation = Math.floor(100 / (formData.variants.length + 1));
      const newVariants = formData.variants.map(v => ({ ...v, allocation: newAllocation }));
      newVariants.push(newVariant);
      
      updateFormData({ variants: newVariants });
    }
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 2) {
      const newVariants = formData.variants.filter((_, i) => i !== index);
      // Redistribute allocation
      const newAllocation = Math.floor(100 / newVariants.length);
      const redistributed = newVariants.map(v => ({ ...v, allocation: newAllocation }));
      updateFormData({ variants: redistributed });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="text-blue-400" size={20} />
          Variant Creation
        </h3>
        <p className="text-gray-400 mb-6">Create the different versions to test</p>
      </div>

      <div className="space-y-4">
        {formData.variants.map((variant, index) => (
          <div key={variant.id} className="border border-gray-600 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={variant.name}
                  onChange={(e) => updateVariant(index, 'name', e.target.value)}
                  className="text-lg font-medium bg-transparent text-white border-none focus:outline-none"
                />
                <span className="text-sm text-gray-400">({variant.allocation}% traffic)</span>
              </div>
              {formData.variants.length > 2 && (
                <button
                  onClick={() => removeVariant(index)}
                  className="p-2 text-gray-400 hover:text-red-400 transition"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message Content
              </label>
              <textarea
                value={variant.message}
                onChange={(e) => updateVariant(index, 'message', e.target.value)}
                placeholder="Enter your message content here..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>{variant.message.length} characters</span>
                <span>Instagram: {variant.message.length}/2200, Facebook: {variant.message.length}/8000</span>
              </div>
            </div>

            {/* Variables Available */}
            <div className="text-sm text-gray-400">
              <span>Available variables: </span>
              {['{{name}}', '{{handle}}', '{{interest}}', '{{link}}'].map((variable, i) => (
                <button
                  key={variable}
                  onClick={() => {
                    const newMessage = variant.message + variable;
                    updateVariant(index, 'message', newMessage);
                  }}
                  className="text-blue-400 hover:text-blue-300 mx-1"
                >
                  {variable}
                </button>
              ))}
            </div>
          </div>
        ))}

        {formData.variants.length < 4 && (
          <button
            onClick={addVariant}
            className="w-full py-4 border border-dashed border-gray-600 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 transition flex items-center justify-center gap-2"
          >
            <MessageSquare size={20} />
            Add Variant ({String.fromCharCode(65 + formData.variants.length)})
          </button>
        )}

        {errors.variants && (
          <p className="text-red-400 text-sm">{errors.variants}</p>
        )}
      </div>
    </div>
  );
};

const Step4TestParameters: React.FC<{
  formData: TestFormData;
  updateFormData: (updates: Partial<TestFormData>) => void;
  errors: Record<string, string>;
  calculateSampleSizeNeeded: number;
}> = ({ formData, updateFormData, errors, calculateSampleSizeNeeded }) => {
  const daysDiff = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="text-blue-400" size={20} />
          Test Parameters
        </h3>
        <p className="text-gray-400 mb-6">Configure timing and statistical settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Test Duration */}
          <div>
            <h4 className="font-medium text-white mb-3">Test Duration</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateFormData({ startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateFormData({ endDate: e.target.value })}
                  min={formData.startDate}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Duration: {daysDiff} days {daysDiff < 7 && '(minimum 7 days required)'}
            </p>
          </div>

          {/* Send Settings */}
          <div>
            <h4 className="font-medium text-white mb-3">Send Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rate Limit (messages per hour)
                </label>
                <input
                  type="number"
                  value={formData.sendSettings.rateLimit}
                  onChange={(e) => updateFormData({ 
                    sendSettings: { 
                      ...formData.sendSettings, 
                      rateLimit: parseInt(e.target.value) || 50 
                    }
                  })}
                  min="1"
                  max="200"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Send Window
                </label>
                <select
                  value={formData.sendSettings.sendWindow}
                  onChange={(e) => updateFormData({ 
                    sendSettings: { 
                      ...formData.sendSettings, 
                      sendWindow: e.target.value as any
                    }
                  })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="business">Business hours only (9 AM - 6 PM)</option>
                  <option value="extended">Extended hours (8 AM - 9 PM)</option>
                  <option value="always">24/7</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Statistical Settings */}
          <div>
            <h4 className="font-medium text-white mb-3">Statistical Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confidence Level
                </label>
                <select
                  value={formData.confidenceLevel}
                  onChange={(e) => updateFormData({ confidenceLevel: parseInt(e.target.value) as any })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={90}>90% confidence</option>
                  <option value={95}>95% confidence (recommended)</option>
                  <option value={99}>99% confidence</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Detectable Effect (%)
                </label>
                <input
                  type="number"
                  value={formData.minDetectableEffect}
                  onChange={(e) => updateFormData({ minDetectableEffect: parseFloat(e.target.value) || 10 })}
                  min="5"
                  max="50"
                  step="5"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Minimum improvement to detect as significant
                </p>
              </div>
            </div>
          </div>

          {/* Sample Size Recommendation */}
          <div className="bg-gray-750 border border-gray-600 rounded-xl p-4">
            <h4 className="font-medium text-white mb-3">Statistical Requirements</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Recommended Sample Size:</span>
                <span className="text-white font-medium">{calculateSampleSizeNeeded.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Your Sample Size:</span>
                <span className="text-white font-medium">{formData.sampleSize.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-gray-600">
                <div className="flex items-center gap-2">
                  {formData.sampleSize >= calculateSampleSizeNeeded ? (
                    <>
                      <CheckCircle className="text-green-400" size={16} />
                      <span className="text-green-400 text-sm">Sample size adequate for statistical significance</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="text-yellow-400" size={16} />
                      <span className="text-yellow-400 text-sm">Consider increasing sample size for more reliable results</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step5PreviewConfirmation: React.FC<{
  formData: TestFormData;
  selectedSegmentCount: number;
  calculateSampleSizeNeeded: number;
}> = ({ formData, selectedSegmentCount, calculateSampleSizeNeeded }) => {
  const daysDiff = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24));
  
  const previewData = {
    name: 'Sarah',
    handle: '@sarahfitness',
    interest: 'bodybuilding',
    link: 'https://track.example.com/abc123'
  };

  const renderPreview = (message: string) => {
    return message
      .replace(/\{\{name\}\}/g, previewData.name)
      .replace(/\{\{handle\}\}/g, previewData.handle)
      .replace(/\{\{interest\}\}/g, previewData.interest)
      .replace(/\{\{link\}\}/g, previewData.link);
  };

  const preflightChecks = [
    { label: 'Minimum sample size met', passed: formData.sampleSize >= 200 },
    { label: 'Test duration allows for significance', passed: daysDiff >= 7 },
    { label: 'All variants have unique messages', passed: new Set(formData.variants.map(v => v.message)).size === formData.variants.length },
    { label: 'Statistical requirements met', passed: formData.sampleSize >= calculateSampleSizeNeeded }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Eye className="text-blue-400" size={20} />
          Preview & Confirmation
        </h3>
        <p className="text-gray-400 mb-6">Final review before launching your test</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Summary */}
        <div className="space-y-4">
          <div className="bg-gray-750 border border-gray-600 rounded-xl p-4">
            <h4 className="font-medium text-white mb-3">Test Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white">{testTypes.find(t => t.id === formData.testType)?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Goal:</span>
                <span className="text-white">{primaryGoals.find(g => g.id === formData.primaryGoal)?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Channels:</span>
                <span className="text-white">{formData.channels.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{daysDiff} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sample Size:</span>
                <span className="text-white">{formData.sampleSize.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Variants:</span>
                <span className="text-white">{formData.variants.length}</span>
              </div>
            </div>
          </div>

          {/* Pre-flight Checklist */}
          <div className="bg-gray-750 border border-gray-600 rounded-xl p-4">
            <h4 className="font-medium text-white mb-3">Pre-flight Checklist</h4>
            <div className="space-y-2">
              {preflightChecks.map((check, index) => (
                <div key={index} className="flex items-center gap-2">
                  {check.passed ? (
                    <CheckCircle className="text-green-400" size={16} />
                  ) : (
                    <AlertCircle className="text-red-400" size={16} />
                  )}
                  <span className={`text-sm ${check.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Variant Previews */}
        <div className="space-y-4">
          <h4 className="font-medium text-white">Message Previews</h4>
          {formData.variants.map((variant, index) => (
            <div key={variant.id} className="bg-gray-750 border border-gray-600 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-white">{variant.name}</h5>
                <span className="text-sm text-gray-400">{variant.allocation}% traffic</span>
              </div>
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 mb-2">
                <div className="text-sm text-gray-300">
                  {renderPreview(variant.message)}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {variant.message.length} characters
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateABTestModal;