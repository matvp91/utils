import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "event-manager": "./src/event-manager.ts",
    "math-utils": "./src/math-utils.ts",
    "array-utils": "./src/array-utils.ts",
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: "esm",
});
