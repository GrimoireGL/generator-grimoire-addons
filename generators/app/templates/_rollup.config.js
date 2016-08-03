const rollup = require("rollup");
const typescript = require('rollup-plugin-typescript');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

function transformIntoFileNames(files) {
  const names = {};
  const regex = /(.+)\.([^\.]*)$/m;
  const obtainRelativePath = /.*\/([^\/]*)$/m;
  for (var i = 0; i < files.length; i++) {
    const filePath = files[i];
    const baseName = path.basename(files[i]);
    const name = baseName.replace(regex, "$1");
    names[name] = filePath.replace(obtainRelativePath, "./$1");
  }
  return names;
}

function obtainGlob(src) {
  return new Promise((resolve, reject) => {
    glob(src, (er, files) => {
      resolve(transformIntoFileNames(files));
    });
  });
}

function generateImports(obj) {
  let imports = "";
  for (let key in obj) {
    const path = obj[key];
    imports += "import " + key + ' from "' + path + '";\n';
  }
  return imports;
}

function generateComponentRegistering(components, ns) {
  let registering = "const __ns1 = GrimoireInterface.ns('" + ns + "');\n";
  for (let key in components) {
    registering += 'GrimoireInterface.registerComponent(__ns1("' + key + '"),' + key + ");\n";
  }
  return registering;
}

function generateConverterRegistering(converters, ns) {
  let registering = "const __ns2= GrimoireInterface.ns('" + ns + "');\n";
  const regex = /(.+)Converter$/mi;
  for (let key in converters) {
    registering += 'GrimoireInterface.registerComponent(__ns2("' + key.replace(regex, "$1") + '"),' + key + ");\n";
  }
  return registering;
}

function generateNodeRegistering(nodes, ns) {

}

function build(imports, components, converters, nodes) {
  rollup.rollup({
    entry: './src/index.ts',
    dest: './lib/index.js',
    plugins: [
      replace({
        delimiters: ['//<%=', '%>'],
        values: {
          PLUGIN_REGISTERER_IMPORTS: imports,
          PLUGIN_COMPONENT_REGISTERER_RESOLVING: components,
          PLUGIN_CONVERTER_REGISTERER_RESOLVING: converters
        }
      }),
      typescript(),
      babel({
        presets: ["es2015-rollup"]
      })
    ]
  }).then(bundle => {
    bundle.write({
      format: 'cjs',
      dest: './product/index.js'
    });
  }).catch(err => {
    console.error(err);
  });
}


fs.readFile('./src/grimoire.json', 'utf-8', (err, text) => {
  const generatorInfo = JSON.parse(text);
  let components, nodes, converters;
  obtainGlob("./src/**/*Component.ts").then(res => {
    components = res;
    return obtainGlob("./src/**/*Converter.ts");
  }, err => {
    console.error(err);
  }).then(res => {
    converters = res;
    build(generateImports(components) + generateImports(converters), generateComponentRegistering(components, generatorInfo.namespace), generateConverterRegistering(converters, generatorInfo.namespace), generateNodeRegistering(generatorInfo.nodes));
  }, err => {
    console.error(err);
  })
});
