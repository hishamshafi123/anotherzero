'use client';
import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import { Save, Copy } from 'lucide-react';

interface TemplateData {
  title: string;
  body: string;
  type?: 'intro' | 'followup' | 'reengagement';
  channel?: 'instagram' | 'facebook' | 'both';
}

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateData?: TemplateData | null;
  onSave: (template: TemplateData) => void;
}

const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({ 
  isOpen, 
  onClose, 
  templateData,
  onSave 
}) => {
  const [template, setTemplate] = useState<TemplateData>({
    title: '',
    body: '',
    type: 'intro',
    channel: 'both'
  });

  useEffect(() => {
    if (templateData) {
      setTemplate({
        title: templateData.title || '',
        body: templateData.body || '',
        type: templateData.type || 'intro',
        channel: templateData.channel || 'both'
      });
    }
  }, [templateData]);

  const handleSave = () => {
    onSave(template);
    onClose();
  };

  const handleCopyTemplate = (templateText: string, templateTitle: string) => {
    setTemplate(prev => ({
      ...prev,
      title: templateTitle,
      body: templateText
    }));
  };

  const predefinedTemplates = [
    {
      title: 'Intro (IG)',
      body: 'Hey {{first_name}}! Want your brand featured in top outlets? Here\'s our PR pack → {{link}}'
    },
    {
      title: 'Intro (FB)',
      body: 'Thanks for reaching out! Quick overview + pricing here → {{link}}'
    },
    {
      title: 'Follow-up 24h',
      body: 'Still thinking it over? Here\'s a client result + link to pick your pack → {{link}}'
    },
    {
      title: 'Re-engagement',
      body: 'Haven\'t heard back - here\'s what our clients are saying. Still interested? → {{link}}'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Message Templates" size="xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Template Editor</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Name
            </label>
            <input
              type="text"
              value={template.title}
              onChange={(e) => setTemplate(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Fitness Intro Message"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={template.type}
                onChange={(e) => setTemplate(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="intro">Intro Message</option>
                <option value="followup">Follow-up</option>
                <option value="reengagement">Re-engagement</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Channel
              </label>
              <select
                value={template.channel}
                onChange={(e) => setTemplate(prev => ({ ...prev, channel: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="both">Both Channels</option>
                <option value="instagram">Instagram Only</option>
                <option value="facebook">Facebook Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message Content
            </label>
            <textarea
              value={template.body}
              onChange={(e) => setTemplate(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Write your message here... Use {{first_name}}, {{link}}, etc. for variables"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <h5 className="text-sm font-medium text-blue-900 mb-1">Available Variables</h5>
            <div className="text-xs text-blue-800 space-y-1">
              <div><code>{'{{first_name}}'}</code> - Contact's first name</div>
              <div><code>{'{{name}}'}</code> - Full name</div>
              <div><code>{'{{link}}'}</code> - Campaign link with UTM tracking</div>
              <div><code>{'{{handle}}'}</code> - Social media handle</div>
            </div>
          </div>
        </div>

        {/* Template Library */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Template Library</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {predefinedTemplates.map((tmpl, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{tmpl.title}</h5>
                  <button
                    onClick={() => handleCopyTemplate(tmpl.body, tmpl.title)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                  >
                    <Copy size={14} />
                    Use
                  </button>
                </div>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {tmpl.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Character count: {template.body.length} (recommended: under 500)
        </div>
        
        <div className="flex gap-3">
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
            Save Template
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TemplateEditorModal;