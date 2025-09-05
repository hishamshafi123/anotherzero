import React, { useMemo, useState } from "react";
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
  ShoppingCart,
  LineChart as LineChartIcon,
  Activity,
  Clock,
  TestTube,
  Sparkles,
  Settings,
  ArrowUpRight,
  Plus,
  Search,
  ArrowRight,
} from "lucide-react";

/**
 * anothezero CRM – Single-file dashboard mock (white/black/blue theme)
 * - Sidebar: Dashboard, Facebook, Instagram, Contacts, Campaigns, A/B Tests
 * - Topbar: Search, filters (date range, channel), primary actions
 * - Metrics: contacts, purchases, revenue, response rate, CTR, active campaigns
 * - Charts: purchases over time, campaign CTR, channel split
 * - Tables: campaigns, A/B tests, recent contacts
 * - Editors: follow-up strategy preview + CTA to edit
 *
 * Designed to be clean, high-contrast, and production-leaning.
 */

// --- Mock data --------------------------------------------------------------
const purchasesByDay = [
  { day: "Mon", purchases: 42, revenue: 9800 },
  { day: "Tue", purchases: 53, revenue: 11200 },
  { day: "Wed", purchases: 61, revenue: 12800 },
  { day: "Thu", purchases: 47, revenue: 10200 },
  { day: "Fri", purchases: 72, revenue: 16100 },
  { day: "Sat", purchases: 89, revenue: 19800 },
  { day: "Sun", purchases: 28, revenue: 6400 },
];

const campaignCTr = [
  { name: "Evergreen PR Pack", ctr: 0.41 },
  { name: "Founder Feature", ctr: 0.36 },
  { name: "Pro Launch Bundle", ctr: 0.48 },
  { name: "Summer Sale", ctr: 0.33 },
];

const channelSplit = [
  { name: "Instagram", value: 62 },
  { name: "Facebook", value: 38 },
];

const campaigns = [
  {
    name: "Evergreen PR Pack",
    channel: "Instagram",
    status: "Running",
    sent: 8421,
    clicks: 3612,
    purchases: 221,
    revenue: 55400,
    ab: "A/B: CTA Short vs Long",
  },
  {
    name: "Founder Feature",
    channel: "Facebook",
    status: "Running",
    sent: 6210,
    clicks: 1998,
    purchases: 112,
    revenue: 27800,
    ab: "Copy Tone: Urgency vs Proof",
  },
  {
    name: "Pro Launch Bundle",
    channel: "Instagram",
    status: "Paused",
    sent: 3120,
    clicks: 1497,
    purchases: 59,
    revenue: 15200,
    ab: "Follow-up Timing 24h vs 48h",
  },
];

const abTests = [
  {
    test: "DM CTA length",
    variantA: { ctr: 0.42, purchases: 132 },
    variantB: { ctr: 0.49, purchases: 160 },
    pValue: 0.03,
    status: "B winning",
  },
  {
    test: "Follow-up delay",
    variantA: { ctr: 0.35, purchases: 88 },
    variantB: { ctr: 0.33, purchases: 79 },
    pValue: 0.18,
    status: "Needs data",
  },
];

const recentContacts = [
  { name: "Aarav S.", handle: "@aarav.builds", channel: "Instagram", stage: "Clicked Link" },
  { name: "Maya K.", handle: "@maya.k", channel: "Facebook", stage: "Replied" },
  { name: "Rohit D.", handle: "@rohit.d", channel: "Instagram", stage: "Purchased" },
  { name: "Sara P.", handle: "@sarap", channel: "Instagram", stage: "New" },
  { name: "John T.", handle: "@john.team", channel: "Facebook", stage: "Abandoned Checkout" },
];

// --- Theme helpers ----------------------------------------------------------
const brandBlue = "#1d4ed8"; // tailwind blue-700
const brandBlueLight = "#dbeafe"; // blue-100
const brandBlack = "#0b0f19"; // near-black

// --- Small UI building blocks (Tailwind) -----------------------------------
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}>{children}</div>
);
const CardHeader: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <div className={`px-5 pt-4 pb-2 border-b border-slate-100 ${className}`}>{children}</div>
);
const CardTitle: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <h3 className={`text-slate-900 font-semibold ${className}`}>{children}</h3>
);
const CardContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

const Kpi: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
  helper?: string;
}> = ({ label, value, icon, helper }) => (
  <Card>
    <CardContent className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-blue-50 text-blue-700">{icon}</div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {helper && <div className="text-xs text-slate-500 mt-1">{helper}</div>}
      </div>
      <ArrowUpRight className="text-slate-300" />
    </CardContent>
  </Card>
);

