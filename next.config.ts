import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 클라이언트에서 서버 전용 라이브러리 제외
      config.externals = {
        ...config.externals,
        "@mapbox/node-pre-gyp": "commonjs @mapbox/node-pre-gyp",
        "@tensorflow/tfjs-node": "commonjs @tensorflow/tfjs-node",
      };
    }

    return config;
  },
};

export default nextConfig;
