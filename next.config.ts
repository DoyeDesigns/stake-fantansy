import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs"
import type { NextConfig } from "next";

export const nextConfig: NextConfig = {
  env: {
    CLIENT_ID: process.env.CLIENT_ID
  },
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: `${process.env.CLIENT_ID}`
});

export default withCivicAuth(nextConfig)