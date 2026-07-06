'use client';

import { useState } from 'react';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
        setEmail('');
      } else {
        const data = await res.json();
        setError(data.error || '订阅失败，请稍后再试');
      }
    } catch {
      setError('网络错误，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card bg-gradient-to-br from-accent/5 to-accent-dark/5 dark:from-accent-dark/10 dark:to-accent/10">
      <div className="text-center max-w-md mx-auto">
        <h3 className="font-bold font-display text-xl mb-2">保持关注</h3>
        <p className="text-sm text-light-muted dark:text-dark-muted mb-4">
          输入邮箱，我们将通过邮件发送最新 AI 资讯摘要。
        </p>
        {submitted ? (
          <div className="space-y-2">
            <p className="text-green-600 dark:text-green-400 font-medium">
              感谢订阅！请查看您的邮箱。
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-sm text-accent dark:text-accent-dark hover:underline"
            >
              再次订阅
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input-search flex-1"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? '...' : '订阅'}
            </button>
          </form>
        )}
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </div>
    </section>
  );
}
