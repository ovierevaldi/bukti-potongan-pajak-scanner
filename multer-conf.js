const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/pdfs'); // Save to the 'uploads' directory
  },
  filename: function (req, file, cb) {
      const customFileName = req.file.filename + path.extname(file.originalname);
      cb(null, customFileName); 
  }
});

const upload = multer({ storage: storage });

module.exports = upload;