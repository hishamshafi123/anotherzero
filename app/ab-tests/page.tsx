'use client';
import React, { useState, useMemo } from 'react';
import { Plus, TrendingUp, Award, BarChart3, Target, Zap, Crown, Calendar, Eye, CheckCircle, AlertTriangle, XCircle, Clock, PlayCircle, Pause, Copy } from 'lucide-react';
import { MOCK_AB_TESTS, MOCK_CAMPAIGNS, type ABTest, type ABTestVariant } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useModal } from '@/hooks/use-modal';
import { useToast } from '@/hooks/use-toast';
import { ToastContainer } from '@/components/ui/Toast';
import ABTestDetailModal from '@/components/ABTestDetailModal';
import CreateABTestModal from '@/components/modals/CreateABTestModal';

interface ABTestsPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ABTestsPage: React.FC<ABTestsPageProps> = () => {
  const [abTests, setAbTests] = useState<ABTest[]>(MOCK_AB_TESTS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [duplicateTest, setDuplicateTest] = useState<ABTest | null>(null);
  const { activeModal, modalData, openModal, closeModal } = useModal();
  const { toasts, toast, removeToast } = useToast();

  const testStats = useMemo(() => {
    const totalTests = abTests.length;
    const completedTests = abTests.filter(t => t.status === 'completed').length;
    const runningTests = abTests.filter(t => t.status === 'running').length;
    const avgConfidence = totalTests > 0 ? Math.round(abTests.reduce((sum, test) => sum + test.confidence_level, 0) / totalTests) : 0;
    
    return {
      totalTests,
      completedTests,
      runningTests,
      avgConfidence,
      avgLift: '+15.2%'
    };
  }, [abTests]);

  const filteredTests = useMemo(() => {
    if (statusFilter === 'all') return abTests;
    return abTests.filter(test => test.status === statusFilter);
  }, [abTests, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-400';
    if (confidence >= 85) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateLift = (variantA: ABTestVariant, variantB: ABTestVariant) => {
    if (variantB.ctr === 0) return 0;
    return ((variantA.ctr - variantB.ctr) / variantB.ctr) * 100;
  };


  const promoteWinner = (testId: string) => {
    setAbTests(prev => prev.map(test => {
      if (test.id === testId) {
        const winner = test.variants.find(v => v.ctr === Math.max(...test.variants.map(variant => variant.ctr)));
        return { ...test, winner: winner?.id, status: 'completed' as const };
      }
      return test;
    }));
    toast.success('Winner Promoted!', 'The winning variant has been activated for your campaign.');
  };

  const pauseTest = (testId: string) => {
    setAbTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'paused' as const } : test
    ));
    toast.info('Test Paused', 'The A/B test has been paused.');
  };

