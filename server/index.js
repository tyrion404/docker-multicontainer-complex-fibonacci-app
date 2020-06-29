const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const keys = require('./keys');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// POSTGRES Setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});
pgClient.on('error', () => {
  console.log('Lost PG connection!');
});

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch((err) => console.log(err));

// REDIS Setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
  return res.send('Another one bites the dust.');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');
  return res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    return res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const index = req.body.value;
  if (parseInt(index) > 40) {
    return res
      .status(422)
      .send('Another one bites the dust. Also try less than 40.');
  }
  redisClient.hset('values', index, 'Nothing Yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  return res.send({ working: true });
});

app.listen(5000, (err) => console.log('Listening'));
