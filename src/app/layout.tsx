import type { Metadata, Viewport } from 'next';
import { DM_Sans, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI 新闻中心 — 最新 AI 资讯与动态',
  description: '精选来自最佳来源的人工智能新闻。每日更新 AI、机器学习和技术领域的最新资讯。',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'AI 新闻中心',
    description: '精选来自最佳来源的人工智能新闻。每日更新 AI、机器学习和技术领域的最新资讯。',
    type: 'website',
    locale: 'zh_CN',
    images: '/og-image.svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 新闻中心',
    description: '精选来自最佳来源的人工智能新闻。每日更新 AI、机器学习和技术领域的最新资讯。',
    images: '/og-image.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#E85D26',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={`${dmSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] btn-primary">
            跳到正文
          </a>
          <Header />
          <main id="main" className="min-h-screen">{children}</main>
          <ScrollToTop />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
