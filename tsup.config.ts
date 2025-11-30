import { defineConfig } from "tsup"
import { execSync } from 'child_process'
import fs from "node:fs"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
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
    execSync('npm run postbuild', { stdio: 'inherit' })
  },
  watch: process.env.WATCH === "1",
})