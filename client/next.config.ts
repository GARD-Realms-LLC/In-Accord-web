import path from "path";

// Using a lax type to allow Next's experimental fields like `turbopack.root`.
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/npm/:path*',
          destination: 'http://localhost:8000/api/npm/:path*',
        },
      ];
    },
  reactCompiler: true,
  // Ensure Turbopack treats `client/` as the workspace root to avoid
  // picking the repository root lockfile.
  turbopack: {
    root: path.resolve(__dirname),
  },
} as any;

export default nextConfig;
