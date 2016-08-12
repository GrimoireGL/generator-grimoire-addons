import {
  copyDirAsync,
  readFileAsync,
  writeFileAsync,
  templateAsync,
  unlinkAsync,
  execAsync
} from './fsAsync';
import {
  glob
} from './globAsync';
import {
  getFileNameBody,
  getRelativePath
} from './pathUtil';

const main = async() => {
  await copyDirAsync('./src', './lib-ts');
  let index = await readFileAsync('./lib-ts/index.ts');
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
    namespace: config.grimoire.namespace ? config.grimoire.namespace : "HTTP://GRIMOIRE.GL/NS/CUSTOM",
    components: components,
    converters: converters
  });
  index = index.replace(/^\s*\/\/\<\%\=IMPORTS\%\>\s*$/m, imports);
  index = index.replace(/^\s*\/\/\<\%\=REGISTER\%\>\s*$/m, register);
  await unlinkAsync('./lib-ts/index.ts');
  await writeFileAsync('./lib-ts/index.ts', index);
  await execAsync("tsc-glob --declaration --outDir ./lib -m es6 -t es6 --files-glob ./lib-ts/*.ts");
};

main();
