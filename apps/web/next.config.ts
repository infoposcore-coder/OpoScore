import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Añadir config vacía de turbopack para silenciar el warning
  // y permitir que next-pwa funcione con webpack
  turbopack: {},
};

export default withPWA(nextConfig);
