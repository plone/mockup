import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve'
import svelte from 'rollup-plugin-svelte';
// import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;


export default {
    input: 'src/main.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'miller_columns_browser',
        file: './miller-columns-browser.js'
    },
    plugins: [
        svelte({
            /// enables compiling to native customElement (webcomponent):
            // customElement: true,
            // hydratable: true,
            // enable run-time checks when not in production
            dev: !production,
            // we'll extract any component CSS out into
            // a separate file - better for performance
            css: css => {
                css.write('miller-columns-browser.css');
            }
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve({
          contentBase: './',
          open: false
        }),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload({
          verbose: false,
          watch: './'
        }),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        //production && terser()
    ],
    watch: {
        clearScreen: false
    }
};
