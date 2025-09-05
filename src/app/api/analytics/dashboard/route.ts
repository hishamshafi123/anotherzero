import { NextRequest, NextResponse } from 'next/server';
import { DashboardKPIs, AnalyticsData } from '@/types';

// Simplified analytics endpoint for dashboard KPIs
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('range') || '30d';
    const channel = url.searchParams.get('channel') || 'all';

    // In production, this would query your database
    const kpis = await getDashboardKPIs(timeRange, channel);
    const analytics = await getAnalyticsData(timeRange, channel);

    return NextResponse.json({
      kpis,
      analytics,
      generated_at: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get simplified dashboard KPIs
async function getDashboardKPIs(timeRange: string, channel: string): Promise<DashboardKPIs> {
  // Mock data - in production, query your database
  const baseKPIs = {
    totalContacts: 12480,
    interestedContacts: 5892,
    activeCampaigns: 3,
    totalClicks: 8107,
  };

  // Apply channel filter if needed
  const multiplier = channel === 'instagram' ? 0.62 : channel === 'facebook' ? 0.38 : 1;
  
  return {
    totalContacts: Math.round(baseKPIs.totalContacts * multiplier),
    interestedContacts: Math.round(baseKPIs.interestedContacts * multiplier),
    interestedRate: baseKPIs.interestedContacts / baseKPIs.totalContacts,
    activeCampaigns: baseKPIs.activeCampaigns,
    averageCTR: baseKPIs.totalClicks / baseKPIs.totalContacts * 0.43,
    totalClicks: Math.round(baseKPIs.totalClicks * multiplier),
  };
}

// Get detailed analytics data
async function getAnalyticsData(timeRange: string, channel: string): Promise<AnalyticsData> {
  // Mock data - in production, query your database
  return {
    totalComments: 18750,
    interestDetectionRate: 0.47, // 47% of comments show interest
    campaignReach: 15680,
    deliveryRate: 0.94, // 94% of campaigns delivered successfully
    clickThroughRate: 0.43,
    variantPerformance: [
      {
        variant_id: 'var_1',
        name: 'Short CTA',
        ctr: 0.41,
        clicks: 3612,
        sent: 8421,
      },
      {
        variant_id: 'var_2',
        name: 'Long CTA',
        ctr: 0.49,
        clicks: 1998,
        sent: 6210,
      },
    ],
  };
}