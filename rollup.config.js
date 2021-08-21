import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const banner = `/*!
 * ${pkg.name}
 * ${pkg.description}
 *
 * @version v${pkg.version}
 * @author ${pkg.author}
 * @license ${pkg.license}
 */
`;

export default [
  {
    input: 'src/index.js',
    output: {
      banner,
      name: 'promiseRetryHelper',
      file: pkg.browser,
      format: 'umd',
      exports: 'auto',
    },
    plugins: [
      nodeResolve({ browser: true }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: ['node_modules/**'],
      }),
      terser({ output: { comments: /^!/ } }),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      banner,
      file: pkg.module,
      format: 'es',
    },
    plugins: [commonjs()],
  },
];
