'use client';

import { useState } from 'react';

export default function Footer() {
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
    <footer className="border-t border-light-border dark:border-dark-border mt-20">
      <div className="container-site py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold font-display text-lg mb-3">AI 新闻中心</h3>
            <p className="text-light-muted dark:text-dark-muted text-sm leading-relaxed">
              精选来自最佳来源的 AI 新闻，每日更新。
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-light-muted dark:text-dark-muted">
              来源
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://techcrunch.com/category/artificial-intelligence/" target="_blank" rel="noopener" className="hover:text-accent dark:hover:text-accent-dark transition-colors">TechCrunch</a></li>
              <li><a href="https://www.theverge.com/ai-artificial-intelligence" target="_blank" rel="noopener" className="hover:text-accent dark:hover:text-accent-dark transition-colors">The Verge</a></li>
              <li><a href="https://www.technologyreview.com/topic/artificial-intelligence/" target="_blank" rel="noopener" className="hover:text-accent dark:hover:text-accent-dark transition-colors">MIT Tech Review</a></li>
              <li><a href="https://venturebeat.com/category/ai/" target="_blank" rel="noopener" className="hover:text-accent dark:hover:text-accent-dark transition-colors">VentureBeat</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-light-muted dark:text-dark-muted">
              通讯订阅
            </h4>
            {submitted ? (
              <p className="text-sm text-green-600 dark:text-green-400">
                感谢订阅！请查看您的邮箱。
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
                <button type="submit" className="btn-primary whitespace-nowrap">
                  订阅
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-light-border dark:border-dark-border text-center text-xs text-light-muted dark:text-dark-muted">
          使用 Next.js 构建。RSS 订阅源版权归原作者所有。
        </div>
      </div>
    </footer>
  );
}
