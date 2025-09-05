'use client';
import React, { useState } from 'react';
import { 
  Clock, Play, Pause, Edit, Trash2, Plus, 
  Users, MessageSquare, BarChart3, Calendar,
  ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';

interface FollowUp {
  id: string;
  name: string;
  description: string;
  trigger: 'time' | 'action' | 'condition';
  delay: string;
  status: 'active' | 'paused' | 'draft';
  contacts: number;
  sent: number;
  opened: number;
  clicked: number;
  lastRun: string;
  template: string;
}

const mockFollowUps: FollowUp[] = [
  {
    id: '1',
    name: 'Initial DM Response',
    description: 'Auto-reply + qualify with 1 question → send website link (with UTM)',
    trigger: 'action',
    delay: 'Immediate',
    status: 'active',
    contacts: 156,
    sent: 142,
    opened: 128,
    clicked: 89,
    lastRun: '2 hours ago',
    template: 'Hey {{first_name}}! Thanks for the comment on our {{post_topic}} post! Are you currently using any supplements for {{interest}}? Here\'s our top recommendation: {{link}}'
  },
  {
    id: '2',
    name: 'Follow-up #1 - Soft Nudge',
    description: '24h later if no click → soft nudge with social proof',
    trigger: 'time',
    delay: '24 hours',
    status: 'active',
    contacts: 67,
    sent: 52,
    opened: 41,
    clicked: 23,
    lastRun: '6 hours ago',
    template: 'Hey {{first_name}}! Still thinking it over? Here\'s what Sarah from NYC said: "This changed my whole routine!" {{link}}'
  },
  {
    id: '3',
    name: 'Re-engagement Offer',
    description: '7 days later if still interested → different offer',
    trigger: 'condition',
    delay: '7 days',
    status: 'paused',
    contacts: 34,
    sent: 28,
    opened: 22,
    clicked: 12,
    lastRun: '1 day ago',
    template: 'Hey {{first_name}}! Since you\'re interested in {{interest}}, we have a special 20% off deal just for you: {{discount_link}}'
  },
  {
    id: '4',
    name: 'Long-term Nurture',
    description: 'Monthly value-add content for engaged leads',
    trigger: 'time',
    delay: '30 days',
    status: 'draft',
    contacts: 0,
    sent: 0,
    opened: 0,
    clicked: 0,
    lastRun: 'Never',
    template: 'Hey {{first_name}}! Here\'s this month\'s {{interest}} tip from our experts...'
  }
];

const FollowUpsPage = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>(mockFollowUps);
  const [selectedFollowUp, setSelectedFollowUp] = useState<string | null>(null);

  const handleToggleStatus = (id: string) => {
    setFollowUps(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          status: f.status === 'active' ? 'paused' : 'active'
        };
      }
      return f;
    }));
  };

  const handleEdit = (id: string) => {
    console.log('Edit follow-up:', id);
    // TODO: Open edit modal
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this follow-up?')) {
      setFollowUps(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleCreateNew = () => {
    console.log('Create new follow-up');
    // TODO: Open create modal
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'paused': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'draft': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 size={14} className="text-green-600" />;
      case 'paused': return <Pause size={14} className="text-yellow-600" />;
      case 'draft': return <AlertCircle size={14} className="text-slate-600" />;
      default: return <AlertCircle size={14} className="text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Follow-up Sequences</h1>
          <p className="text-slate-600">Automated follow-up campaigns for lead nurturing</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          New Follow-up
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">4</div>
              <div className="text-sm text-slate-600">Active Sequences</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">257</div>
              <div className="text-sm text-slate-600">Contacts in Queue</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">222</div>
              <div className="text-sm text-slate-600">Messages Sent</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">124</div>
              <div className="text-sm text-slate-600">Link Clicks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Follow-up Sequences</h2>
        </div>
        
        <div className="divide-y divide-slate-200">
          {followUps.map((followUp) => (
            <div key={followUp.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{followUp.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(followUp.status)}`}>
                      {getStatusIcon(followUp.status)}
                      {followUp.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-slate-500">
                      Delay: {followUp.delay}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 mb-3">{followUp.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{followUp.contacts} contacts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      <span>{followUp.sent} sent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 size={14} />
                      <span>{followUp.clicked} clicked</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Last: {followUp.lastRun}</span>
                    </div>
                  </div>
                  
                  {selectedFollowUp === followUp.id && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Template Preview:</h4>
                      <p className="text-sm text-slate-600 italic">{followUp.template}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setSelectedFollowUp(selectedFollowUp === followUp.id ? null : followUp.id)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="View template"
                  >
                    <ChevronRight 
                      size={16} 
                      className={`transition-transform ${selectedFollowUp === followUp.id ? 'rotate-90' : ''}`} 
                    />
                  </button>
                  
                  <button
                    onClick={() => handleToggleStatus(followUp.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      followUp.status === 'active' 
                        ? 'text-yellow-600 hover:bg-yellow-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={followUp.status === 'active' ? 'Pause' : 'Activate'}
                  >
                    {followUp.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  
                  <button
                    onClick={() => handleEdit(followUp.id)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(followUp.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowUpsPage;