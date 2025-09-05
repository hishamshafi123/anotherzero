import { Contact, Campaign, Event, DashboardKPIs } from '@/types';

// Calculate interest-based KPIs
export const calculateDashboardKPIs = (
  contacts: Contact[],
  campaigns: Campaign[],
  events: Event[]
): DashboardKPIs => {
  const totalContacts = contacts.length;
  const interestedContacts = contacts.filter(c => c.interest_level === 'interested').length;
  const activeCampaigns = campaigns.filter(c => c.status === 'running').length;
  
  // Calculate total clicks from events or campaigns
  const totalClicks = events
    .filter(e => e.event_type === 'link_clicked')
    .length || campaigns.reduce((sum, c) => sum + c.click_count, 0);
    
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent_count, 0);
  const averageCTR = totalSent > 0 ? totalClicks / totalSent : 0;

  return {
    totalContacts,
    interestedContacts,
    interestedRate: totalContacts > 0 ? interestedContacts / totalContacts : 0,
    activeCampaigns,
    averageCTR,
    totalClicks,
  };
};

// Calculate interest detection rate
export const calculateInterestDetectionRate = (events: Event[]): number => {
  const interestEvents = events.filter(e => e.event_type === 'interest_detected');
  const totalComments = events.filter(e => e.event_type === 'contact_created');
  
  return totalComments.length > 0 ? interestEvents.length / totalComments.length : 0;
};

// Filter contacts by interest level
export const filterContactsByInterest = (
  contacts: Contact[],
  interestLevel: 'interested' | 'not_interested' | 'neutral' | 'all'
): Contact[] => {
  if (interestLevel === 'all') return contacts;
  return contacts.filter(c => c.interest_level === interestLevel);
};

// Get engagement trends
export const getEngagementTrends = (events: Event[], days: number = 7) => {
  const trends = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayEvents = events.filter(e => {
      const eventDate = new Date(e.created_at);
      return eventDate.toDateString() === date.toDateString();
    });
    
    trends.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      contacts: dayEvents.filter(e => e.event_type === 'contact_created').length,
      interested: dayEvents.filter(e => e.event_type === 'interest_detected').length,
      clicks: dayEvents.filter(e => e.event_type === 'link_clicked').length,
    });
  }
  
  return trends;
};

// Calculate A/B test significance
export const calculateABTestSignificance = (
  variantA: { clicks: number; sent: number },
  variantB: { clicks: number; sent: number }
): { pValue: number; isSignificant: boolean } => {
  const n1 = variantA.sent;
  const n2 = variantB.sent;
  const x1 = variantA.clicks;
  const x2 = variantB.clicks;
  
  if (n1 === 0 || n2 === 0) return { pValue: 1, isSignificant: false };
  
  const p1 = x1 / n1;
  const p2 = x2 / n2;
  const p = (x1 + x2) / (n1 + n2);
  
  const se = Math.sqrt(p * (1 - p) * (1/n1 + 1/n2));
  const z = Math.abs(p1 - p2) / se;
  
  // Approximate p-value calculation (simplified)
  const pValue = 2 * (1 - normalCDF(Math.abs(z)));
  
  return {
    pValue,
    isSignificant: pValue < 0.05,
  };
};

// Helper function for normal CDF approximation
function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

function erf(x: number): number {
  // Approximation of error function
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}