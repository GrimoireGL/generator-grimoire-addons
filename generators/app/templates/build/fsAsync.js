import fs from 'fs';
import handleBars from 'handlebars';
import wrench from 'wrench';
import {exec} from 'child_process';
import chalk from 'chalk';
export async function readFileAsync(filePath) {
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


export async function templateAsync(filePath, args) {
  const template = await readFileAsync(filePath);
  return handleBars.compile(template)(args);
}

export async function copyDirAsync(src, dest, forceDelete = false) {
  return new Promise((resolve, reject) => {
    wrench.copyDirRecursive(src, dest, {
      forceDelete: forceDelete
    }, () => {
      resolve();
    });
  });
}

export async function writeFileAsync(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath,content,(err)=>{
      if(err)reject(err);
      resolve();
    });
  });
}

export async function unlinkAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

export async function execAsync(command){
  return new Promise((resolve,reject)=>{
    exec(command,(err,stdout,stderr)=>{
      if(stdout){
        console.log(stdout);
      }
      if(stderr){
        console.error(chalk.red(stderr));
      }
      if(err){
        console.error(chalk.white.bgRed(err));
        reject(err);
      }
      resolve();
    });
  });
}
