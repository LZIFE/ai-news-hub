'use client';

import { useState } from 'react';

export default function Footer() {
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
        setError(data.error || '订阅失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-light-border/60 dark:border-dark-border/60 mt-20">
      <div className="container-site py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">AI</span>
              </div>
              <h3 className="font-display font-bold text-lg">新闻中心</h3>
            </div>
            <p className="text-light-muted dark:text-dark-muted text-sm leading-relaxed">
              精选来自最佳来源的 AI 新闻，每日更新。
            </p>
          </div>

          <div>
            <h4 className="section-label mb-4">来源</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://techcrunch.com/category/artificial-intelligence/" target="_blank" rel="noopener noreferrer" className="hover:text-accent dark:hover:text-accent-dark transition-colors">TechCrunch</a></li>
              <li><a href="https://www.theverge.com/ai-artificial-intelligence" target="_blank" rel="noopener noreferrer" className="hover:text-accent dark:hover:text-accent-dark transition-colors">The Verge</a></li>
              <li><a href="https://www.technologyreview.com/topic/artificial-intelligence/" target="_blank" rel="noopener noreferrer" className="hover:text-accent dark:hover:text-accent-dark transition-colors">MIT Tech Review</a></li>
              <li><a href="https://venturebeat.com/category/ai/" target="_blank" rel="noopener noreferrer" className="hover:text-accent dark:hover:text-accent-dark transition-colors">VentureBeat</a></li>
              <li><a href="https://www.jiqizhixin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-accent dark:hover:text-accent-dark transition-colors">机器之心</a></li>
              <li><a href="https://www.qbitai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-accent dark:hover:text-accent-dark transition-colors">量子位</a></li>
            </ul>
          </div>

          <div>
            <h4 className="section-label mb-4">通讯订阅</h4>
            {submitted ? (
              <div className="space-y-2">
                <p className="text-sm text-green-600 dark:text-green-400">
                  感谢订阅！请查看您的邮箱。
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-accent dark:text-accent-dark hover:underline"
                >
                  再次订阅
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <label htmlFor="footer-email" className="sr-only">邮箱地址</label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-search flex-1"
                  autoComplete="email"
                  required
                />
                <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap disabled:opacity-50">
                  {loading ? '...' : '订阅'}
                </button>
              </form>
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-light-border/40 dark:border-dark-border/40 flex items-center justify-between text-xs text-light-muted dark:text-dark-muted">
          <span>使用 Next.js 构建</span>
          <span>RSS 订阅源版权归原作者所有</span>
        </div>
      </div>
    </footer>
  );
}
