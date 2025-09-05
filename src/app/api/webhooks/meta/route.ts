import { NextRequest, NextResponse } from 'next/server';
import { MetaWebhookPayload } from '@/types';

// Simplified Meta webhook for interest detection
export async function POST(request: NextRequest) {
  try {
    const payload: MetaWebhookPayload = await request.json();
    
    // Validate required fields
    if (!payload.source || !payload.contact_external_id || !payload.handle) {
      return NextResponse.json(
        { error: 'Missing required fields: source, contact_external_id, handle' },
        { status: 400 }
      );
    }

    // Process contact with interest level
    const contact = await upsertContact({
      source: payload.source,
      external_id: payload.contact_external_id,
      handle: payload.handle,
      name: payload.name,
      avatar_url: payload.avatar_url,
      interest_level: payload.interest_level,
    });

    // Log interest detection event
    if (payload.interest_level !== 'neutral') {
      await logEvent({
        event_type: 'interest_detected',
        contact_id: contact.id,
        metadata: {
          interest_level: payload.interest_level,
          message_analyzed: true, // We analyzed the message but didn't store it
          timestamp: payload.timestamp,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      contact_id: contact.id,
      interest_level: contact.interest_level 
    });

  } catch (error) {
    console.error('Meta webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Simplified contact upsert - focus on interest level
async function upsertContact(data: {
  source: 'instagram' | 'facebook';
  external_id: string;
  handle: string;
  name?: string;
  avatar_url?: string;
  interest_level: 'interested' | 'not_interested' | 'neutral';
}) {
  // This would be your database logic
  // For now, returning mock response
  return {
    id: 'contact_' + Math.random().toString(36).substr(2, 9),
    ...data,
    last_interaction_at: new Date().toISOString(),
    tags: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Log analytics event
async function logEvent(data: {
  event_type: 'interest_detected' | 'contact_created' | 'campaign_sent' | 'link_clicked';
  contact_id?: string;
  campaign_id?: string;
  metadata: Record<string, any>;
}) {
  // This would be your database logic
  console.log('Event logged:', data);
  return {
    id: 'event_' + Math.random().toString(36).substr(2, 9),
    ...data,
    created_at: new Date().toISOString(),
  };
}