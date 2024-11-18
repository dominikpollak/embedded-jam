import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve, { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import url from "@rollup/plugin-url";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import nodePolyfills from "rollup-plugin-polyfill-node";
import postcss from "rollup-plugin-postcss";

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist/esm",
      format: "esm",
      sourcemap: true,
      intro: "const global = window;",
    },
    plugins: [
      peerDepsExternal(),
      resolve({
        alias: {
          buffer: "buffer",
        },
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
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
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      nodePolyfills({
        include: ["buffer"],
      }),
      url(),
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
      intro: "const global = window;",
      sourcemap: true,
    },
    plugins: [
      peerDepsExternal(),
      resolve({
        alias: {
          buffer: "buffer",
        },
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
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
      typescript({ tsconfig: "./tsconfig.umd.json" }),
      json(),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      nodePolyfills({
        include: ["buffer"],
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        preventAssignment: true,
      }),
      url(),
    ],
    external: ["react", "react-dom", "react/jsx-runtime", "lucid-cardano"],
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
];
