import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist/esm",
      format: "esm",
      sourcemap: true,
    },
    plugins: [
      peerDepsExternal(),
      resolve({ extensions: [".js", ".jsx", ".ts", ".tsx"] }),
      commonjs(),
      postcss({
        config: {
          path: "./postcss.config.js",
        },
        extensions: [".css"],
        minimize: true,
        inject: {
          insertAt: "top",
        },
      }),
      typescript({ tsconfig: "./tsconfig.json" }),
      json(),
    ],
    external: ["react", "react-dom", "react/jsx-runtime", "lucid-cardano"],
  },
  {
    input: "src/index.ts",
    output: {
      dir: "dist/umd",
      format: "umd",
      name: "JamLib",
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        "react/jsx-runtime": "React",
        "lucid-cardano": "LucidCardano",
      },
      sourcemap: true,
    },
    plugins: [
      peerDepsExternal(),
      resolve({ extensions: [".js", ".jsx", ".ts", ".tsx"], browser: true }),
      commonjs(),
      postcss({
        config: {
          path: "./postcss.config.js",
        },
        extensions: [".css"],
        minimize: true,
        inject: {
          insertAt: "top",
        },
      }),
      typescript({ tsconfig: "./tsconfig.json", jsx: "react" }),
      json(),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
    external: [/\.css$/],
  },
  {
    input: "src/styles/main.css",
    output: [{ file: "dist/index.css", format: "es" }],
    plugins: [
      postcss({
        extract: true,
        minimize: true,
      }),
    ],
  },
  {
    build: {
      target: "es2020",
      rollupOptions: {
        external: ["node-fetch"],
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2020",
      },
      exclude: ["lucid-cardano"],
    },
  },
];