  const resumeTest = (testId: string) => {
    setAbTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'running' as const } : test
    ));
    toast.success('Test Resumed', 'The A/B test is now running again.');
  };

  const viewTestDetails = (test: ABTest) => {
    openModal('ab-test-detail', test);
  };

  const getCampaignName = (campaignId: string) => {
    const campaign = MOCK_CAMPAIGNS.find(c => c.id === campaignId);
    return campaign?.name || 'Unknown Campaign';
  };

  const getTestDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatisticalSignificanceIcon = (confidence: number) => {
    if (confidence >= 95) return <CheckCircle className="text-green-400" size={16} />;
    if (confidence >= 85) return <AlertTriangle className="text-yellow-400" size={16} />;
    return <XCircle className="text-red-400" size={16} />;
  };

  const getStatisticalSignificanceText = (confidence: number) => {
    if (confidence >= 95) return 'Statistically Significant';
    if (confidence >= 85) return 'Moderately Significant';
    return 'Not Significant';
  };

  const createComparisonChartData = (variants: ABTestVariant[]) => {
    return variants.map(variant => ({
      name: variant.name,
      ctr: variant.ctr,
      conversions: variant.conversions,
      conversionRate: variant.conversion_rate,
      sent: variant.sent,
      clicks: variant.clicks
    }));
  };

  const handleCreateTest = (testData: any) => {
    const newTest: ABTest = {
      id: `test_${Date.now()}`,
      name: testData.name,
      description: testData.description,
      status: testData.sendImmediately ? 'running' : 'paused',
      start_date: testData.startDate,
      end_date: testData.endDate,
      confidence_level: testData.confidenceLevel,
      winner: null,
      variants: testData.variants.map((variant: any, index: number) => ({
        id: variant.id,
        name: variant.name,
        message: variant.message,
        sent: 0,
        clicks: 0,
        ctr: 0,
        conversions: 0,
        conversion_rate: 0
      }))
    };

    setAbTests(prev => [newTest, ...prev]);
    toast.success(
      'A/B Test Created!',
      testData.sendImmediately 
        ? `${testData.name} is now running and sending messages.`
        : `${testData.name} has been created and is ready to launch.`
    );
    setIsCreateModalOpen(false);
    setDuplicateTest(null);
  };

  const handleDuplicateTest = (test: ABTest) => {
    setDuplicateTest(test);
    setIsCreateModalOpen(true);
  };

  const openCreateModal = () => {
    setDuplicateTest(null);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setDuplicateTest(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">A/B Tests</h1>
            <p className="text-gray-400">Optimize your campaigns with data-driven insights</p>
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            New A/B Test
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{testStats.totalTests}</div>
            <div className="text-sm text-gray-400">Total Tests</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <Zap className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{testStats.runningTests}</div>
            <div className="text-sm text-gray-400">Running Tests</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{testStats.completedTests}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-600/20 rounded-lg">
                <Target className="h-6 w-6 text-orange-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{testStats.avgConfidence}%</div>
            <div className="text-sm text-gray-400">Avg Confidence</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-pink-600/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-pink-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{testStats.avgLift}</div>
            <div className="text-sm text-gray-400">Avg Lift</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-gray-300 font-medium">Filter by status:</span>
          <div className="flex gap-2">
            {['all', 'running', 'completed', 'paused'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {status === 'all' ? 'All Tests' : status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-600 rounded-full text-xs">
                    {abTests.filter(t => t.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* A/B Tests List */}
      <div className="space-y-6">
        {filteredTests.map((test) => {
          const [variantA, variantB] = test.variants;
          const lift = variantA && variantB ? calculateLift(variantA, variantB) : 0;

          return (
            <div key={test.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {/* Test Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{test.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(test.status)}`}>
                      {test.status.toUpperCase()}
                    </span>
                    {test.winner && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Crown size={14} />
                        <span className="text-xs font-medium">Winner Selected</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 mb-3">{test.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(test.start_date)}</span>
                      {test.end_date && <span> - {formatDate(test.end_date)}</span>}
                    </div>
                    <div>Campaign: {getCampaignName(test.campaign_id)}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`text-2xl font-bold ${getConfidenceColor(test.confidence_level)}`}>
                    {test.confidence_level}%
                  </div>
                  <div className="text-xs text-gray-400">Confidence</div>
                  {test.status === 'completed' && !test.winner && test.confidence_level >= 95 && (
                    <button
                      onClick={() => promoteWinner(test.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition"
                    >
                      Promote Winner
                    </button>
                  )}
                  {test.winner && (
                    <div className="px-2 py-1 bg-green-600/20 border border-green-600/30 rounded text-xs text-green-400">
                      Winner Promoted
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Chart */}
              {test.variants.length > 1 && (
                <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                    <BarChart3 size={18} />
                    Performance Comparison
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={createComparisonChartData(test.variants)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151', 
                            borderRadius: '8px' 
                          }} 
                        />
                        <Bar dataKey="ctr" fill="#3B82F6" name="CTR (%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="conversionRate" fill="#10B981" name="Conversion Rate (%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Statistical Significance Indicator */}
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatisticalSignificanceIcon(test.confidence_level)}
                    <div>
                      <h4 className="text-white font-medium">{getStatisticalSignificanceText(test.confidence_level)}</h4>
                      <p className="text-sm text-gray-400">
                        {test.confidence_level}% confidence level • {getTestDuration(test.start_date, test.end_date)} days duration
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{lift > 0 ? '+' : ''}{lift.toFixed(1)}%</div>
                    <div className="text-sm text-gray-400">Lift vs Control</div>
                  </div>
                </div>
                
                {test.confidence_level < 95 && (
                  <div className="mt-3 p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                    <p className="text-sm text-yellow-300">
                      ⚠️ Consider running the test longer to achieve statistical significance (95%+ confidence)
                    </p>
                  </div>
                )}
              </div>

              {/* Variants Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {test.variants.map((variant, index) => {
                  const isWinner = test.winner === variant.id;
                  const isLoser = test.winner && test.winner !== variant.id;
                  
                  return (
                    <div 
                      key={variant.id} 
                      className={`p-4 rounded-lg border-2 ${
                        isWinner 
                          ? 'border-green-500 bg-green-500/10' 
                          : isLoser 
                            ? 'border-red-500/50 bg-red-500/5'
                            : 'border-gray-600 bg-gray-700'
                      }`}
                    >
                      {/* Variant Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
                          <h4 className="font-semibold text-white">{variant.name}</h4>
                          {isWinner && (
                            <div className="flex items-center gap-1 text-green-400">
                              <Crown size={14} />
                              <span className="text-xs font-medium">WINNER</span>
                            </div>
                          )}
                        </div>
                        {lift !== 0 && index === 0 && (
                          <div className={`text-sm font-bold ${lift > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {lift > 0 ? '+' : ''}{lift.toFixed(1)}% lift
                          </div>
                        )}
                      </div>

                      {/* Message Preview */}
                      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-300">{variant.message}</div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{variant.sent.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">Sent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">{variant.clicks.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">Clicks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-400">{variant.ctr}%</div>
                          <div className="text-xs text-gray-400">CTR</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{variant.conversions}</div>
                          <div className="text-xs text-gray-400">Conversions</div>
                        </div>
                      </div>

                      {/* Conversion Rate */}
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Conversion Rate</span>
                          <span className="text-sm font-bold text-white">{variant.conversion_rate}%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${index === 0 ? 'bg-blue-400' : 'bg-purple-400'}`}
                            style={{ width: `${Math.min(variant.conversion_rate * 5, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Test Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  {test.status === 'running' && 'Test is currently running...'}
                  {test.status === 'completed' && test.end_date && `Completed on ${formatDate(test.end_date)}`}
                  {test.status === 'paused' && 'Test is paused'}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => viewTestDetails(test)}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm"
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                  <button 
                    onClick={() => handleDuplicateTest(test)}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
                  >
                    <Copy size={14} />
                    Duplicate Test
                  </button>
                  {test.status === 'running' && (
                    <button 
                      onClick={() => pauseTest(test.id)}
                      className="flex items-center gap-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition text-sm"
                    >
                      <Pause size={14} />
                      Pause Test
                    </button>
                  )}
                  {test.status === 'paused' && (
                    <button 
                      onClick={() => resumeTest(test.id)}
                      className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm"
                    >
                      <PlayCircle size={14} />
                      Resume Test
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistical Significance Guide */}
      <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Understanding Statistical Significance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-medium text-green-400">95%+ Confidence</span>
            </div>
            <p className="text-sm text-gray-300">Results are statistically significant. Safe to implement the winning variant.</p>
          </div>
          <div className="p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="font-medium text-yellow-400">85-94% Confidence</span>
            </div>
            <p className="text-sm text-gray-300">Promising results, but consider running the test longer for higher confidence.</p>
          </div>
          <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="font-medium text-red-400">&lt;85% Confidence</span>
            </div>
            <p className="text-sm text-gray-300">Results are not statistically significant. Continue testing or try different variants.</p>
          </div>
        </div>
      </div>

      {/* Test History Overview */}
      <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock size={18} />
          Test History Overview
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={abTests.map(test => ({
              name: test.name.substring(0, 15) + '...',
              confidence: test.confidence_level,
              duration: getTestDuration(test.start_date, test.end_date),
              status: test.status
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151', 
                  borderRadius: '8px' 
                }} 
              />
              <Line type="monotone" dataKey="confidence" stroke="#3B82F6" strokeWidth={2} name="Confidence %" />
              <Line type="monotone" dataKey="duration" stroke="#10B981" strokeWidth={2} name="Duration (days)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Empty State */}
      {filteredTests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🧪</div>
          <h3 className="text-xl font-semibold text-white mb-2">No A/B tests found</h3>
          <p className="text-gray-400 mb-6">
            {statusFilter === 'all' 
              ? "Start testing different message variants to optimize your campaigns"
              : `No ${statusFilter} tests at the moment`
            }
          </p>
          <button 
            onClick={openCreateModal}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Your First A/B Test
          </button>
        </div>
      )}

      {/* Modals */}
      <ABTestDetailModal
        isOpen={activeModal === 'ab-test-detail'}
        onClose={closeModal}
        testData={modalData}
        onPromoteWinner={promoteWinner}
      />
      
      <CreateABTestModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        duplicateFromTest={duplicateTest}
        onCreateTest={handleCreateTest}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default ABTestsPage;