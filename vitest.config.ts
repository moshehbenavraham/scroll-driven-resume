import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./__tests__/setup.ts"],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
    // Force dedupe of Three.js to prevent multiple instances
    deps: {
      optimizer: {
        web: {
          include: ["three", "@react-three/fiber", "@react-three/drei"],
        },
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "lib/scroll-utils.ts",
        "hooks/useScrollProgress.ts",
        "hooks/useFrameAnimation.ts",
        "hooks/useParallax.ts",
      ],
      exclude: ["**/*.test.ts", "**/*.d.ts"],
      thresholds: {
        "lib/scroll-utils.ts": {
          lines: 90,
          functions: 90,
          branches: 80,
          statements: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      // Force Three.js singleton to prevent "Multiple instances" warning
      three: path.resolve(__dirname, "node_modules/three"),
    },
  },
});
