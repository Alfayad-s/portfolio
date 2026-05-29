/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { webpack, isServer }) => {
    if (isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^@vladmandic\/human$/,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
