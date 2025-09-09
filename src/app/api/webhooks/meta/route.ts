import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Validate required fields
    if (!payload.source || !payload.external_id ) {
      return NextResponse.json(
        { error: 'Missing required fields: source, external_id, handle' },
        { status: 400 }
      );
    }

    // Send to n8n webhook (replace with your actual webhook URL)
    const n8nWebhookUrl = 'https://n8n.anas.codes/webhook/6dabe3ea-42e4-48ff-af41-cc672d320871';
    
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.status}`);
    }

    const result = await response.json();

    return NextResponse.json({ 
      success: true, 
      message: 'Contact processed successfully',
      data: result
    });

  } catch (error) {
    console.error('Meta webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}