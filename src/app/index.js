import yeoman from "yeoman-generator";
import _ from "lodash";
import path from "path";
import {
  existsAsync,
  spawnAsync,
  writeFileAsync,
  readFileAsync,
  unlinkAsync,
  ensureDirAsync,
  execAsync
} from "./async-helper";
import chalk from "chalk";

// prompts

const prompt = async(gen) => {
  let params = {};
  console.log(chalk.bgWhite.black("Entry point configuration and Test command configuration would be rewritten by generator"));
  // generate .npmrc for default values during running 'npm init'
  const npmrc = await readFileAsync(gen.templatePath("../../templates/_npmrc"));
  await writeFileAsync(gen.destinationPath(".npmrc"), npmrc);
  if (!(await existsAsync(gen.destinationPath("package.json")))) {
    while (true) {
      try {
        await spawnAsync("npm", ["init"]); // execute npm init
      } catch (e) {
        continue;
      }
      break;
    }
  }
  await unlinkAsync(gen.destinationPath(".npmrc")); // remove .npmrc
  const pConfig = JSON.parse(await readFileAsync(gen.destinationPath("package.json")));
  const initialName = pConfig.name;
  while (!pConfig.name.match(/^grimoirejs(-.+)?$/)) {
    console.log(chalk.bgRed.white("Package name should begin with 'grimoirejs-'"));
    pConfig.name = ((await gen.prompt({
      type: 'input',
      name: 'name',
      message: 'What you name this addon?',
      default: "grimoirejs-" + initialName
    })).name);
  }
  var prompts = [{
    type: 'input',
    name: 'namespace',
    message: 'What is the default namespace of this addon?',
    default: 'HTTP://GRIMOIRE.GL/NS/DEFAULT'
  }, {
    type: 'confirm',
    name: 'generateSample',
    message: 'Would you like to generate samples?',
    default: true
  }];
  params = _.merge(await gen.prompt(prompts));
  if (params.generateSample) {
    params = _.merge(params, await gen.prompt([{ // Ask only if generateSample was true
      type: 'confirm',
      name: 'includeConverter',
      message: 'Would you like to include a sample of custom converters?',
      default: false
    }]));
  }
  const gConfig = JSON.parse(await readFileAsync(gen.templatePath("../../templates/package.grimoire.json")));
  const newPackageConfig = _.merge(pConfig, gConfig);
  await writeFileAsync(gen.destinationPath("package.json"), JSON.stringify(newPackageConfig));
  gen.props = params;
}


module.exports = yeoman.Base.extend({
  prompting: function() {
    return prompt(this);
  },
  paths: function() {
    this.sourceRoot(path.join(__dirname, "../templates"));
  },
  writing: async function() {
    // Making aliases
    const t = this.templatePath.bind(this);
    const d = this.destinationPath.bind(this);

    const pConfig = JSON.parse(await readFileAsync(d("package.json")));
    // Copy files directly
    this.fs.copy(t("_gitignore"), d(".gitignore"));
    this.fs.copy(t("tsconfig.json"), d("tsconfig.json"));
    // Make directories
    await ensureDirAsync(d("src"));
    await ensureDirAsync(d("doc"));
    await ensureDirAsync(d("test"));

    // Copy contents
    this.fs.copy(t("src/index.ts"), d("src/index.ts"));
    this.fs.copy(t("test/SampleTest.js"), d("test/SampleTest.js"));

    this.fs.copyTpl(t("doc/header.md"),d("doc/header.md"),{
      name:pConfig.name.replace(/grimoirejs-(.*)/,"$1"),
      pName:pConfig.name,
      description:pConfig.description,
    });
    this.fs.copyTpl(t("doc/footer.md"),d("doc/footer.md"),{
      license:pConfig.license
    });
    if(pConfig.license === "MIT"){
      let name = "";
      if(pConfig.author && pConfig.author.name){
        name = pConfig.author.name;
      }
      this.fs.copyTpl(t("MIT"),d("LICENSE"),{
        author:name,
        year: (new Date()).getFullYear()
      });
    }
  },
  install:async function() {
    this.npmInstall(["grimoirejs-cauldron","grimoirejs-inquisitor"], {
      saveDev: true
    });
    this.npmInstall(["grimoirejs"]);
    this.installDependencies();
  }
});
