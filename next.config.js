/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './my-loader.ts',
  },
};

module.exports = nextConfig;
