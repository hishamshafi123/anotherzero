'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Clock, Play, Pause, Edit, Trash2, Plus, Users, 
  BarChart3, ChevronRight, TrendingUp, TrendingDown, Filter, 
  Search, Download, Copy, Activity, Target, Zap, Award, 
  MoreVertical, ArrowUpRight, ArrowDownRight, RefreshCw, 
  PauseCircle, PlayCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getFollowupSequences, getCurrentExecutions, getFollowupStats, type FollowupSequence, type FollowupExecution } from '../../src/lib/followup-queries';

// Enhanced interfaces for comprehensive follow-up management
interface FollowUpSequence {
  id: string;
  name: string;
  description: string;
  trigger: 'interest_detected' | 'no_response' | 'campaign_clicked' | 'tag_added';
  status: 'active' | 'paused' | 'draft';
  steps: number;
  totalTriggered: number;
  inProgress: number;
  completed: number;
  conversionRate: number;
  performance: 'high' | 'medium' | 'low';
  lastModified: string;
  createdBy: string;
  channels: ('instagram' | 'facebook')[];
}

interface CurrentExecution {
  id: string;
  contactId: string;
  contactName: string;
  contactHandle: string;
  contactAvatar: string;
  source: 'instagram' | 'facebook';
  sequenceId: string;
  sequenceName: string;
  currentStep: number;
  totalSteps: number;
  nextActionTime: string;
  engagementScore: number;
  progress: number;
  status: 'active' | 'paused' | 'waiting';
}

interface PerformanceData {
  date: string;
  triggered: number;
  completed: number;
  instagram: number;
  facebook: number;
}

// Mock data removed - now using real Supabase data

const performanceData: PerformanceData[] = [
  { date: 'Jan 1', triggered: 12, completed: 8, instagram: 7, facebook: 5 },
  { date: 'Jan 2', triggered: 15, completed: 11, instagram: 9, facebook: 6 },
  { date: 'Jan 3', triggered: 18, completed: 13, instagram: 11, facebook: 7 },
  { date: 'Jan 4', triggered: 22, completed: 16, instagram: 13, facebook: 9 },
  { date: 'Jan 5', triggered: 19, completed: 14, instagram: 10, facebook: 9 },
  { date: 'Jan 6', triggered: 25, completed: 19, instagram: 15, facebook: 10 },
  { date: 'Jan 7', triggered: 28, completed: 21, instagram: 17, facebook: 11 }
];

const channelData = [
  { name: 'Instagram', value: 68, color: '#E1306C' },
  { name: 'Facebook', value: 32, color: '#1877F2' }
];

