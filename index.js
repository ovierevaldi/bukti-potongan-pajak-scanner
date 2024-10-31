import express from 'express';
import pdfExtractRoute from './routes/pdf_extract.js';
import error from'./middleware/error.js';
import notFound from './middleware/notFound.js';

const app = express()
const port = process.env.PORT | 3000;

app.use(express.urlencoded({extended: true}))

app.use('/node_modules', express.static('node_modules'));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views')

app.get('/', (req, res) => {
  res.render('index', { title: 'Bukti Potongan Pajak Scanner', name: 'Ovie Revaldi'})
})

// Route
app.use('/pdf-extract', pdfExtractRoute);

// error middleware
app.use(notFound);
app.use(error)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})