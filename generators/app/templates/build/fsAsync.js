import fs from 'fs';
import handleBars from 'handlebars';
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
