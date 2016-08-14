'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require("mkdirp");
var path = require('path');
module.exports = yeoman.Base.extend({
  prompting: function() {

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What you name this addon?',
      default: path.basename(this.destinationRoot())
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
    // generating folders
    mkdirp.sync(this.destinationPath("./src"));
    mkdirp.sync(this.destinationPath("./test"));
    // copy directories would be used as build scripts
    this.directory('build', 'build');
    this.directory('samples', 'samples');
    this.fs.copy(this.templatePath('_rollup.config.js'), this.destinationPath('rollup.config.js'));
    this.fs.copy(this.templatePath('./src/index.ts'), this.destinationPath('./src/index.ts'));
    this.fs.copy(this.templatePath('_tsconfig.json'), this.destinationPath('tsconfig.json'));
    this.fs.copy(this.templatePath('.babelrc'), this.destinationPath('.babelrc'));
    this.fs.copy(this.templatePath('_.gitignore'), this.destinationPath('.gitignore'));
    this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), {
      name: this.props.name,
      desc: this.props.desc,
      repo: this.props.repo
    });
    this.fs.copyTpl(this.templatePath('typings.json'), this.destinationPath('typings.json'), {
      name: this.props.name
    });
    if (this.props.generateSample) {
      if (this.props.includeConverter) {
        mkdirp.sync(this.destinationPath("./src/Converters"));
        this.fs.copy(this.templatePath('./src/Converters/SampleConverter.ts'), this.destinationPath('./src/Converters/SampleConverter.ts'));
      }
      mkdirp.sync(this.destinationPath("./src/Components"));
      this.fs.copy(this.templatePath('./src/Components/SampleComponent.ts'), this.destinationPath('./src/Components/SampleComponent.ts'));
    }
  },

  install: function() {
    this.npmInstall(['rollup-plugin-sourcemaps', 'uglify', 'progress', 'babel-cli', 'rollup', 'rollup-plugin-typescript', 'rollup-plugin-babel', 'rollup-plugin-replace', 'rollup-plugin-node-resolve', 'babel-preset-es2015', 'babel-preset-stage-2', 'babel-plugin-transform-runtime', 'babel-runtime', 'handlebars', 'chalk', 'http-server', 'grimoirejs', 'rollup-plugin-node-builtins', 'rollup-plugin-commonjs', 'rollup-plugin-node-globals', 'typings', 'yargs', 'watch', 'fs-extra', 'typescript@beta'], {
      'saveDev': true
    });
    this.npmInstall(['events', 'utils', 'buffer'], {
      'save': true
    });
    this.installDependencies();
  }
});
