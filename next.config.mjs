/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@libsql/client",
      "@libsql/kysely-libsql",
    ],
  },
};

export default nextConfig;
