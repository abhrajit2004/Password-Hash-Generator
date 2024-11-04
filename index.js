require('dotenv').config();

const express = require('express')
const app = express()
const connectToMongo = require('./connectDb');
const port = process.env.PORT;

connectToMongo();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', require('./routes/auth'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})