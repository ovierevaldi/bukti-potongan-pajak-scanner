import handleExtractPDF from '../controller/pdf_extract.js';
import express from 'express';
import multer from 'multer';
import path, { dirname } from 'path';
import { prettyPrintJson } from 'pretty-print-json';
import { fileURLToPath } from 'url';

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

const upload = multer({ storage: storage })

const router = express.Router();

// Create a new post
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
      // const p = prettyPrint(data);
      res.status(200).json(data)
    });
})

const prettyPrint = (data) => {
  // const formatter = new JSONFormatter(data);

  // const options = {
  //   lineNumbers: true,
  // }
  // return prettyPrintJson.toHtml(data, options)
  // return formatter;
}

export default router;