import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function ensureDirectoryExistence() {
    const pdfPath = path.join(__dirname, 'uploads', 'pdfs');
    const jsonPath = path.join(__dirname, 'uploads', 'jsons');
    
    await createDir(pdfPath, (err) =>  console.log(err));
    await createDir(jsonPath, (err) =>  console.log(err));
}

async function createDir(dirname, cb){
    fs.access(dirname, fs.constants.F_OK, (err) => {
        // Check if there's no folder make one
        if(err){
            fs.mkdir(dirname, { recursive: true }, (err) => {
                cb(err)
            });
        }
    });
}

export default ensureDirectoryExistence;