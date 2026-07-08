import { NextRequest, NextResponse } from 'next/server';
import { fetchAllArticles } from '@/lib/fetcher';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return handleDigest();
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return handleDigest();
}

async function handleDigest() {
  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'BUTTONDOWN_API_KEY not configured' }, { status: 500 });
  }

  try {
    const allArticles = await fetchAllArticles();

    if (allArticles.length === 0) {
      return NextResponse.json({ message: 'No articles to send' });
    }

    const { buildDigest, filterLast24Hours } = await import('@/lib/digest');
    const todayArticles = filterLast24Hours(allArticles);

    // If no articles in the last 24 hours, skip sending
    if (todayArticles.length === 0) {
      return NextResponse.json({ message: 'No new articles in the last 24 hours, skipping send' });
    }

    const { subject, body } = buildDigest(todayArticles);

    // Schedule send at 11:50 Beijing time (UTC+8 → 3:50 UTC).
    // Cron triggers at 11:45, giving ~5 min for fetch + translate + build.
    const now = new Date();
    const scheduledTime = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      3, 50, 0
    ));
    // If cron runs after 3:50 UTC for any reason, don't schedule in the past
    if (scheduledTime <= now) {
      scheduledTime.setTime(now.getTime() + 60_000); // send in 1 minute fallback
    }

    const response = await fetch('https://api.buttondown.com/v1/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Buttondown-Live-Dangerously': 'true',
      },
      // body is a full HTML document; Buttondown renders it as HTML.
      // publish_date schedules the email for later delivery (ISO 8601 UTC).
      body: JSON.stringify({
        subject,
        body,
        status: 'about_to_send',
        email_type: 'transactional',
        publish_date: scheduledTime.toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Buttondown API error:', error);
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, emailId: data.id, scheduledFor: scheduledTime.toISOString() });
  } catch (error) {
    console.error('Digest cron error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}