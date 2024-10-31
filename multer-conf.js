import multer from 'multer'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  const filePath = path.join(__dirname, 'uploads', 'pdfs');
    cb(null, filePath)
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '.pdf')
  }
})


const multerClient = multer({ storage: storage })

export default multerClient;