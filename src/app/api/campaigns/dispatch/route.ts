import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const campaignData = await request.json();
    
    // Validate required fields for simple campaign form
    if (!campaignData.name || !campaignData.message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, message' },
        { status: 400 }
      );
    }

    // Send directly to n8n webhook
    const response = await fetch('https://n8n.anas.codes/webhook/46f147c3-c946-47cd-a613-212f8e06d7b6', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...campaignData,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed with status: ${response.status}`);
    }

    const result = await response.text();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Campaign dispatched successfully',
      webhookResponse: result 
    });
    
  } catch (error) {
    console.error('Error dispatching campaign:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to dispatch campaign',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

