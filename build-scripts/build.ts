import {build} from "esbuild";
import {copy} from "esbuild-plugin-copy";
import {name} from "../package.json";
import {emptyDir} from "fs-extra";

(async () => {
  console.time("Build Complete");
  console.time("Build directory cleared");
  await emptyDir("./build");
  console.timeEnd("Build directory cleared");
  await Promise.all([
    build({
      bundle: true,
      entryPoints: ["src/main.ts"],
      external: ["MSF"],
      format: "iife",
      globalName: "SLOT_PROTOTYPE",
      legalComments: "none",
      logLevel: "info",
      minify: false,
      outfile: `build/js/${name}.js`,
      plugins: [
        copy({
          resolveFrom: "cwd",
          assets: [
            {
              from: [
                "./src/index.html",
              ],
              to: ["./build"]
            },
            {
              from: [
                "./src/assets/**/*.*"
              ],
              to: ["./build/assets"]
            },
            {
              from: ["./src/config/*.json"],
              to: ["./build/config"]
            },
          ]        
        }),
      ],
      sourcemap: true
    })
  ]);
  console.timeEnd("Build Complete");
})();