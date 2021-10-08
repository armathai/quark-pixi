import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json';

export default [
    {
        input: './src/index.ts',

        // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
        // https://rollupjs.org/guide/en#external-e-external
        external: ['pixi.js', '@pixi/core', '@pixi/display', '@pixi/sprite', '@pixi/ticker'],

        plugins: [
            nodeResolve(),
            // Compile TypeScript/JavaScript files
            esbuild(),
        ],

        output: [
            {
                file: pkg.main,
                format: 'cjs',
            },
            {
                file: pkg.module,
                format: 'es',
            },
        ],
    },
    {
        input: './src/index.ts',

        // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
        // https://rollupjs.org/guide/en#external-e-external
        external: [],

        plugins: [
            // Compile TypeScript/JavaScript files
            dts(),
        ],

        output: {
            file: pkg.types,
            format: 'es',
        },
    },
];
