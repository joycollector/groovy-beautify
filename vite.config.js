const fs = require("fs");
const path = require("path");
const { defineConfig } = require("vite");


module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "index",
      formats: ["es", "cjs"],
      fileName: (format) => `${format}/index.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [""],
      plugins: [{
        name: "hybrid-module-plugin",
        writeBundle: (options, b) => {
          const packageJson = {type: options.format === "cjs" ? "commonjs" : "module"};
          fs.writeFileSync(path.join(options.dir, options.format, "package.json"), JSON.stringify(packageJson, null, 4))
        }
      }],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
      },
    },
  },
});
