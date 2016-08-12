import babelHelpers from 'babel-helpers';
import {
    glob
} from './build/globAsync';
import {
    getFileNameBody,
    getRelativePath
} from './build/pathUtil';
import {
    readFileAsync,
    templateAsync,
    execAsync
} from './build/fsAsync';

import {
    rollup
} from 'rollup';
import typescript from 'rollup-plugin-typescript';
import replace from 'rollup-plugin-replace';
import npm from 'rollup-plugin-node-resolve';
import builtin from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import chalk from 'chalk';

const buildTask = (imports, register) => {
    return rollup({
        entry: './src/index.ts',
        dest: './lib/index.js',
        plugins: [
            replace({
                include: './src/index.ts',
                delimiters: ['//<%=', '%>'],
                values: {
                    IMPORTS: imports,
                    REGISTER: register
                }
            }),
            typescript(),
            builtin(),
            npm({
                jsnext: true,
                main: true,
                browser: true
            }),
            commonjs({
                ignoreGlobal: true,
                exclude: ["node_modules/rollup-plugin-node-builtins/**","node_modules/rollup-plugin-node-globals/**"] // https://github.com/calvinmetcalf/rollup-plugin-node-builtins/issues/5
            }), globals()
        ]
    });
};


const main = async() => {
    const config = JSON.parse(await readFileAsync("./package.json"));

    config.grimoire = config.grimoire ? config.grimoire : {};
    // glob component files
    const componentFiles = await glob('./src/**/*Component.ts');
    const components = componentFiles.map(v => {
        return {
            key: getFileNameBody(v),
            path: getRelativePath(v)
        };
    });
    // glob converter files
    const converterFiles = await glob('./src/**/*Converter.ts');
    const converters = converterFiles.map(v => {
        return {
            key: getFileNameBody(v),
            path: getRelativePath(v)
        };
    });
    const imports = await templateAsync("./build/templates/imports.template", {
        externals: config.grimoire.dependencies,
        components: components,
        converters: converters
    });
    const register = await templateAsync("./build/templates/register.template", {
        namespace: config.grimoire.namespace ? config.grimoire.namespace : "HTTP://GRIMOIRE.GL/NS/USER",
        components: components,
        converters: converters
    });
    let bundle = null;
    try {
        bundle = await buildTask(imports, register);
    } catch (e) {
        console.error(chalk.white.bgRed("COMPILATION FAILED"));
        console.error(chalk.red(e));
        console.error(chalk.yellow(e.stack));
        return;
    }
    console.log(chalk.white.bgBlue("COMPILATION SUCCESS"));
    bundle.write({
        format: 'cjs',
        dest: './product/index.es2016.js'
    });
    await execAsync("npm run bundle");
}

main();
