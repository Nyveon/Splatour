import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',  // Set the src folder as the root
  build: {
    outDir: '../dist',  // Specify output folder (one level up)
  },
  publicDir: '../static',  // Specify public folder (one level up)
  plugins: [
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
  ],
});