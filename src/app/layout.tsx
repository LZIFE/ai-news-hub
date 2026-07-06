import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 新闻中心 — 最新 AI 资讯与动态',
  description: '精选来自最佳来源的人工智能新闻。每日更新 AI、机器学习和技术领域的最新资讯。',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'AI 新闻中心',
    description: '精选来自最佳来源的人工智能新闻。每日更新 AI、机器学习和技术领域的最新资讯。',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 新闻中心',
    description: '精选来自最佳来源的人工智能新闻。每日更新 AI、机器学习和技术领域的最新资讯。',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF9' },
    { media: '(prefers-color-scheme: dark)', color: '#0C0A09' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="min-h-screen">{children}</main>
          <ScrollToTop />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
