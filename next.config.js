/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  
  reactStrictMode: true,

  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },

  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/tygerxqt',
        permanent: true,
      },
      {
        source: '/twitter',
        destination: 'https://twitter.com/tygerxqt',
        permanent: true,
      },
      {
        source: '/instagram',
        destination: 'https://instagram.com/tygerxqt',
        permanent: true,
      },
      {
        source: '/discord',
        destination: 'https://discord.gg/BJ8sWHntYb',
        permanent: true,
      },
      {
        source: '/youtube',
        destination: 'https://www.youtube.com/channel/UCDCBrrYkHrt4cFnoA2SKMdA',
        permanent: true,
      },
      {
        source: '/twitch',
        destination: 'https://twitch.tv/tygerxqt',
        permanent: true,
      },
      {
        source: '/mail',
        destination: 'mailto:tygerxqt@nordstud.io',
        permanent: true,
      },
      {
        source: '/donate',
        destination: 'https://ko-fi.com/tygerxqt',
        permanent: true,
      }
    ]
  },

  images: {
    domains: ["i.imgur.com", "images.ctfassets.net"],
  },
}

module.exports = nextConfig
