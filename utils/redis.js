const { createClient } = require('redis');
const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => {
  console.log('Redis client connected to the server');
});
client.connect();

module.exports = { client };
