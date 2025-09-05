'use client';
import React, { useState, useMemo } from 'react';
import { 
  X, Save, Eye, FileText, Settings, Copy, Trash2, Plus,
  ChevronDown
} from 'lucide-react';
import { MOCK_TEMPLATES, type Template } from '../../../lib/mock-data';

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId?: string;
}

const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({ isOpen, onClose, templateId }) => {
  const template = useMemo(() => {
    if (!templateId) return null;
    return MOCK_TEMPLATES.find((t: Template) => t.id === templateId) || null;
  }, [templateId]);

  const [templateName, setTemplateName] = useState(template?.name || 'New Template');
  const [templateContent, setTemplateContent] = useState(
    template?.body_text || 'Hey {{first_name}}! Check out our latest fitness supplement designed for {{interest}} enthusiasts 💪'
  );
  const [templateChannel, setTemplateChannel] = useState(template?.channel || 'instagram');
  const [templateCategory, setTemplateCategory] = useState(template?.category || 'intro');
  const [activeTab, setActiveTab] = useState('editor');

  const handleSave = () => {
    console.log('Saving template:', { 
      name: templateName, 
      content: templateContent,
      channel: templateChannel,
      category: templateCategory
    });
    onClose();
  };

  const variables = [
    { name: 'first_name', description: 'Contact first name' },
    { name: 'last_name', description: 'Contact last name' },
    { name: 'handle', description: 'Social media handle' },
    { name: 'interest', description: 'Contact interest/niche' },
    { name: 'location', description: 'Contact location' },
    { name: 'link', description: 'Tracking link' },
    { name: 'product_name', description: 'Product name' },
    { name: 'discount_code', description: 'Discount code' }
  ];

  const previewText = templateContent
    .replace(/\{\{first_name\}\}/g, 'Sarah')
    .replace(/\{\{last_name\}\}/g, 'Johnson')
    .replace(/\{\{handle\}\}/g, '@sarahfitness')
    .replace(/\{\{interest\}\}/g, 'bodybuilding')
    .replace(/\{\{location\}\}/g, 'Los Angeles')
    .replace(/\{\{link\}\}/g, 'https://track.example.com/abc123')
    .replace(/\{\{product_name\}\}/g, 'Elite Protein Blend')
    .replace(/\{\{discount_code\}\}/g, 'FITNESS20');

  const tabs = [
    { id: 'editor', label: 'Editor', icon: FileText },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const insertVariable = (variable: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = templateContent.substring(0, start) + `{{${variable}}}` + templateContent.substring(end);
      setTemplateContent(newContent);
      
      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
      }, 0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {template ? 'Edit Template' : 'Create Template'}
              </h2>
              <p className="text-gray-400">{templateName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400 bg-gray-750'
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-750'
                  }`}
                >
                  <IconComponent size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-96">
            {activeTab === 'editor' && (
              <div className="space-y-6">
                {/* Template Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter template name"
                  />
                </div>

                {/* Template Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message Content
                  </label>
                  <textarea
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter your message template"
                  />
                  <div className="text-sm text-gray-400 mt-2">
                    Click variables on the right to insert them, or type manually: {'{variable_name}'}
                  </div>
                </div>

                {/* Character Count */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    Characters: {templateContent.length}
                  </span>
                  <span className={`${templateContent.length > 1000 ? 'text-red-400' : 'text-green-400'}`}>
                    {templateContent.length > 1000 ? 'Too long for most platforms' : 'Good length'}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
                  <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <img 
                        src="/api/placeholder/40/40" 
                        alt="Preview" 
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm mb-1">@sarahfitness</div>
                        <div className="text-gray-200 leading-relaxed">
                          {previewText}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          2 minutes ago • {templateChannel}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Template Info</h4>
                    <div className="space-y-1 text-sm text-gray-400">
                      <div>Channel: <span className="text-white capitalize">{templateChannel}</span></div>
                      <div>Category: <span className="text-white capitalize">{templateCategory}</span></div>
                      <div>Length: <span className="text-white">{templateContent.length} chars</span></div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Variables Used</h4>
                    <div className="flex flex-wrap gap-1">
                      {variables
                        .filter(v => templateContent.includes(`{{${v.name}}}`))
                        .map(v => (
                          <span key={v.name} className="px-2 py-1 bg-blue-600 text-blue-100 rounded text-xs">
                            {v.name}
                          </span>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Channel
                    </label>
                    <div className="relative">
                      <select 
                        value={templateChannel}
                        onChange={(e) => setTemplateChannel(e.target.value as 'instagram' | 'facebook' | 'both')}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="both">Both Platforms</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <select 
                        value={templateCategory}
                        onChange={(e) => setTemplateCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      >
                        <option value="intro">Introduction</option>
                        <option value="follow-up">Follow-up</option>
                        <option value="re-engagement">Re-engagement</option>
                        <option value="promotional">Promotional</option>
                        <option value="educational">Educational</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Template Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['fitness', 'supplements', 'nutrition', 'workout', 'health'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-600">
                        {tag}
                      </span>
                    ))}
                    <button className="px-3 py-1 border border-gray-600 text-gray-400 rounded-full text-sm hover:bg-gray-700 transition flex items-center gap-1">
                      <Plus size={12} />
                      Add Tag
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400">85%</div>
                    <div className="text-sm text-gray-400">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">4.2</div>
                    <div className="text-sm text-gray-400">Avg Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400">127</div>
                    <div className="text-sm text-gray-400">Times Used</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Variables Sidebar */}
          {activeTab === 'editor' && (
            <div className="w-80 border-l border-gray-700 p-6 bg-gray-750">
              <h3 className="text-lg font-semibold text-white mb-4">Variables</h3>
              <div className="space-y-2">
                {variables.map((variable) => (
                  <button
                    key={variable.name}
                    onClick={() => insertVariable(variable.name)}
                    className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                  >
                    <div className="font-medium text-white">{`{{${variable.name}}}`}</div>
                    <div className="text-sm text-gray-400">{variable.description}</div>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">Tips</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Keep messages under 1000 characters</li>
                  <li>• Use emojis to increase engagement</li>
                  <li>• Personalize with variables</li>
                  <li>• Include clear call-to-actions</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-700 bg-gray-750">
          <div className="flex justify-between">
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition">
                <Copy size={16} />
                Duplicate
              </button>
              {template && (
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Save size={16} />
                Save Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditorModal;