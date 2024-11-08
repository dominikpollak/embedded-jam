import terser from "@rollup/plugin-terser";
import baseConfig from "./rollup.base.config.js";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        dir: "./dist",
        format: "esm",
        sourcemap: true,
      },
    ],
    external: ["react", "react-dom"],
    preserveModules: true,
    plugins: [...baseConfig.plugins, terser()],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "esm",
    },
    plugins: [dts()],
  },
];
