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
  templateAsync
} from './build/fsAsync';

import {
  rollup
} from 'rollup';
import typescript from 'rollup-plugin-typescript';
import replace from 'rollup-plugin-replace';
import npm from 'rollup-plugin-node-resolve';
import chalk from 'chalk';
import exec from 'exec';

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
      npm({
        browser: true
      })
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
  exec("babel ./product/index.es2016.js --out-file ./product/index.js");
}

main();
