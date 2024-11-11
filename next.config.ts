import { NextConfig } from 'next';

const config: NextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'encoding');
    return config;
  },
};

export default config;
