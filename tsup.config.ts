import { defineConfig } from "tsup"
import path from "node:path"
import fs from "node:fs"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: false,
  clean: true,
  treeshake: true,
  external: [
    "react",
    "react-dom",
    "@speckle/viewer",
  ],
  esbuildPlugins: [],
  esbuildOptions: (options) => {
    options.alias = {
      "@": "./src",
      "@types": "./src/types/index.ts",
      "$": "./src/store",
    };
  },
  onSuccess: async () => {
    fs.mkdirSync("dist", { recursive: true })
    fs.cpSync("src/assets", "dist/assets", { recursive: true })
  },
  watch: process.env.WATCH === "1",
})