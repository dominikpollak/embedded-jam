import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

export default {
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      exclude: /node_modules/,
      presets: [
        "@babel/preset-react",
        "@babel/preset-typescript",
        ["@babel/preset-env", { targets: { esmodules: true } }],
      ],
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      outputToFilesystem: true,
    }),
    postcss(),
    json(),
  ],
};
