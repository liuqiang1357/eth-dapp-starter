/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  webpack: config => {
    config.externals.push('pino-pretty', 'encoding');
    return config;
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
};
