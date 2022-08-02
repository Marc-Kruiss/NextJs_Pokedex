/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains:['assets.pokemon.com']
  }
}

module.exports = nextConfig
