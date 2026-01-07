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
  // Configuración vacía de turbopack para silenciar el error
  // next-pwa añade config de webpack, esto le dice a Next.js que está bien
  turbopack: {},
};

export default withPWA(nextConfig);
