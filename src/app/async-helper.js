import fs from 'fs';
import fse from 'fs-extra';
import {
    exec,
    spawn
} from 'child_process';

export function readFileAsync(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, txt) => {
            if (err) {
                reject(err);
            } else {
                resolve(txt);
            }
        });
    });
}

export function copyDirAsync(src, dest, clobber = false, filter) {
    if (!filter) {
        filter = () => {
            return true;
        };
    }
    return new Promise((resolve, reject) => {
        fse.copy(src, dest, {
            clobber: clobber,
            filter: filter
        }, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

export function writeFileAsync(filePath, content) {
    return new Promise((resolve, reject) => {
        fse.outputFile(filePath, content, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

export function unlinkAsync(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

export function execAsync(command) {
    return new Promise((resolve, reject) => {
        const process = exec(command, (err, stdout, stderr) => {
            resolve({
                stdout: stdout,
                stderr: stderr,
                err: err
            });
        });
    });
}

export function spawnAsync(command, args) {
    return new Promise((resolve, reject) => {
        const cProcess = spawn(command, args, {
            cwd: undefined,
            env: process.env,
            stdio: "inherit"
        });
        cProcess.on("exit",(code)=>{
          if(code === 0){
            resolve(0);
          }else{
            reject(code);
          }
        });
    });
}


export function emptyDirAsync(src) {
    return new Promise((resolve, reject) => {
        fse.emptyDir(src, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

export function ensureDirAsync(path) {
    return new Promise((resolve, reject) => {
        fse.ensureDir(path, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function ensureFileAsync(path) {
    return new Promise((resolve, reject) => {
        fse.ensureFile(path, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function existsAsync(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stat) => {
            if (err === null) {
                resolve(true);
            } else if (err.code == 'ENOENT') {
                // file does not exist
                resolve(false)
            } else {
                reject('Some other error: ', err.code);
            }
        });
    });
}
