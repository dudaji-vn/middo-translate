/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'res.cloudinary.com',
      'ui-avatars.com',
      'lh3.googleusercontent.com',
      'scontent-sea1-1.xx.fbcdn.net',
      'platform-lookaside.fbsbx.com',
    ],
  },
};

module.exports = nextConfig;
