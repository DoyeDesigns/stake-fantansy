import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs"
import type { NextConfig } from "next";

export const nextConfig: NextConfig = {
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    PROJECT_ID: process.env.PROJECT_ID,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_API_ID: process.env.FIREBASE_API_ID,
  },
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  }
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: `${process.env.CLIENT_ID}`,
  loginUrl: '/wallet',
  include: ['/'],
  exclude: ['/wallet']
});

export default withCivicAuth(nextConfig)