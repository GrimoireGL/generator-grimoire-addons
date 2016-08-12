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


export default async function(config) {
    await copyDirAsync('./src', './lib-ts');
    let index = await readFileAsync('./src/index.ts');
    // glob component files
    const componentFiles = await glob('./src/**/*Component.ts');
    const components = componentFiles.map(v => {
      const nameBody = getFileNameBody(v);
      const tag = nameBody.replace(/^(.+)Component$/,"$1");
      if(!tag){
        console.error("The name just 'Component' is prohibited for readability");
      }
        return {
            tag:tag,
            key: nameBody,
            path: getRelativePath(v)
        };
    });
    // glob converter files
    const converterFiles = await glob('./src/**/*Converter.ts');
    const converters = converterFiles.map(v => {
      const nameBody = getFileNameBody(v);
      const tag = nameBody.replace(/^(.+)Converter$/,"$1");
      if(!tag){
        console.error("The name just 'Converter' is prohibited for readability");
      }
        return {
            tag:tag,
            key: nameBody,
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
}
