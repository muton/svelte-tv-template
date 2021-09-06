import svelte from 'rollup-plugin-svelte';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;
// const legacy = !!process.env.IS_LEGACY_BUILD;
const legacy = true;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			},
			onwarn: (warning, handler) => {
				console.log("onwarn", warning.code);
				// e.g. don't warn on <marquee> elements, cos they're cool
				if (warning.code === 'a11y-distracting-elements') return;
				// let Rollup handle all other warnings normally
				handler(warning);				
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

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
		typescript({
			sourceMap: !production,
			inlineSources: !production,
			target: "es5"
		}),
		legacy && babel({
			babelHelpers: "runtime",
			extensions: [".js", ".mjs", ".html", ".svelte"],
			// exclude: ["node_modules/@babel/**"],
			exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],			
			presets: [
				[
					"@babel/preset-env",
					{
						modules: false,
						targets: "opera >= 12",
						useBuiltIns: 'usage',
						corejs: 3
					},
				],
			],
			plugins: [
				"@babel/plugin-syntax-dynamic-import",
				[
					"@babel/plugin-transform-runtime",
					{
						useESModules: true,
					},
				],
			],
		}),		

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
