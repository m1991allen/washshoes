/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep firebase-admin (and its transitive deps jwks-rsa/jose) out of the
  // server bundle. Bundling breaks their CJS→ESM require at runtime on Vercel
  // (ERR_REQUIRE_ESM); loading it from node_modules as-is matches local dev.
  serverExternalPackages: ["firebase-admin"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
