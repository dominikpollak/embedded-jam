import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist/esm",
      format: "esm",
      sourcemap: true,
    },
    plugins: [peerDepsExternal(), resolve({ extensions: [".js", ".jsx", ".ts", ".tsx"] }), commonjs(), typescript({ tsconfig: "./tsconfig.json" })],
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
      typescript({ tsconfig: "./tsconfig.json" }),
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
  },
];