const Badge: React.FC<React.PropsWithChildren<{ tone?: "blue" | "slate" | "green" | "yellow" }>> = ({ children, tone = "blue" }) => {
  const toneMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-green-50 text-green-700 border-green-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs ${toneMap[tone]}`}>{children}</span>;
};

const SectionTitle: React.FC<React.PropsWithChildren<{ right?: React.ReactNode }>> = ({ children, right }) => (
  <div className="flex items-center justify-between mb-3">
    <h4 className="text-slate-900 font-semibold">{children}</h4>
    <div className="flex items-center gap-2">{right}</div>
  </div>
);

// --- Main component ---------------------------------------------------------
export default function Dashboard() {
  const [channel, setChannel] = useState<"All" | "Instagram" | "Facebook">("All");
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => (channel === "All" ? true : c.channel === channel));
  }, [channel]);

  const totalContacts = 12480;
  const purchases = 392;
  const revenue = 98400;
  const responseRate = 0.86;
  const avgFirstReplyMins = 2;
  const ctrOverall = 0.42;
  const activeCampaigns = filteredCampaigns.filter((c) => c.status === "Running").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-white/80 backdrop-blur sticky top-0 h-screen hidden lg:flex flex-col">
          <div className="px-5 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow text-white font-bold">A0</div>
              <div>
                <div className="font-semibold">anothezero CRM</div>
                <div className="text-xs text-slate-500">White • Black • Blue</div>
              </div>
            </div>
          </div>

          <nav className="p-3 text-sm">
            <SidebarLink icon={<LineChartIcon size={18} />} label="Dashboard" active />
            <SidebarLink icon={<Instagram size={18} />} label="Instagram" />
            <SidebarLink icon={<Facebook size={18} />} label="Facebook" />
            <SidebarLink icon={<Users size={18} />} label="Contacts" />
            <SidebarLink icon={<Sparkles size={18} />} label="Campaigns" />
            <SidebarLink icon={<TestTube size={18} />} label="A/B Tests" />
            <div className="mt-auto" />
          </nav>

          <div className="p-4 mt-auto">
            <div className="text-xs text-slate-500">System Health</div>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-slate-600">APIs nominal</span>
            </div>
            <button className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white py-2 text-sm hover:bg-black transition">
              <Settings size={16} /> Settings
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Topbar */}
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
            <div className="px-5 py-3 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  placeholder="Search contacts, campaigns, messages…"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="hidden md:flex items-center gap-2">
                <FilterPill active={range === "7d"} onClick={() => setRange("7d")}>7d</FilterPill>
                <FilterPill active={range === "30d"} onClick={() => setRange("30d")}>30d</FilterPill>
                <FilterPill active={range === "90d"} onClick={() => setRange("90d")}>90d</FilterPill>
              </div>

              <div className="flex items-center gap-2">
                <ChannelSwitch value={channel} onChange={setChannel} />
                <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition">
                  <Plus size={16} /> New Campaign
                </button>
              </div>
            </div>
          </header>

          {/* Content body */}
          <div className="p-5">
            {/* KPI grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <Kpi label="Total Contacts" value={totalContacts.toLocaleString()} icon={<Users size={18} />} helper="Across IG + FB" />
              <Kpi label="Purchases" value={purchases.toLocaleString()} icon={<ShoppingCart size={18} />} helper="CVR 3.1%" />
              <Kpi label="Revenue" value={`$${revenue.toLocaleString()}`} icon={<LineChartIcon size={18} />} helper="This period" />
              <Kpi label="Response Rate" value={`${Math.round(responseRate * 100)}%`} icon={<Activity size={18} />} helper={`Median reply ${avgFirstReplyMins}m`} />
              <Kpi label="Overall CTR" value={`${Math.round(ctrOverall * 100)}%`} icon={<ArrowRight size={18} />} helper="DM → Website" />
              <Kpi label="Active Campaigns" value={`${activeCampaigns}`} icon={<Sparkles size={18} />} helper="Running now" />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Purchases Over Time</CardTitle>
                    <Badge>Period: {range}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={purchasesByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(v: number, n: string) => (n === "purchases" ? `${v}` : `$${v.toLocaleString()}`)} />
                      <Legend />
                      <Line type="monotone" dataKey="purchases" stroke={brandBlue} strokeWidth={2} dot={false} />
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
                        {channelSplit.map((entry, index) => (
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
                        <div className="font-medium">Reminder #1</div>
                        <div className="text-sm text-slate-500">24h later if no purchase → soft nudge with social proof</div>
                      </div>
                      <Badge tone="slate">Scheduled</Badge>
                    </li>
                    <li className="flex items-center gap-3">
                      <StepNumber>3</StepNumber>
                      <div className="flex-1">
                        <div className="font-medium">Abandoned Checkout</div>
                        <div className="text-sm text-slate-500">Triggered by webhook → resend link + Q&A</div>
                      </div>
                      <Badge tone="slate">Conditional</Badge>
                    </li>
                  </ol>
                  <div className="mt-4 flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                      Edit Strategy
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-2 text-sm hover:bg-black">
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
                        <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">Export</button>
                        <button className="rounded-xl bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700">Create Campaign</button>
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
                          <th className="py-2 pr-3">Purchases</th>
                          <th className="py-2 pr-3">Revenue</th>
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
                            <td className="py-3 pr-3">{c.purchases.toLocaleString()} <span className="text-slate-400">({Math.round((c.purchases / c.clicks) * 100)}% CVR)</span></td>
                            <td className="py-3 pr-3">${c.revenue.toLocaleString()}</td>
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
                      <button className="rounded-xl bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-black">New A/B Test</button>
                    }
                  >
                    A/B Tests
                  </SectionTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {abTests.map((t, i) => (
                      <div key={i} className="p-3 border border-slate-200 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{t.test}</div>
                          <Badge tone={t.pValue < 0.05 ? "green" : "slate"}>{t.status}</Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                          <div className="p-2 bg-slate-50 rounded-lg">
                            <div className="text-slate-500">Variant A</div>
                            <div>CTR {Math.round(t.variantA.ctr * 100)}% • Purchases {t.variantA.purchases}</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-lg">
                            <div className="text-slate-500">Variant B</div>
                            <div>CTR {Math.round(t.variantB.ctr * 100)}% • Purchases {t.variantB.purchases}</div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                          <div>p-value {t.pValue.toFixed(2)}</div>
                          <div className="flex items-center gap-2">
                            <button className="rounded-lg border border-slate-200 px-2 py-1 hover:bg-slate-50">View Details</button>
                            <button className="rounded-lg bg-blue-600 text-white px-2 py-1 hover:bg-blue-700">Promote winner</button>
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
                    right={<button className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">View all</button>}
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
                          <div className="text-xs text-slate-500">{c.channel} • {c.stage}</div>
                        </div>
                        <button className="rounded-lg border border-slate-200 px-2 py-1 text-sm hover:bg-slate-50">Open thread</button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <SectionTitle
                    right={<button className="rounded-xl bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700">Edit Messages</button>}
                  >
                    Message Templates
                  </SectionTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <TemplateCard title="Intro (IG)" body="Hey {{first_name}}! Want your brand featured in top outlets? Here’s our PR pack → {{link}}" />
                    <TemplateCard title="Intro (FB)" body="Thanks for reaching out! Quick overview + pricing here → {{link}}" />
                    <TemplateCard title="Reminder 24h" body="Still thinking it over? Here’s a client result + link to pick your pack → {{link}}" />
                    <TemplateCard title="Abandoned Checkout" body="Saw you started checkout. Any Qs I can answer? Jump back in here → {{link}}" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-slate-400">© {new Date().getFullYear()} anothezero • CRM Dashboard</div>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Smaller components -----------------------------------------------------
const SidebarLink: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button
    className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl mb-1 transition text-left ${
      active ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
    }`}
  >
    <span className="shrink-0">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

