import { Article } from '@/lib/types';

interface EmailDigestProps {
  articles: Article[];
  date: string;
}

export const EmailDigest: React.FC<Readonly<EmailDigestProps>> = ({
  articles,
  date,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
    <div style={{ backgroundColor: '#E85D26', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px' }}>AI Daily Digest</h1>
      <p style={{ color: '#ffffff', margin: '5px 0 0 0', opacity: 0.9 }}>{date}</p>
    </div>

    <div style={{ padding: '20px' }}>
      {articles.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center' }}>No new articles today.</p>
      ) : (
        articles.map((article, index) => (
          <div key={article.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: index < articles.length - 1 ? '1px solid #eee' : 'none' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#1a1a1a' }}>
              <a href={article.url} style={{ color: '#E85D26', textDecoration: 'none' }}>{article.title}</a>
            </h2>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0' }}>
              {article.source} · {article.categories.join(', ')}
            </p>
            {article.summary && (
              <p style={{ fontSize: '14px', color: '#333', margin: 0, lineHeight: '1.5' }}>
                {article.summary.slice(0, 200)}...
              </p>
            )}
          </div>
        ))
      )}
    </div>

    <div style={{ backgroundColor: '#f5f5f5', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#999' }}>
      <p>You received this because you subscribed to AI Daily Digest.</p>
      <p style={{ margin: '5px 0 0 0' }}>
        <a href="#" style={{ color: '#E85D26', textDecoration: 'none' }}>Unsubscribe</a>
      </p>
    </div>
  </div>
);
