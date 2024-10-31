import express from 'express';
import pdfExtractRoute from './routes/pdf_extract.js';
import error from'./middleware/error.js';
import notFound from './middleware/notFound.js';
import ensureDirectoryExistence from './createDir.js';

const app = express()
const port = process.env.PORT | 3000;

//create directory for upload pdf
ensureDirectoryExistence()
.catch((error) => {
  console.error('Error ensuring directory existence:', error);
})

// Extract form data
app.use(express.urlencoded({extended: true}))

// Public html,js,css, and icon files
app.use('/node_modules', express.static('node_modules'));
app.use(express.static('public'));

// Use EJS for frontend views
app.set('view engine', 'ejs');
app.set('views', './public/views')

// Route
app.get('/', (req, res) => {
  res.render('index', { title: 'Bukti Potongan Pajak Scanner'})
})

app.use('/pdf-extract', pdfExtractRoute);

// Middleware
app.use(notFound);
app.use(error)

// Server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})