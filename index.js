import express from 'express';

const app = express()
const port = process.env.PORT | 3000;

app.set('view engine', 'ejs');

app.set('views', './views')

app.get('/', (req, res) => {
  res.render('index', { title: 'Bukti Potongan Pajak Scanner', name: 'Ovie Revaldi'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})