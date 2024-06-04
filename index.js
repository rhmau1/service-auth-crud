const express = require('express');
// const { createClient } = require('redis');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3000;

// const client = createClient();
// client.on('error', (err) => console.log('Redis Client Error', err));
// client.on('connect', () => {
//   console.log('Redis client connected to the server');
// });
// client.connect();

const { userRoutes } = require('./routes/user.routes');
const { produkRoutes } = require('./routes/produk.routes');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Auth CRUD Service');
});

app.use('/user', userRoutes);
app.use('/produk', produkRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Route Not Found',
  });
});

app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`);
});
