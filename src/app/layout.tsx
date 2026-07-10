import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4, Noto_Sans_SC, Noto_Serif_SC, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import './globals.css';

// Body / UI — a clean grotesque for Latin, paired with a matching CJK sans
// so Chinese UI text and Latin UI text sit at the same visual weight.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans-zh',
  display: 'swap',
});

// Display — an editorial serif. This is a news product: high-contrast serif
// headlines are a functional choice rooted in that, not a decorative one.
// Weights are limited to 600/700 to keep the CJK subset payload in check.
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display-zh',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aiweb-readylinoffice-2002s-projects.vercel.app'),
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
  themeColor: '#B54E2E',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansSC.variable} ${sourceSerif.variable} ${notoSerifSC.variable} ${jetbrainsMono.variable}`}
    >
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