

export const engagementByDay = [
  { day: "Mon", contacts: 142, interested: 68, clicks: 28 },
  { day: "Tue", contacts: 163, interested: 89, clicks: 35 },
  { day: "Wed", contacts: 181, interested: 94, clicks: 42 },
  { day: "Thu", contacts: 127, interested: 71, clicks: 31 },
  { day: "Fri", contacts: 195, interested: 112, clicks: 48 },
  { day: "Sat", contacts: 234, interested: 134, clicks: 58 },
  { day: "Sun", contacts: 98, interested: 52, clicks: 23 },
];

export const campaignCTr = [
  { name: "Evergreen PR Pack", ctr: 0.41 },
  { name: "Founder Feature", ctr: 0.36 },
  { name: "Pro Launch Bundle", ctr: 0.48 },
  { name: "Summer Sale", ctr: 0.33 },
];

export const channelSplit = [
  { name: "Instagram", value: 62 },
  { name: "Facebook", value: 38 },
];

export const campaigns = [
  {
    name: "Evergreen PR Pack",
    channel: "Instagram",
    status: "Running",
    sent: 8421,
    clicks: 3612,
    ctr: 0.43,
    ab: "A/B: CTA Short vs Long",
  },
  {
    name: "Founder Feature",
    channel: "Facebook",
    status: "Running",
    sent: 6210,
    clicks: 1998,
    ctr: 0.32,
    ab: "Copy Tone: Urgency vs Proof",
  },
  {
    name: "Pro Launch Bundle",
    channel: "Instagram",
    status: "Paused",
    sent: 3120,
    clicks: 1497,
    ctr: 0.48,
    ab: "Message Length A/B Test",
  },
];

export const abTests = [
  {
    test: "DM CTA length",
    variantA: { ctr: 0.42, clicks: 132 },
    variantB: { ctr: 0.49, clicks: 160 },
    pValue: 0.03,
    status: "B winning",
  },
  {
    test: "Message personalization",
    variantA: { ctr: 0.35, clicks: 88 },
    variantB: { ctr: 0.33, clicks: 79 },
    pValue: 0.18,
    status: "Needs data",
  },
];

export const recentContacts = [
  { name: "Aarav S.", handle: "@aarav.builds", channel: "Instagram", interest_level: "interested", stage: "Clicked Link" },
  { name: "Maya K.", handle: "@maya.k", channel: "Facebook", interest_level: "interested", stage: "Engaged" },
  { name: "Rohit D.", handle: "@rohit.d", channel: "Instagram", interest_level: "interested", stage: "High Interest" },
  { name: "Sara P.", handle: "@sarap", channel: "Instagram", interest_level: "neutral", stage: "New" },
  { name: "John T.", handle: "@john.team", channel: "Facebook", interest_level: "not_interested", stage: "Not Interested" },
];

export const brandBlue = "#1d4ed8"; // tailwind blue-700
export const brandBlueLight = "#dbeafe"; // blue-100
export const brandBlack = "#0b0f19"; // near-black
