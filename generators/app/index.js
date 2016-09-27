"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _yeomanGenerator = require("yeoman-generator");

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _asyncHelper = require("./async-helper");

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// prompts

var prompt = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(gen) {
    var params, npmrc, pConfig, initialName, prompts, gConfig, newPackageConfig;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            params = {};

            console.log(_chalk2.default.bgWhite.black("Entry point configuration and Test command configuration would be rewritten by generator"));
            // generate .npmrc for default values during running 'npm init'
            _context.next = 4;
            return (0, _asyncHelper.readFileAsync)(gen.templatePath("../../templates/_npmrc"));

          case 4:
            npmrc = _context.sent;
            _context.next = 7;
            return (0, _asyncHelper.writeFileAsync)(gen.destinationPath(".npmrc"), npmrc);

          case 7:
            _context.next = 9;
            return (0, _asyncHelper.existsAsync)(gen.destinationPath("package.json"));

          case 9:
            if (_context.sent) {
              _context.next = 22;
              break;
            }

          case 10:
            if (!true) {
              _context.next = 22;
              break;
            }

            _context.prev = 11;
            _context.next = 14;
            return (0, _asyncHelper.spawnAsync)("npm", ["init"]);

          case 14:
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](11);
            return _context.abrupt("continue", 10);

          case 19:
            return _context.abrupt("break", 22);

          case 22:
            _context.next = 24;
            return (0, _asyncHelper.unlinkAsync)(gen.destinationPath(".npmrc"));

          case 24:
            _context.t1 = JSON;
            _context.next = 27;
            return (0, _asyncHelper.readFileAsync)(gen.destinationPath("package.json"));

          case 27:
            _context.t2 = _context.sent;
            pConfig = _context.t1.parse.call(_context.t1, _context.t2);
            initialName = pConfig.name;

          case 30:
            if (pConfig.name.match(/^grimoirejs(-.+)?$/)) {
              _context.next = 37;
              break;
            }

            console.log(_chalk2.default.bgRed.white("Package name should begin with 'grimoirejs-'"));
            _context.next = 34;
            return gen.prompt({
              type: 'input',
              name: 'name',
              message: 'What you name this addon?',
              default: "grimoirejs-" + initialName
            });

          case 34:
            pConfig.name = _context.sent.name;
            _context.next = 30;
            break;

          case 37:
            prompts = [{
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
            _context.t3 = _lodash2.default;
            _context.next = 41;
            return gen.prompt(prompts);

          case 41:
            _context.t4 = _context.sent;
            params = _context.t3.merge.call(_context.t3, _context.t4);

            if (!params.generateSample) {
              _context.next = 50;
              break;
            }

            _context.t5 = _lodash2.default;
            _context.t6 = params;
            _context.next = 48;
            return gen.prompt([{ // Ask only if generateSample was true
              type: 'confirm',
              name: 'includeConverter',
              message: 'Would you like to include a sample of custom converters?',
              default: false
            }]);

          case 48:
            _context.t7 = _context.sent;
            params = _context.t5.merge.call(_context.t5, _context.t6, _context.t7);

          case 50:
            _context.t8 = JSON;
            _context.next = 53;
            return (0, _asyncHelper.readFileAsync)(gen.templatePath("../../templates/package.grimoire.json"));

          case 53:
            _context.t9 = _context.sent;
            gConfig = _context.t8.parse.call(_context.t8, _context.t9);
            newPackageConfig = _lodash2.default.merge(pConfig, gConfig);
            _context.next = 58;
            return (0, _asyncHelper.writeFileAsync)(gen.destinationPath("package.json"), (0, _stringify2.default)(newPackageConfig));

          case 58:
            gen.props = params;

          case 59:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[11, 16]]);
  }));

  return function prompt(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = _yeomanGenerator2.default.Base.extend({
  prompting: function prompting() {
    return prompt(this);
  },
  paths: function paths() {
    this.sourceRoot(_path2.default.join(__dirname, "../templates"));
  },
  writing: function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
      var t, d, pConfig, name;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // Making aliases
              t = this.templatePath.bind(this);
              d = this.destinationPath.bind(this);
              _context2.t0 = JSON;
              _context2.next = 5;
              return (0, _asyncHelper.readFileAsync)(d("package.json"));

            case 5:
              _context2.t1 = _context2.sent;
              pConfig = _context2.t0.parse.call(_context2.t0, _context2.t1);

              // Copy files directly
              this.fs.copy(t("_gitignore"), d(".gitignore"));
              this.fs.copy(t("tsconfig.json"), d("tsconfig.json"));
              // Make directories
              _context2.next = 11;
              return (0, _asyncHelper.ensureDirAsync)(d("src"));

            case 11:
              _context2.next = 13;
              return (0, _asyncHelper.ensureDirAsync)(d("doc"));

            case 13:
              _context2.next = 15;
              return (0, _asyncHelper.ensureDirAsync)(d("test"));

            case 15:

              // Copy contents
              this.fs.copy(t("src/index.ts"), d("src/index.ts"));
              this.fs.copy(t("test/SampleTest.js"), d("test/SampleTest.js"));

              this.fs.copyTpl(t("doc/header.md"), d("doc/header.md"), {
                name: pConfig.name.replace(/grimoirejs-(.*)/, "$1"),
                pName: pConfig.name,
                description: pConfig.description
              });
              this.fs.copyTpl(t("doc/footer.md"), d("doc/footer.md"), {
                license: pConfig.license
              });
              if (pConfig.license === "MIT") {
                name = "";

                if (pConfig.author && pConfig.author.name) {
                  name = pConfig.author.name;
                }
                this.fs.copyTpl(t("MIT"), d("LICENSE"), {
                  author: name,
                  year: new Date().getFullYear()
                });
              }

            case 20:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function writing() {
      return _ref2.apply(this, arguments);
    }

    return writing;
  }(),
  install: function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              this.npmInstall(["grimoirejs-cauldron", "grimoirejs-inquisitor"], {
                saveDev: true
              });
              this.npmInstall(["grimoirejs"]);
              this.installDependencies();

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function install() {
      return _ref3.apply(this, arguments);
    }

    return install;
  }()
});