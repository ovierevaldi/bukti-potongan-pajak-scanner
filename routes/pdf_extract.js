import handleExtractPDF from '../controller/pdf_extract.js';
import express from 'express';
// import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import multerClient from '../multer-conf.js';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

// get form data: pdf file is on pdf-input field
router.post('/', multerClient.single('pdf-input'),  (req, res, next) => {
  // get filename from multer dont upload
  const fileName = req.file.filename;

  // extract.pdf config file
  const options = {
    normalizeWhitespace: true,
    disableCombineTextItems: false 
  }

  // Extract PDF Data!
  handleExtractPDF(fileName, options, (err, data) => {
    if(err){
      next(err)
    }
    res.status(200).json(data)
  });
})

router.get('/download/:id', (req, res, next) => {
  const id = req.params.id;
  const filePath = path.join(__dirname, '..', 'uploads', 'jsons', id + '.json');

  res.download(filePath, (err) => {
    if (err) {
      res.status(500).send('Error occurred while sending the file.');
    }
  });
})

export default router;