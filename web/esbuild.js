const esbuild = require('esbuild');
const fs = require('fs');

const isDevelopment = (process.env.npm_lifecycle_event != 'prepare');

const config = {
  entryPoints: [{in: './index.js', out: 'utils-web'}],
  bundle: true,
  format: 'cjs',
  preserveSymlinks: true, // this allows us to use symlinks
  // Do *NOT* minify, it would remove "magic webpack comments" that are required
  // by users that use webpack for bundling.
  // minify: !isDevelopment,
  sourcemap: isDevelopment,
  target: ['chrome110', 'firefox110', 'safari15', 'edge110'],
  packages: 'external',
  outdir: 'dist',
  loader: {
    '.js': 'jsx',
    '.svg': 'text',
    // '.wasm': 'file',
    // '.css': 'local-css',
  },
  plugins: [{
      name: 'rebuild-notify',
      setup(build) {
        build.onEnd(result => {
          console.log(new Date(),
            `build ended with ${result.errors.length} errors`);
        })
      },
    }
  ],
};

const run = async () => {
  const ctx = await esbuild.context(config);
  if (isDevelopment) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    process.exit(0);
  }

  // const formats = [
  //   { format: 'cjs' },
  //   { format: 'esm', outExtension: {'.js': '.esm.mjs'}}
  // ];

  // for (let overwrites of formats) {
  //   const ctx = await esbuild.context({...config, ...overwrites});
  //   isDevelopment ? ctx.watch() : await ctx.rebuild();
  // }
  // !isDevelopment && process.exit(0);
};

run();

// in dev we also compile the test app
if (isDevelopment) {
  require('./test/esbuild.js');
}
