import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'BUTTONDOWN_API_KEY not configured' }, { status: 500 });
  }

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const body = `# AI Daily Digest Test - ${today}

## 1. OpenAI发布GPT-5，性能大幅提升

**Source:** 量子位 · **Categories:** AI, 大模型

OpenAI今日正式发布GPT-5模型，在多项基准测试中创下新纪录...

[Read more](https://example.com/article1)

---

## 2. Google推出Gemini 2.0，多模态能力再升级

**Source:** 机器之心 · **Categories:** AI, 多模态

Google DeepMind发布Gemini 2.0，在图像、视频、代码等方面均有显著提升...

[Read more](https://example.com/article2)

---

This is a test email from AI News Hub.`;

  const response = await fetch('https://api.buttondown.com/v1/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Buttondown-Live-Dangerously': 'true',
    },
    body: JSON.stringify({
      subject: `AI Daily Digest Test - ${today}`,
      body: body,
      status: 'about_to_send',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json({ error }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json({ success: true, emailId: data.id });
}
