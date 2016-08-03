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
    },
    {
      type:'input',
      name:'namespace',
      message:'What is the default namespace of this addon?',
      default:'HTTP://GRIMOIRE.GL/NS/CUSTOM'
    },{
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

    return this.prompt(prompts).then(function(props) {
      this.props = props;
    }.bind(this));
  },

  writing: function() {
    mkdirp.sync(this.destinationPath("./src"));
    mkdirp.sync(this.destinationPath("./test"));
    this.fs.copyTpl(this.templatePath('_.gitignore'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('_rollup.config.js'), this.destinationPath('rollup.config.js'));
    this.fs.copy(this.templatePath('_.babelrc'), this.destinationPath('.babelrc'));
    this.fs.copy(this.templatePath('./src/index.ts'), this.destinationPath('./src/index.ts'));
    this.fs.copyTpl(this.templatePath('./src/grimoire.json'),this.destinationPath('./src/grimoire.json'),{
      namespace:this.props.namespace
    });
    this.fs.copy(this.templatePath('_tsconfig.json'), this.destinationPath('tsconfig.json'));
    this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), {
      name: this.props.name,
      desc: this.props.desc,
      repo: this.props.repo
    });
  },

  install: function() {
    this.npmInstall(['gulp', 'rollup', 'rollup-plugin-typescript', 'rollup-plugin-babel','rollup-plugin-replace', 'babel-preset-es2015-rollup', 'babel-preset-stage-2','glob'], {
      'saveDev': true
    });
    this.installDependencies();
  }
});