interface FollowUpsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const FollowUpsPage: React.FC<FollowUpsPageProps> = () => {
  const [sequences, setSequences] = useState<FollowupSequence[]>([]);
  const [executions, setExecutions] = useState<FollowupExecution[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [performanceFilter, setPerformanceFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [sequencesData, executionsData, statsData] = await Promise.all([
          getFollowupSequences(),
          getCurrentExecutions(),
          getFollowupStats()
        ]);
        
        setSequences(sequencesData);
        setExecutions(executionsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading follow-up data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Use stats from Supabase or calculate fallback
  const overviewStats = useMemo(() => {
    if (stats) {
      return stats;
    }
    
    // Fallback calculation if stats not loaded
    const activeSequences = sequences.filter(s => s.status === 'active').length;
    const totalInProgress = sequences.reduce((sum, s) => sum + s.in_progress, 0);
    const totalCompleted = sequences.reduce((sum, s) => sum + s.completed, 0);
    const totalTriggered = sequences.reduce((sum, s) => sum + s.total_triggered, 0);
    const averageCompletion = totalTriggered > 0 ? (totalCompleted / totalTriggered * 100) : 0;
    const bestSequence = sequences.reduce((best, current) => 
      current.conversion_rate > best.conversion_rate ? current : best, sequences[0]);

    return {
      activeSequences,
      contactsInFollowups: totalInProgress,
      averageCompletion: averageCompletion.toFixed(1),
      bestPerforming: bestSequence?.name || 'N/A',
      bestPerformingRate: bestSequence?.conversion_rate?.toFixed(1) || '0'
    };
  }, [stats, sequences]);

  // Filter sequences based on search and filters
  const filteredSequences = useMemo(() => {
    return sequences.filter(seq => {
      const matchesSearch = seq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          seq.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || seq.status === statusFilter;
      const matchesPerformance = performanceFilter === 'all' || seq.performance === performanceFilter;
      
      return matchesSearch && matchesStatus && matchesPerformance;
    });
  }, [sequences, searchTerm, statusFilter, performanceFilter]);

  const handleToggleStatus = (id: string) => {
    setSequences(prev => prev.map(seq => {
      if (seq.id === id) {
        return {
          ...seq,
          status: seq.status === 'active' ? 'paused' : 'active'
        };
      }
      return seq;
    }));
  };

  const handleExecutionAction = (id: string, action: 'pause' | 'resume' | 'skip' | 'remove') => {
    console.log(`${action} execution:`, id);
    // Implementation for execution actions
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-900/20 text-green-400 border-green-800';
      case 'paused': return 'bg-yellow-900/20 text-yellow-400 border-yellow-800';
      case 'draft': return 'bg-gray-700 text-gray-400 border-gray-600';
      default: return 'bg-gray-700 text-gray-400 border-gray-600';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'high': return <TrendingUp size={14} />;
      case 'medium': return <TrendingUp size={14} />;
      case 'low': return <TrendingDown size={14} />;
      default: return <TrendingUp size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading follow-up sequences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Follow-up Sequences</h1>
            <p className="text-gray-400 mt-1">Automated messaging sequences and nurturing campaigns</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors">
              <Download size={16} />
              Export Data
            </button>
            <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors">
              <Plus size={18} />
              Create New Sequence
            </button>
          </div>
        </div>

        {/* Overview Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Active Sequences</p>
                <p className="text-2xl font-bold text-white mt-1">{overviewStats.activeSequences}</p>
              </div>
              <div className="p-3 bg-blue-900/30 rounded-lg">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-green-400 text-sm">
              <ArrowUpRight size={14} />
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Contacts in Follow-ups</p>
                <p className="text-2xl font-bold text-white mt-1">{overviewStats.contactsInFollowups}</p>
              </div>
              <div className="p-3 bg-green-900/30 rounded-lg">
                <Users className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-green-400 text-sm">
              <ArrowUpRight size={14} />
              <span>+8% this week</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Completion Rate</p>
                <p className="text-2xl font-bold text-white mt-1">{overviewStats.averageCompletion}%</p>
              </div>
              <div className="p-3 bg-purple-900/30 rounded-lg">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-red-400 text-sm">
              <ArrowDownRight size={14} />
              <span>-2% vs target</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Best Performing Sequence</p>
                <p className="text-xl font-bold text-white mt-1">{overviewStats.bestPerforming}</p>
                <p className="text-sm text-green-400">{overviewStats.bestPerformingRate}% conversion</p>
              </div>
              <div className="p-3 bg-yellow-900/30 rounded-lg">
                <Award className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Timeline Chart */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Performance Timeline</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Triggered
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Completed
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="triggered" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Performance Chart */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Channel Performance</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name} ${value}%`}
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sequence Management Section */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          {/* Table Header with Filters */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Sequence Management</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sequences..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
              <select
                value={performanceFilter}
                onChange={(e) => setPerformanceFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Performance</option>
                <option value="high">High Performing</option>
                <option value="medium">Medium Performing</option>
                <option value="low">Low Performing</option>
              </select>
            </div>
          </div>

          {/* Sequences Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400 font-medium">Sequence</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Performance</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Stats</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSequences.map((sequence) => (
                  <tr key={sequence.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{sequence.name}</h3>
                          <p className="text-sm text-gray-400 mb-2">{sequence.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Zap size={12} />
                              {sequence.trigger.replace('_', ' ')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {sequence.steps} steps
                            </span>
                            <div className="flex items-center gap-1">
                              {sequence.channels.includes('instagram') && <span className="text-pink-400 text-xs">IG</span>}
                              {sequence.channels.includes('facebook') && <span className="text-blue-400 text-xs">FB</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(sequence.status)}`}>
                        {sequence.status === 'active' && <PlayCircle size={12} />}
                        {sequence.status === 'paused' && <PauseCircle size={12} />}
                        {sequence.status === 'draft' && <Edit size={12} />}
                        {sequence.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1 ${getPerformanceColor(sequence.performance)}`}>
                          {getPerformanceIcon(sequence.performance)}
                          {sequence.conversionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>Triggered: <span className="text-white">{sequence.totalTriggered}</span></div>
                        <div>In Progress: <span className="text-yellow-400">{sequence.inProgress}</span></div>
                        <div>Completed: <span className="text-green-400">{sequence.completed}</span></div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(sequence.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            sequence.status === 'active' 
                              ? 'text-yellow-400 hover:bg-yellow-900/20' 
                              : 'text-green-400 hover:bg-green-900/20'
                          }`}
                          title={sequence.status === 'active' ? 'Pause' : 'Activate'}
                        >
                          {sequence.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        
                        <button className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        
                        <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors" title="Duplicate">
                          <Copy size={16} />
                        </button>
                        
                        <button className="p-2 text-purple-400 hover:bg-purple-900/20 rounded-lg transition-colors" title="Analytics">
                          <BarChart3 size={16} />
                        </button>
                        
                        <button className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current Executions Section */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Current Executions</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <RefreshCw size={16} />
                <span>Live Updates</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-700">
            {executions.map((execution) => (
              <div key={execution.id} className="p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={execution.contactAvatar} 
                      alt={execution.contactName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-white">{execution.contactName}</h3>
                        <span className="text-sm text-gray-400">{execution.contactHandle}</span>
                        <div className="flex items-center gap-1">
                          {execution.source === 'instagram' ? (
                            <span className="text-pink-400 text-xs font-medium">IG</span>
                          ) : (
                            <span className="text-blue-400 text-xs font-medium">FB</span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{execution.sequenceName}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Step {execution.currentStep} of {execution.totalSteps}</span>
                        <span>Next: {execution.nextActionTime}</span>
                        <span>Engagement: {execution.engagementScore}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="w-24 bg-gray-700 rounded-full h-2 mb-1">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${execution.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">{execution.progress}% complete</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleExecutionAction(execution.id, execution.status === 'active' ? 'pause' : 'resume')}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        title={execution.status === 'active' ? 'Pause' : 'Resume'}
                      >
                        {execution.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <button 
                        onClick={() => handleExecutionAction(execution.id, 'skip')}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Skip Step"
                      >
                        <ChevronRight size={14} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FollowUpsPage;