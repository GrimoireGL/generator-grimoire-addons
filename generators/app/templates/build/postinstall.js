import {
  copyDirAsync,
  readFileAsync,
  writeFileAsync,
  templateAsync,
  unlinkAsync
} from './fsAsync';
import {
  glob
} from './globAsync';
import {
  getFileNameBody,
  getRelativePath
} from './pathUtil';

const main = async() => {
  await copyDirAsync('./src', './dist');
  let index = await readFileAsync('./dist/index.ts');
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
  console.log(index);
  await unlinkAsync('./dist/index.ts');
  await writeFileAsync('./dist/index.ts', index);
};

main();
