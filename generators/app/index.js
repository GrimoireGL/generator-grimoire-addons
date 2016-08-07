'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require("mkdirp");

module.exports = yeoman.Base.extend({
  prompting: function() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the laudable ' + chalk.red('generator-grimoire-addons') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What you name this addon?',
      default: 'sample'
    }, {
      type: 'input',
      name: 'namespace',
      message: 'What is the default namespace of this addon?',
      default: 'HTTP://GRIMOIRE.GL/NS/CUSTOM'
    }, {
      type: 'input',
      name: 'desc',
      message: 'Give us short description of your addon',
      default: 'Awesome addon ever!'
    }, {
      type: 'input',
      name: 'repo',
      message: 'What is repository url for this addon?',
      default: ''
    }, {
      type: 'confirm',
      name: 'generateSample',
      message: 'Would you like to generate samples?',
      default: true
    }];
    const _this = this;
    return this.prompt(prompts).then(function(props) {
      _this.props = props;
      if (_this.props.generateSample) {
        return _this.prompt([{ // Ask only if generateSample was true
          type: 'confirm',
          name: 'includeConverter',
          message: 'Would you like to include a sample of custom converters?',
          default: false
        }]);
      }
    }).then(function(props) {
      if (props) {
        _this.props.includeConverter = props.includeConverter;
      }
    });
  },

  writing: function() {
    mkdirp.sync(this.destinationPath("./src"));
    mkdirp.sync(this.destinationPath("./test"));
    this.directory('build', 'build');
    this.fs.copyTpl(this.templatePath('_.gitignore'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('_rollup.config.js'), this.destinationPath('rollup.config.js'));
    this.fs.copy(this.templatePath('_.babelrc'), this.destinationPath('.babelrc'));
    this.fs.copy(this.templatePath('./src/index.ts'), this.destinationPath('./src/index.ts'));
    this.fs.copyTpl(this.templatePath('./src/grimoire.json'), this.destinationPath('./src/grimoire.json'), {
      namespace: this.props.namespace
    });
    this.fs.copy(this.templatePath('_tsconfig.json'), this.destinationPath('tsconfig.json'));
    this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), {
      name: this.props.name,
      desc: this.props.desc,
      repo: this.props.repo
    });
    if (this.props.generateSample) {
      if (this.props.includeConverter) {
        mkdirp.sync(this.destinationPath("./src/Converter"));
        this.fs.copy(this.templatePath('./src/Converter/SampleConverter.ts'), this.destinationPath('./src/Converter/SampleConverter.ts'));
      }
      mkdirp.sync(this.destinationPath("./src/Component"));
      this.fs.copy(this.templatePath('./src/Component/SampleComponent.ts'), this.destinationPath('./src/Component/SampleComponent.ts'));
    }
  },

  install: function() {
    this.npmInstall(['babel-cli', 'babel-core@6.13.0', 'rollup', 'rollup-plugin-typescript', 'rollup-plugin-babel', 'rollup-plugin-replace', 'babel-preset-es2015@6.13.0', 'babel-preset-es2015-rollup', 'babel-preset-stage-2', 'babel-plugin-transform-runtime', 'babel-runtime', 'handlebars','chalk'], {
      'saveDev': true
    });
    this.installDependencies();
  }
});
