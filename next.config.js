/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["assets.pokemon.com", "raw.githubusercontent.com","upload.wikimedia.org"],
  },
};

module.exports = nextConfig;
