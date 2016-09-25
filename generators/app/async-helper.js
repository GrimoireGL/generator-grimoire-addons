'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.readFileAsync = readFileAsync;
exports.copyDirAsync = copyDirAsync;
exports.writeFileAsync = writeFileAsync;
exports.unlinkAsync = unlinkAsync;
exports.execAsync = execAsync;
exports.spawnAsync = spawnAsync;
exports.emptyDirAsync = emptyDirAsync;
exports.ensureDirAsync = ensureDirAsync;
exports.ensureFileAsync = ensureFileAsync;
exports.existsAsync = existsAsync;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function readFileAsync(filePath) {
    return new _promise2.default(function (resolve, reject) {
        _fs2.default.readFile(filePath, 'utf-8', function (err, txt) {
            if (err) {
                reject(err);
            } else {
                resolve(txt);
            }
        });
    });
}

function copyDirAsync(src, dest) {
    var clobber = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    var filter = arguments[3];

    if (!filter) {
        filter = function filter() {
            return true;
        };
    }
    return new _promise2.default(function (resolve, reject) {
        _fsExtra2.default.copy(src, dest, {
            clobber: clobber,
            filter: filter
        }, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function writeFileAsync(filePath, content) {
    return new _promise2.default(function (resolve, reject) {
        _fsExtra2.default.outputFile(filePath, content, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function unlinkAsync(filePath) {
    return new _promise2.default(function (resolve, reject) {
        _fs2.default.unlink(filePath, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function execAsync(command) {
    return new _promise2.default(function (resolve, reject) {
        var process = (0, _child_process.exec)(command, function (err, stdout, stderr) {
            resolve({
                stdout: stdout,
                stderr: stderr,
                err: err
            });
        });
    });
}

function spawnAsync(command, args) {
    return new _promise2.default(function (resolve, reject) {
        var cProcess = (0, _child_process.spawn)(command, args, {
            cwd: undefined,
            env: process.env,
            stdio: "inherit"
        });
        cProcess.on("exit", function (code) {
            if (code === 0) {
                resolve(0);
            } else {
                reject(code);
            }
        });
    });
}

function emptyDirAsync(src) {
    return new _promise2.default(function (resolve, reject) {
        _fsExtra2.default.emptyDir(src, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function ensureDirAsync(path) {
    return new _promise2.default(function (resolve, reject) {
        _fsExtra2.default.ensureDir(path, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function ensureFileAsync(path) {
    return new _promise2.default(function (resolve, reject) {
        _fsExtra2.default.ensureFile(path, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function existsAsync(path) {
    return new _promise2.default(function (resolve, reject) {
        _fs2.default.stat(path, function (err, stat) {
            if (err === null) {
                resolve(true);
            } else if (err.code == 'ENOENT') {
                // file does not exist
                resolve(false);
            } else {
                reject('Some other error: ', err.code);
            }
        });
    });
}