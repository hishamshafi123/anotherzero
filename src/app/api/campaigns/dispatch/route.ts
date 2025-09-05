import { NextRequest, NextResponse } from 'next/server';
import { CampaignDispatch } from '@/types';

// Simplified campaign dispatch to n8n
export async function POST(request: NextRequest) {
  try {
    const dispatch: CampaignDispatch = await request.json();
    
    // Validate required fields
    if (!dispatch.campaign_id || !dispatch.targets.length || !dispatch.variants.length) {
      return NextResponse.json(
        { error: 'Missing required fields: campaign_id, targets, variants' },
        { status: 400 }
      );
    }

    // Filter targets by interest level (only send to interested contacts)
    const interestedTargets = dispatch.targets.filter(
      target => target.interest_level === 'interested'
    );

    if (interestedTargets.length === 0) {
      return NextResponse.json(
        { error: 'No interested contacts found in target list' },
        { status: 400 }
      );
    }

    // Send to n8n webhook (simplified payload)
    const n8nPayload = {
      campaign_id: dispatch.campaign_id,
      targets: interestedTargets.map(target => ({
        contact_id: target.contact_id,
        external_id: target.external_id,
        channel: target.channel,
      })),
      variants: dispatch.variants,
      schedule: dispatch.schedule,
      total_targets: interestedTargets.length,
    };

    // In production, this would be an actual HTTP request to n8n
    console.log('Dispatching to n8n:', n8nPayload);
    
    // Simulate n8n response
    const n8nResponse = await simulateN8nResponse(n8nPayload);

    // Log campaign dispatch event
    await logEvent({
      event_type: 'campaign_sent',
      campaign_id: dispatch.campaign_id,
      metadata: {
        targets_count: interestedTargets.length,
        variants_count: dispatch.variants.length,
        scheduled_at: dispatch.schedule.start_at,
      },
    });

    return NextResponse.json({
      success: true,
      dispatch_id: n8nResponse.execution_id,
      targets_dispatched: interestedTargets.length,
      estimated_start: dispatch.schedule.start_at,
    });

  } catch (error) {
    console.error('Campaign dispatch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Simulate n8n webhook response
async function simulateN8nResponse(payload: any) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    execution_id: 'exec_' + Math.random().toString(36).substr(2, 9),
    status: 'queued',
    targets_processed: payload.total_targets,
  };
}

// Log analytics event
async function logEvent(data: {
  event_type: 'campaign_sent' | 'interest_detected' | 'contact_created' | 'link_clicked';
  contact_id?: string;
  campaign_id?: string;
  metadata: Record<string, any>;
}) {
  console.log('Event logged:', data);
  return {
    id: 'event_' + Math.random().toString(36).substr(2, 9),
    ...data,
    created_at: new Date().toISOString(),
  };
}