/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // RSS feed images
      { protocol: 'https', hostname: 'techcrunch.com' },
      { protocol: 'https', hostname: '*.techcrunch.com' },
      { protocol: 'https', hostname: 'wp.technologyreview.com' },
      { protocol: 'https', hostname: 'venturebeat.com' },
      { protocol: 'https', hostname: 'i0.wp.com' },
      { protocol: 'https', hostname: 'i1.wp.com' },
      { protocol: 'https', hostname: 'i2.wp.com' },
      { protocol: 'https', hostname: 'images.ctfassets.net' },
      { protocol: 'https', hostname: 'cdn.vox-cdn.com' },
      // Chinese sources
      { protocol: 'https', hostname: '*.xlab.app' },
      { protocol: 'https', hostname: '*.geekpark.net' },
      { protocol: 'https', hostname: '*.people.com.cn' },
      { protocol: 'https', hostname: '*.xinhuanet.com' },
      { protocol: 'https', hostname: '*.rssforever.com' },
      { protocol: 'https', hostname: '*.rsshub.app' },
      // arXiv
      { protocol: 'https', hostname: 'arxiv.org' },
      { protocol: 'https', hostname: '*.arxiv.org' },
    ],
  },
};

module.exports = nextConfig;