const FilterPill: React.FC<React.PropsWithChildren<{ active?: boolean; onClick?: () => void }>> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-xl text-sm border transition ${
      active ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 hover:bg-slate-50"
    }`}
  >
    {children}
  </button>
);

const ChannelSwitch: React.FC<{ value: "All" | "Instagram" | "Facebook"; onChange: (v: any) => void }> = ({ value, onChange }) => (
  <div className="inline-flex rounded-xl border border-slate-200 overflow-hidden">
    {(["All", "Instagram", "Facebook"] as const).map((v) => (
      <button
        key={v}
        onClick={() => onChange(v)}
        className={`px-3 py-2 text-sm ${value === v ? "bg-blue-600 text-white" : "bg-white hover:bg-slate-50"}`}
        aria-pressed={value === v}
      >
        {v}
      </button>
    ))}
  </div>
);

const StepNumber: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">{children}</div>
);

const TemplateCard: React.FC<{ title: string; body: string }> = ({ title, body }) => (
  <div className="border border-slate-200 rounded-xl p-3">
    <div className="text-xs uppercase tracking-wide text-slate-500">{title}</div>
    <div className="mt-1 text-slate-900">{body}</div>
    <div className="mt-2 flex items-center gap-2">
      <button className="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">Duplicate</button>
      <button className="rounded-lg bg-slate-900 text-white px-2 py-1 text-xs hover:bg-black">Edit</button>
    </div>
  </div>
);
