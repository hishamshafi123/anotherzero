import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the campaign data from the request body
    const campaignData = await request.json();
    
    console.log('🚀 API Route: Received campaign data:', JSON.stringify(campaignData, null, 2));
    
    // n8n webhook URL
    const webhookUrl = 'https://n8n.anas.codes/webhook/46f147c3-c946-47cd-a613-212f8e06d7b6';
    
    console.log('📤 API Route: Forwarding to n8n webhook...');
    
    // Forward the request to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaignData)
    });
    
    const responseText = await response.text();
    
    console.log('📡 n8n Response status:', response.status);
    console.log('📡 n8n Response:', responseText);
    
    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Campaign sent to n8n successfully',
        n8nResponse: responseText
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: `n8n webhook returned ${response.status}: ${responseText}` 
        },
        { status: response.status }
      );
    }
    
  } catch (error) {
    console.error('❌ API Route Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send campaign to n8n',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}