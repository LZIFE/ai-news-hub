'use client';

import { useState } from 'react';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      window.open(
        `mailto:?subject=Subscribe%20to%20AI%20News%20Hub&body=Please%20add%20me%20to%20the%20newsletter:%20${encodeURIComponent(email)}`,
        '_blank'
      );
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="card bg-gradient-to-br from-accent/5 to-accent-dark/5 dark:from-accent-dark/10 dark:to-accent/10">
      <div className="text-center max-w-md mx-auto">
        <h3 className="font-bold font-display text-xl mb-2">Stay in the loop</h3>
        <p className="text-sm text-light-muted dark:text-dark-muted mb-4">
          Get the latest AI news delivered to your inbox. No spam, unsubscribe anytime.
        </p>
        {submitted ? (
          <p className="text-green-600 dark:text-green-400 font-medium">
            Thanks for subscribing!
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
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
