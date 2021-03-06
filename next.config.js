/** @type {import('next').NextConfig} */
/* eslint-disable @typescript-eslint/no-var-requires */

const withPWA = require('next-pwa');

module.exports = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: 'public',
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: 'https://www.google-analytics.com/analytics.js',
        handler: 'NetworkOnly'
      }
    ]
  }
});
