
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
    pdfExtract.extractBuffer(buffer, options, async (err, data) => {
      if (err){
        return callback({message: 'Cannot extract pdf!'})
      }
      await saveJSONFile(filename, data.pages);
      const id = path.basename(filename, '.pdf');

      return callback(null, {ref_id: id, data: data.pages})
    });
    
  } catch (error) {
      return callback({message: 'File is not found!'})
  }
}

const saveJSONFile = async (filename, data) => {
  // Your JSON data
    const name = path.basename(filename, '.pdf')

    // Define the directory path
    const filePath = path.join(__dirname, '..', 'uploads', 'jsons', name + '.json');

    try {
      fs.writeFileSync(filePath, JSON.stringify(data));
      console.log('JSON file has been saved!');
    } catch (error) {
      console.log(error);
    }
}


export default handleExtractPDF