import { PDFExtract } from 'pdf.js-extract';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const pdfExtract = new PDFExtract();
const __dirname = dirname(fileURLToPath(import.meta.url));

const handleExtractPDF = (filename, options = {}, callback) => {

  // set pdf save file
  const pdfPath = path.join(__dirname, '..', 'uploads', 'pdfs', filename);
  
  try {
    const buffer = fs.readFileSync(pdfPath);

    pdfExtract.extractBuffer(buffer, options, async (err, data) => {
      
      if (err){
        return callback({message: 'Cannot extract pdf!'})
      }

      const id = path.basename(filename, '.pdf');

      const jsonData = {
        ref_id: id, 
        data: data
      }
      // Save PDF data as JSON async     
      await asynCreateAndSaveJsonData(id, jsonData);

      // Send extract data to the client
      return callback(null, jsonData);
    });
    
  } 
  catch (error) {
      return callback({message: 'PDF File is not found!'})
  }
}

const asynCreateAndSaveJsonData = async (filename, data) => {
    // Save JSON Data folder location
    const filePath = path.join(__dirname, '..', 'uploads', 'jsons', filename + '.json');

    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
     
    } 
    catch (error) {
      console.log('Cannot save json file data: ' + error)
    }
}


export default handleExtractPDF;