'use client';
import React, { useMemo } from "react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Legend,
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
  MOCK_CONTACTS,
  MOCK_CAMPAIGNS,
  MOCK_AB_TESTS,
  getCampaignStats,
  getContactStats
} from "@/lib/mock-data";

import Card from "./Card";
import CardHeader from "./CardHeader";
import CardTitle from "./CardTitle";
import CardContent from "./CardContent";
import Kpi from "./Kpi";
import Badge from "./Badge";
import SectionTitle from "./SectionTitle";
import StepNumber from "./StepNumber";
import TemplateCard from "./TemplateCard";

// We'll implement these simply without external dependencies
const useModal = () => ({ activeModal: null, modalData: null, openModal: () => {}, closeModal: () => {} });
const useToast = () => ({ toasts: [], toast: { success: () => {}, info: () => {} }, removeToast: () => {} });

const Dashboard = () => {
  const router = useRouter();
  const { openModal } = useModal();
  const { toast } = useToast();
  
  // Get stats from mock data
  const contactStats = getContactStats();
  const campaignStats = getCampaignStats();
  
  const filteredCampaigns = useMemo(() => {
    return MOCK_CAMPAIGNS.filter((c) => true); // Show all campaigns for now
  }, []);
  
  // Create chart data from mock data
  const engagementByDay = [
    { day: 'Mon', contacts: 1240, interested: 589, clicks: 234 },
    { day: 'Tue', contacts: 1180, interested: 612, clicks: 278 },
    { day: 'Wed', contacts: 1320, interested: 634, clicks: 245 },
    { day: 'Thu', contacts: 1410, interested: 698, clicks: 312 },
    { day: 'Fri', contacts: 1280, interested: 567, clicks: 198 },
    { day: 'Sat', contacts: 980, interested: 445, clicks: 167 },
    { day: 'Sun', contacts: 890, interested: 398, clicks: 143 }
  ];
  
  const campaignCTr = MOCK_CAMPAIGNS.map(c => ({ name: c.name, ctr: c.ctr / 100 }));
  
  const channelSplit = [
    { name: 'Instagram', value: MOCK_CONTACTS.filter(c => c.source === 'instagram').length },
    { name: 'Facebook', value: MOCK_CONTACTS.filter(c => c.source === 'facebook').length }
  ];
  
  const recentContacts = MOCK_CONTACTS.slice(0, 5);
  
  const brandBlue = '#3b82f6';
  const brandBlack = '#1f2937';

  // Button handlers
  const handleExport = () => {
    console.log('Exporting data...');
    toast.success('Export Started', 'Your data export is being prepared.');
  };

  const handlePromoteWinner = () => {
    console.log('Promoting winner...');
    toast.success('Winner Promoted', 'The winning variant has been activated.');
  };

  const handleDuplicate = (templateData: any) => {
    console.log('Duplicating template...', templateData);
    toast.success('Template Duplicated', 'A copy has been created.');
  };

  const handleViewContact = (contactData: any) => {
    openModal('contact-detail', contactData);
  };

  const handleViewABTest = (testData: any) => {
    openModal('ab-test-detail', testData);
  };

  const handleEditTemplate = (templateData: any) => {
    openModal('template-editor', templateData);
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

  const totalContacts = contactStats.totalContacts;
  const interestedContacts = contactStats.interestedContacts;
  const interestedRate = interestedContacts / totalContacts;
  const totalClicks = MOCK_CONTACTS.reduce((sum, c) => sum + c.clicks_count, 0);
  const ctrOverall = campaignStats.avgCTR / 100;
  const activeCampaigns = campaignStats.activeCampaigns;

  return (
    <div className="p-5">
      {/* KPI grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Kpi label="Total Contacts" value={totalContacts.toLocaleString()} icon={<Users size={18} />} helper="Across IG + FB" />
        <Kpi label="Interested Contacts" value={interestedContacts.toLocaleString()} icon={<Activity size={18} />} helper={`${Math.round(interestedRate * 100)}% interest rate`} />
        <Kpi label="Total Clicks" value={totalClicks.toLocaleString()} icon={<LineChartIcon size={18} />} helper="Link clicks" />
        <Kpi label="Overall CTR" value={`${Math.round(ctrOverall * 100)}%`} icon={<ArrowRight size={18} />} helper="DM → Website" />
        <Kpi label="Active Campaigns" value={`${activeCampaigns}`} icon={<Sparkles size={18} />} helper="Running now" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Engagement Over Time</CardTitle>
              <Badge>Period: Last 7 days</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(v: number, n: string) => `${v} ${n}`} />
                <Legend />
                <Line type="monotone" dataKey="contacts" stroke={brandBlue} strokeWidth={2} dot={false} name="Contacts" />
                <Line type="monotone" dataKey="interested" stroke="#10b981" strokeWidth={2} dot={false} name="Interested" />
                <Line type="monotone" dataKey="clicks" stroke="#f59e0b" strokeWidth={2} dot={false} name="Clicks" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Campaign CTR</CardTitle>
              <Badge tone="slate">By campaign</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignCTr}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} />
                <Tooltip formatter={(v: number) => `${Math.round(v * 100)}%`} />
                <Bar dataKey="ctr" radius={[6, 6, 0, 0]}>
                  {campaignCTr.map((_, i) => (
                    <Cell key={i} fill={brandBlue} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-1">
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
              <PieChart>
                <Tooltip />
                <Pie data={channelSplit} dataKey="value" nameKey="name" outerRadius={90}>
                  {channelSplit.map((_, index) => (
                    <Cell key={`slice-${index}`} fill={index === 0 ? brandBlue : brandBlack} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 flex items-center justify-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: brandBlue }} /> Instagram</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: brandBlack }} /> Facebook</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Follow-up Strategy (Preview)</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              <li className="flex items-center gap-3">
                <StepNumber>1</StepNumber>
                <div className="flex-1">
                  <div className="font-medium">Initial DM</div>
                  <div className="text-sm text-slate-500">Auto-reply + qualify with 1 question → send website link (with UTM)</div>
                </div>
                <Badge tone="green">Active</Badge>
              </li>
              <li className="flex items-center gap-3">
                <StepNumber>2</StepNumber>
                <div className="flex-1">
                  <div className="font-medium">Follow-up #1</div>
                  <div className="text-sm text-slate-500">24h later if no click → soft nudge with social proof</div>
                </div>
                <Badge tone="slate">Scheduled</Badge>
              </li>
              <li className="flex items-center gap-3">
                <StepNumber>3</StepNumber>
                <div className="flex-1">
                  <div className="font-medium">Re-engagement</div>
                  <div className="text-sm text-slate-500">7 days later if still interested → different offer</div>
                </div>
                <Badge tone="slate">Conditional</Badge>
              </li>
            </ol>
            <div className="mt-4 flex items-center gap-2">
              <button 
                onClick={handleEditStrategy}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
              >
                Edit Strategy
              </button>
              <button 
                onClick={handleNavigateToSettings}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-2 text-sm hover:bg-black"
              >
                View Automation
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns & AB Tests */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
        {/* Campaigns table */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <SectionTitle
              right={
                <>
                  <button 
                    onClick={handleExport}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
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
                  <tr className="text-left text-slate-500 border-b border-slate-100">
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
                  {filteredCampaigns.map((c, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-3 pr-3 font-medium text-slate-900">{c.name}</td>
                      <td className="py-3 pr-3">{c.channel}</td>
                      <td className="py-3 pr-3">
                        <Badge tone={c.status === "Running" ? "green" : "yellow"}>{c.status}</Badge>
                      </td>
                      <td className="py-3 pr-3">{c.sent.toLocaleString()}</td>
                      <td className="py-3 pr-3">{c.clicks.toLocaleString()} <span className="text-slate-400">({Math.round((c.clicks / c.sent) * 100)}%)</span></td>
                      <td className="py-3 pr-3">{Math.round(c.ctr * 100)}%</td>
                      <td className="py-3 pr-3">{c.ab}</td>
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
                  onClick={() => toast.info('Feature Coming Soon', 'A/B test creation will be available soon.')}
                  className="rounded-xl bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-black"
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
                <div key={i} className="p-3 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{t.name}</div>
                    <Badge tone={t.status === 'completed' ? "green" : "slate"}>{t.status}</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-slate-500">Variant A</div>
                      <div>CTR {Math.round(t.variants[0].ctr)}% • Clicks {t.variants[0].clicks}</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-slate-500">Variant B</div>
                      <div>CTR {Math.round(t.variants[1].ctr)}% • Clicks {t.variants[1].clicks}</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <div>confidence {t.confidence_level}%</div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewABTest(t)}
                        className="rounded-lg border border-slate-200 px-2 py-1 hover:bg-slate-50"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={handlePromoteWinner}
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

      {/* Recent contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <SectionTitle
              right={<button 
                onClick={handleNavigateToContacts}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
              >
                View all
              </button>}
            >
              Recent Contacts
            </SectionTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-slate-100">
              {recentContacts.map((c, i) => (
                <li key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{c.name} <span className="text-slate-400 font-normal">{c.handle}</span></div>
                    <div className="text-xs text-slate-500">{c.source} • {c.status}</div>
                    <div className="text-xs">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                        c.interest_level === 'interested' ? 'bg-green-100 text-green-700' : 
                        c.interest_level === 'not_interested' ? 'bg-red-100 text-red-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {c.interest_level.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleViewContact(c)}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-sm hover:bg-slate-50"
                  >
                    View Contact
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
              <TemplateCard title="Intro (IG)" body="Hey {{first_name}}! Want your brand featured in top outlets? Here’s our PR pack → {{link}}" />
              <TemplateCard title="Intro (FB)" body="Thanks for reaching out! Quick overview + pricing here → {{link}}" />
              <TemplateCard title="Follow-up 24h" body="Still thinking it over? Here's a client result + link to pick your pack → {{link}}" />
              <TemplateCard title="Re-engagement" body="Haven't heard back - here's what our clients are saying. Still interested? → {{link}}" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-slate-400">© {new Date().getFullYear()} anothezero • CRM Dashboard</div>
    </div>
  );
};

export default Dashboard;
