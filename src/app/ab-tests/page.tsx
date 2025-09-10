'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TestTube, Trophy, TrendingUp, Users, MousePointer, Plus, BarChart, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { MOCK_AB_TESTS } from '@/lib/supabase-queries';

const STATUS_COLORS = {
  running: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

const STATUS_ICONS = {
  running: Clock,
  completed: CheckCircle,
  paused: AlertCircle,
};

export default function ABTestsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredTests = MOCK_AB_TESTS.filter(test => 
    statusFilter === 'all' || test.status === statusFilter
  );
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const calculateLift = (variantA: any, variantB: any) => {
    if (variantA.ctr === 0) return 0;
    return ((variantB.ctr - variantA.ctr) / variantA.ctr) * 100;
  };
  
  const getWinningVariant = (test: any) => {
    if (!test.winner) return null;
    return test.variants.find((v: any) => v.id === test.winner);
  };
  
  const testStats = {
    totalTests: MOCK_AB_TESTS.length,
    runningTests: MOCK_AB_TESTS.filter(t => t.status === 'running').length,
    completedTests: MOCK_AB_TESTS.filter(t => t.status === 'completed').length,
    avgConfidence: Math.round(MOCK_AB_TESTS.reduce((sum, t) => sum + t.confidence_level, 0) / MOCK_AB_TESTS.length),
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">A/B Tests</h1>
          <p className="text-gray-400 mt-1">Create and analyze A/B tests for your campaigns</p>
        </div>
        <button 
          onClick={() => router.push('/new-campaign')}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition"
        >
          <Plus size={16} /> New A/B Test
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Tests</p>
              <p className="text-2xl font-semibold text-white">{testStats.totalTests}</p>
            </div>
            <TestTube className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Running</p>
              <p className="text-2xl font-semibold text-white">{testStats.runningTests}</p>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-semibold text-white">{testStats.completedTests}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Confidence</p>
              <p className="text-2xl font-semibold text-white">{testStats.avgConfidence}%</p>
            </div>
            <BarChart className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
      
      {/* Filter */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Filter by status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tests</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
          <div className="ml-auto text-sm text-gray-400">
            {filteredTests.length} of {MOCK_AB_TESTS.length} tests
          </div>
        </div>
      </div>
      
      {/* Tests Grid */}
      <div className="space-y-6">
        {filteredTests.map((test) => {
          const StatusIcon = STATUS_ICONS[test.status as keyof typeof STATUS_ICONS];
          const winningVariant = getWinningVariant(test);
          const [variantA, variantB] = test.variants;
          const lift = calculateLift(variantA, variantB);
          
          return (
            <div key={test.id} className="bg-gray-800 rounded-xl border border-gray-700">
              {/* Test Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{test.name}</h3>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                          STATUS_COLORS[test.status as keyof typeof STATUS_COLORS]
                        }`}>
                          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400">{test.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {test.status === 'completed' && winningVariant && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-lg">
                        <Trophy className="h-4 w-4" />
                        <span className="text-sm font-medium">Winner: {winningVariant.name}</span>
                      </div>
                    )}
                    <button className="p-2 text-gray-400 hover:text-white transition">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-400">Start Date</p>
                    <p className="text-sm text-gray-300">{formatDate(test.start_date)}</p>
                  </div>
                  {test.end_date && (
                    <div>
                      <p className="text-xs text-gray-400">End Date</p>
                      <p className="text-sm text-gray-300">{formatDate(test.end_date)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400">Confidence Level</p>
                    <p className={`text-sm font-medium ${
                      test.confidence_level >= 95 ? 'text-green-400' : 
                      test.confidence_level >= 80 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {test.confidence_level}%
                    </p>
                  </div>
                  {lift !== 0 && (
                    <div>
                      <p className="text-xs text-gray-400">Performance Lift</p>
                      <p className={`text-sm font-medium ${
                        lift > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {lift > 0 ? '+' : ''}{lift.toFixed(1)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Variants Comparison */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {test.variants.map((variant: any, index: number) => (
                    <div key={variant.id} className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">{variant.name}</h4>
                        {test.winner === variant.id && (
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      
                      <div className="bg-gray-700 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-300">{variant.message}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <p className="text-xs text-gray-400">Sent</p>
                          </div>
                          <p className="text-lg font-semibold text-white">{variant.sent.toLocaleString()}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <MousePointer className="h-4 w-4 text-gray-400" />
                            <p className="text-xs text-gray-400">Clicks</p>
                          </div>
                          <p className="text-lg font-semibold text-white">{variant.clicks.toLocaleString()}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                            <p className="text-xs text-gray-400">CTR</p>
                          </div>
                          <p className="text-lg font-semibold text-blue-400">{variant.ctr.toFixed(1)}%</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <BarChart className="h-4 w-4 text-gray-400" />
                            <p className="text-xs text-gray-400">Conversions</p>
                          </div>
                          <p className="text-lg font-semibold text-green-400">{variant.conversions}</p>
                          <p className="text-xs text-gray-400">{variant.conversion_rate.toFixed(1)}%</p>
                        </div>
                      </div>
                      
                      {/* Performance Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-400">Performance</span>
                          <span className={`${
                            test.winner === variant.id ? 'text-green-400' :
                            variant.ctr === Math.max(...test.variants.map((v: any) => v.ctr)) ? 'text-blue-400' :
                            'text-gray-400'
                          }`}>
                            {variant.ctr.toFixed(1)}% CTR
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              test.winner === variant.id ? 'bg-green-500' :
                              variant.ctr === Math.max(...test.variants.map((v: any) => v.ctr)) ? 'bg-blue-500' :
                              'bg-gray-500'
                            }`}
                            style={{ width: `${Math.min(variant.ctr * 5, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Actions */}
                <div className="flex justify-center gap-3 mt-6 pt-6 border-t border-gray-700">
                  {test.status === 'running' && (
                    <>
                      <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
                        Pause Test
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                        Declare Winner
                      </button>
                    </>
                  )}
                  {test.status === 'completed' && winningVariant && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Apply Winner to Campaign
                    </button>
                  )}
                  <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition">
                    View Detailed Report
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredTests.length === 0 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
          <TestTube className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No A/B tests found</h3>
          <p className="text-gray-400 mb-4">No tests match your current filter.</p>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition">
            <Plus size={16} /> Create Your First A/B Test
          </button>
        </div>
      )}
    </div>
  );
}