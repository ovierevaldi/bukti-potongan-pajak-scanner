import handleExtractPDF from '../controller/pdf_extract.js';
import express from 'express';
import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const upload = multer({ storage: storage })
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    const filePath = path.join(__dirname, '..', 'uploads', 'pdfs');
      cb(null, filePath)
    },

    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '.pdf')
    }
})

router.post('/', upload.single('pdf-input'),  (req, res, next) => {
    const fileName = req.file.filename;
    const options = {
      normalizeWhitespace: true,
      disableCombineTextItems: false 
    }

    handleExtractPDF(fileName, options, (err, data) => {
      if(err){
        res.status(500).send(err.message)
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