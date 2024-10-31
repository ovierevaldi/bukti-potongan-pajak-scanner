
import multer from 'multer'
import { PDFExtract } from 'pdf.js-extract';

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '.pdf')
    }
})

const pdfExtract = new PDFExtract();
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const handleExtractPDF = (filename, options = {}, callback) => {
  const filePath = path.join(__dirname, '..', 'uploads', 'pdfs', filename);
  
  try {
    const buffer = fs.readFileSync(filePath);
    console.log(options)
    pdfExtract.extractBuffer(buffer, options, (err, data) => {
      if (err){
        return callback({message: 'Cannot extract pdf!'})
      }
      return callback(null, data.pages)
    });
    
  } catch (error) {
      return callback({message: 'File is not found!'})
  }
}



export default handleExtractPDF