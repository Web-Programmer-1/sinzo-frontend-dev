/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sinzo-backend-files.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;