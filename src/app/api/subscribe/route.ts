import { NextResponse } from 'next/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.buttondown.com/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        tags: ['ai-news-hub'],
      }),
    });

    if (response.ok) {
      return NextResponse.json({ success: true });
    }

    const data = await response.json();
    if (data.detail && data.detail.includes('already exists')) {
      return NextResponse.json({ success: true, message: 'Already subscribed' });
    }
    return NextResponse.json({ error: data.detail || 'Subscription failed' }, { status: response.status });
  } catch {
    return NextResponse.json({ error: 'Network error' }, { status: 500 });
  }
}
