'use client';
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import {
  Facebook,
  Instagram,
  Users,
  LineChart as LineChartIcon,
  Activity,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import {
  getDashboardData,
  getContactStats,
  getCampaignStats,
  getCampaigns,
  MOCK_AB_TESTS,
  type Contact,
  type Campaign
} from "@/lib/supabase-queries";
import { useDashboardFilters } from '@/hooks/use-dashboard-filters';

import Card from "./Card";
import CardHeader from "./CardHeader";
import CardTitle from "./CardTitle";
import CardContent from "./CardContent";
import Kpi from "./Kpi";
import Badge from "./Badge";
import SectionTitle from "./SectionTitle";
import StepNumber from "./StepNumber";
import TemplateCard from "./TemplateCard";

import { useModal } from '@/hooks/use-modal';
import { useToast } from '@/hooks/use-toast';
import StrategyEditorModal from './StrategyEditorModal';
import ABTestDetailModal from './ABTestDetailModal';
import CreateABTestModal from './modals/CreateABTestModal';
import TemplateEditorModal from './TemplateEditorModal';
import { ToastContainer } from './ui/Toast';

const Dashboard = () => {
  console.log('🌟🌟🌟 DASHBOARD COMPONENT STARTING - CLEAN VERSION! 🌟🌟🌟');
  
  const router = useRouter();
  const { activeModal, modalData, openModal, closeModal } = useModal();
  const { toasts, toast, removeToast } = useToast();
  const { filters } = useDashboardFilters();
  const [isCreateABTestModalOpen, setIsCreateABTestModalOpen] = useState(false);
  
  // State for ALL real data from Supabase
  const [contactStats, setContactStats] = useState<any>(null);
  const [campaignStatsData, setCampaignStatsData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Local state for contact status updates
  const [contactStatuses, setContactStatuses] = useState<Record<string, string>>({});
  
  // Load ALL real data from Supabase in useEffect
  useEffect(() => {
    console.log('🎯 LOADING ALL REAL SUPABASE DATA - Contacts, Campaigns, Dashboard...');
    Promise.all([
      getContactStats(),
      getCampaignStats(), 
      getDashboardData()
    ])
      .then(([contactStatsResult, campaignStatsResult, dashboardDataResult]) => {
        console.log('🎯 REAL DATA - Contact Stats:', contactStatsResult);
        console.log('🎯 REAL DATA - Campaign Stats:', campaignStatsResult);
        console.log('🎯 REAL DATA - Dashboard Data:', dashboardDataResult);
        
        setContactStats(contactStatsResult);
        setCampaignStatsData(campaignStatsResult);
        setDashboardData(dashboardDataResult);
        setLoading(false);
      })
      .catch(error => {
        console.error('🚨 ERROR loading real Supabase data:', error);
        // Set minimal fallback data so dashboard doesn't crash
        setContactStats({ totalContacts: 0, interestedContacts: 0, activeContacts: 0 });
        setCampaignStatsData({ totalCampaigns: 0, activeCampaigns: 0, totalSent: 0, totalClicks: 0, avgCtr: 0 });
        setDashboardData({ campaignCTr: [], channelSplit: [], campaigns: [], recentContacts: [] });
        setLoading(false);
      });
  }, []);
  
  // Refs to store previous data for comparison
  const prevDataRef = useRef<{
    campaignCTr?: any[],
    channelSplit?: any[]
  }>({});

  // Deep comparison helper
  const deepEqual = useCallback((a: any, b: any): boolean => {
    if (a === b) return true;
    if (!a || !b) return false;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, index) => deepEqual(item, b[index]));
    }
    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every(key => deepEqual(a[key], b[key]));
    }
    return false;
  }, []);

  // Extract real data from Supabase state (with fallbacks for loading) - MUST BE BEFORE CONDITIONAL RETURN
  const totalContacts = contactStats?.totalContacts || 0;
  const interestedContacts = contactStats?.interestedContacts || 0;
  const interestedRate = totalContacts > 0 ? interestedContacts / totalContacts : 0;
  const totalClicks = campaignStatsData?.totalClicks || 0;
  const ctrOverall = campaignStatsData?.avgCtr || 0;
  const activeCampaigns = campaignStatsData?.activeCampaigns || 0;
 
  // Real data from Supabase dashboard queries - MUST BE BEFORE CONDITIONAL RETURN
  const channelSplit = dashboardData?.channelSplit || [];
  const campaigns = dashboardData?.campaigns || [];
  const recentContacts = dashboardData?.recentContacts || [];

  // Memoize chart data with deep comparison to prevent unnecessary re-renders - MUST BE BEFORE CONDITIONAL RETURN

  const memoizedCampaignCTr = useMemo(() => {
    const currentData = dashboardData?.campaignCTr || [];
    console.log('🔄 Using REAL Campaign CTR from Supabase dashboardData:', currentData);
    if (deepEqual(currentData, prevDataRef.current.campaignCTr)) {
      return prevDataRef.current.campaignCTr || currentData;
    }
    prevDataRef.current.campaignCTr = currentData;
    return currentData;
  }, [dashboardData?.campaignCTr, deepEqual]);

  const memoizedChannelSplit = useMemo(() => {
    const currentData = channelSplit || [];
    if (deepEqual(currentData, prevDataRef.current.channelSplit)) {
      return prevDataRef.current.channelSplit || currentData;
    }
    prevDataRef.current.channelSplit = currentData;
    return currentData;
  }, [channelSplit, deepEqual]);

  // Show loading state AFTER all hooks are called
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  const brandBlue = '#3b82f6';
  const brandPink = '#d62976';

  // Button handlers
  const handleExport = () => {
    console.log('Exporting data...');
    toast.success('Export Started', 'Your data export is being prepared.');
  };

  const handlePromoteWinner = (testId?: string, winnerId?: string) => {
    console.log('Promoting winner...', testId, winnerId);
    toast.success('Winner Promoted', 'The winning variant has been activated.');
    closeModal();
  };

  const handleViewContact = (contactData: any) => {
    openModal('contact-detail', contactData);
  };

  const handleToggleContactStatus = async (contactId: string, currentStatus: string) => {
    // Toggle between active/inactive status
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      // Update local state immediately for UI responsiveness
      setContactStatuses(prev => ({
        ...prev,
        [contactId]: newStatus
      }));
      
      // In a real implementation, this would update Supabase
      console.log(`Updating contact ${contactId} from ${currentStatus} to ${newStatus}`);
      
      // Show toast based on action
      if (newStatus === 'inactive') {
        toast.success('Contact Paused', `Contact messaging has been paused`);
      } else {
        toast.success('Contact Resumed', `Contact messaging has been resumed`);
      }
      
    } catch (error) {
      // Revert local state on error
      setContactStatuses(prev => ({
        ...prev,
        [contactId]: currentStatus
      }));
      console.error('Error updating contact status:', error);
      toast.error('Error', 'Failed to update contact status');
    }
  };

  const handleViewABTest = (testData: any) => {
    if (testData && testData.variants) {
      openModal('ab-test-detail', testData);
    } else {
      toast.error('Error', 'Unable to load A/B test data');
    }
  };

  const handleEditTemplate = (templateData?: any) => {
    openModal('template-editor', templateData);
  };

  const handleSaveStrategy = (steps: any) => {
    console.log('Saving strategy:', steps);
    toast.success('Strategy Saved', 'Your follow-up strategy has been updated.');
  };

  const handleSaveTemplate = (template: any) => {
    console.log('Saving template:', template);
    toast.success('Template Saved', 'Your message template has been saved.');
  };

  const handleEditStrategy = () => {
    openModal('strategy-editor');
  };

  const handleNavigateToContacts = () => {
    router.push('/contacts');
  };

  const handleNavigateToNewCampaign = () => {
    router.push('/new-campaign');
  };

  const handleNavigateToSettings = () => {
    router.push('/settings');
  };

  const handleCreateABTest = (testData: any) => {
    // In a real app, this would create the test via API
    console.log('Creating A/B test:', testData);
    toast.success(
      'A/B Test Created!',
      testData.sendImmediately 
        ? `${testData.name} is now running and sending messages.`
        : `${testData.name} has been created and is ready to launch.`
    );
    setIsCreateABTestModalOpen(false);
  };

  const openCreateABTestModal = () => {
    setIsCreateABTestModalOpen(true);
  };

  const closeCreateABTestModal = () => {
    setIsCreateABTestModalOpen(false);
  };

  console.log('🎨🎨🎨 CLEAN DASHBOARD ABOUT TO RENDER! 🎨🎨🎨');
  console.log('Current state:', { loading, campaignCTrData: memoizedCampaignCTr.length });

  return (
    <div className="p-6">
      {/* === OVERVIEW METRICS === */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white">📊 Overview</h2>
          <Badge tone="slate">Real-time data</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <Kpi label="Total Contacts" value={totalContacts.toLocaleString()} icon={<Users size={18} />} helper="All leads in system" />
          <Kpi label="Interested" value={`${interestedContacts} (${Math.round(interestedRate * 100)}%)`} icon={<Activity size={18} />} helper="Qualified prospects" />
          <Kpi label="Campaign Clicks" value={totalClicks.toLocaleString()} icon={<LineChartIcon size={18} />} helper="Total engagements" />
          <Kpi label="Overall CTR" value={`${Math.round(ctrOverall * 100)}%`} icon={<ArrowRight size={18} />} helper="Campaign performance" />
          <Kpi label="Active Campaigns" value={`${activeCampaigns}`} icon={<Sparkles size={18} />} helper="Currently running" />
        </div>
      </div>

      {/* === CAMPAIGN PERFORMANCE === */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white">📈 Campaign Performance</h2>
          <Badge tone="blue">Analytics</Badge>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Campaign CTR</CardTitle>
                <Badge tone="slate">By campaign</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {memoizedCampaignCTr.map((campaign: { name: string; ctr: number }, i: number) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-white">{campaign.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-600">{Math.round(campaign.ctr)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Channel Mix</CardTitle>
                <div className="flex items-center gap-2">
                  <Instagram className="text-pink-500" size={16} />
                  <Facebook className="text-blue-600" size={16} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart key="channel-pie-chart">
                  <Tooltip />
                  <Pie data={memoizedChannelSplit} dataKey="value" nameKey="name" outerRadius={90} animationDuration={0}>
                    {memoizedChannelSplit.map((_: { name: string; value: number }, index: number) => (
                      <Cell key={`slice-${index}`} fill={index === 0 ? brandPink : brandBlue} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-0 flex items-center justify-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: brandPink }} /> Instagram</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: brandBlue }} /> Facebook</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* === AUTOMATION STRATEGY === */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white">⚡ Automation Strategy</h2>
          <Badge tone="green">Live preview</Badge>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Strategy (Preview)</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              <li className="flex items-center gap-3">
                <StepNumber>1</StepNumber>
                <div className="flex-1">
                  <div className="font-medium">Initial DM</div>
                  <div className="text-sm text-gray-400">Auto-reply + qualify with 1 question → send website link (with UTM)</div>
                </div>
                <Badge tone="green">Active</Badge>
              </li>
              <li className="flex items-center gap-3">
                <StepNumber>2</StepNumber>
                <div className="flex-1">
                  <div className="font-medium">Follow-up #1</div>
                  <div className="text-sm text-gray-400">24h later if no click → soft nudge with social proof</div>
                </div>
                <Badge tone="slate">Scheduled</Badge>
              </li>
              <li className="flex items-center gap-3">
                <StepNumber>3</StepNumber>
                <div className="flex-1">
                  <div className="font-medium">Re-engagement</div>
                  <div className="text-sm text-gray-400">7 days later if still interested → different offer</div>
                </div>
                <Badge tone="slate">Conditional</Badge>
              </li>
            </ol>
            <div className="mt-4 flex items-center gap-2">
              <button 
                onClick={handleEditStrategy}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-600 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                Edit Strategy
              </button>
              <button 
                onClick={handleNavigateToSettings}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
              >
                View Automation
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* === CAMPAIGN MANAGEMENT === */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white">🎯 Campaign Management</h2>
          <Badge tone="blue">Active campaigns</Badge>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Campaigns table */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <SectionTitle
              right={
                <>
                  <button 
                    onClick={handleExport}
                    className="rounded-xl border border-gray-600 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Export
                  </button>
                  <button 
                    onClick={handleNavigateToNewCampaign}
                    className="rounded-xl bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700"
                  >
                    Create Campaign
                  </button>
                </>
              }
            >
              Messaging Campaigns
            </SectionTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Channel</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Sent</th>
                    <th className="py-2 pr-3">Clicks</th>
                    <th className="py-2 pr-3">CTR</th>
                    <th className="py-2 pr-3">A/B</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c: any, i: number) => (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="py-3 pr-3 font-medium text-white">{c.name}</td>
                      <td className="py-3 pr-3">{c.channel}</td>
                      <td className="py-3 pr-3">
                        <Badge tone={c.status === "running" ? "green" : "yellow"}>{c.status}</Badge>
                      </td>
                      <td className="py-3 pr-3">{c.sent.toLocaleString()}</td>
                      <td className="py-3 pr-3">{c.clicks.toLocaleString()} <span className="text-gray-400">({c.sent > 0 ? Math.round((c.clicks / c.sent) * 100) : 0}%)</span></td>
                      <td className="py-3 pr-3">{Math.round(c.ctr * 100)}%</td>
                      <td className="py-3 pr-3">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* AB tests */}
        <Card>
          <CardHeader>
            <SectionTitle
              right={
                <button 
                  onClick={openCreateABTestModal}
                  className="rounded-xl bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700"
                >
                  New A/B Test
                </button>
              }
            >
              A/B Tests
            </SectionTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_AB_TESTS.map((t, i) => (
                <div key={i} className="p-3 border border-gray-700 rounded-xl bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{t.name}</div>
                    <Badge tone={t.status === 'completed' ? "green" : "slate"}>{t.status}</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400">Variant A</div>
                      <div>CTR {Math.round(t.variants[0].ctr)}% • Clicks {t.variants[0].clicks}</div>
                    </div>
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400">Variant B</div>
                      <div>CTR {Math.round(t.variants[1].ctr)}% • Clicks {t.variants[1].clicks}</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                    <div>confidence {t.confidence_level}%</div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewABTest(t)}
                        className="rounded-lg border border-gray-600 px-2 py-1 text-gray-300 hover:bg-gray-700"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handlePromoteWinner(t.id, t.winner)}
                        className="rounded-lg bg-blue-600 text-white px-2 py-1 hover:bg-blue-700"
                      >
                        Promote winner
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* === CONTACT MANAGEMENT === */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white">👥 Contact Management</h2>
          <Badge tone="green">Live contacts</Badge>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <SectionTitle
              right={<button 
                onClick={handleNavigateToContacts}
                className="rounded-xl border border-gray-600 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700"
              >
                View all
              </button>}
            >
              Recent Contacts
            </SectionTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-700">
              {recentContacts.map((c: any, i: number) => (
                <li key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{c.name} <span className="text-gray-400 font-normal">{c.handle}</span></div>
                    <div className="text-xs text-gray-400">{c.channel} • User ID: {c.user_id}</div>
                    <div className="text-xs">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                        c.interest_level === 'interested' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                        c.interest_level === 'not_interested' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {c.interest_level.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggleContactStatus(c.id, contactStatuses[c.id] || c.status)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      (contactStatuses[c.id] || c.status) === 'active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                    }`}
                  >
                    {(contactStatuses[c.id] || c.status) === 'active' ? 'Pause' : 'Resume'}
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SectionTitle
              right={<button 
                onClick={() => handleEditTemplate({ title: 'Message Templates', body: '' })}
                className="rounded-xl bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700"
              >
                Edit Messages
              </button>}
            >
              Message Templates
            </SectionTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <TemplateCard title="Intro (IG)" body="Hey {{first_name}}! Want your brand featured in top outlets? Here's our PR pack → {{link}}" />
              <TemplateCard title="Intro (FB)" body="Thanks for reaching out! Quick overview + pricing here → {{link}}" />
              <TemplateCard title="Follow-up 24h" body="Still thinking it over? Here's a client result + link to pick your pack → {{link}}" />
              <TemplateCard title="Re-engagement" body="Haven't heard back - here's what our clients are saying. Still interested? → {{link}}" />
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} anothezero • CRM Dashboard</div>

      {/* Modals */}
      <StrategyEditorModal
        isOpen={activeModal === 'strategy-editor'}
        onClose={closeModal}
        onSave={handleSaveStrategy}
      />
      
      <ABTestDetailModal
        isOpen={activeModal === 'ab-test-detail'}
        onClose={closeModal}
        testData={modalData}
        onPromoteWinner={handlePromoteWinner}
      />
      
      <CreateABTestModal
        isOpen={isCreateABTestModalOpen}
        onClose={closeCreateABTestModal}
        onCreateTest={handleCreateABTest}
      />
      
      <TemplateEditorModal
        isOpen={activeModal === 'template-editor'}
        onClose={closeModal}
        templateData={modalData}
        onSave={handleSaveTemplate}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default Dashboard;