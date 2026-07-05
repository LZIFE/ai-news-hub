'use client';

import { useState } from 'react';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      window.open(
        `mailto:?subject=订阅%20AI%20新闻中心&body=请将我添加到通讯列表:%20${encodeURIComponent(email)}`,
        '_blank'
      );
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="card bg-gradient-to-br from-accent/5 to-accent-dark/5 dark:from-accent-dark/10 dark:to-accent/10">
      <div className="text-center max-w-md mx-auto">
        <h3 className="font-bold font-display text-xl mb-2">保持关注</h3>
        <p className="text-sm text-light-muted dark:text-dark-muted mb-4">
          获取最新 AI 资讯，直接发送到您的邮箱。无垃圾邮件，随时取消订阅。
        </p>
        {submitted ? (
          <p className="text-green-600 dark:text-green-400 font-medium">
            感谢订阅！
          </p>
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
            <button type="submit" className="btn-primary">
              订阅
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
