const { MongoClient } = require('mongodb');

const DB_URL = 'mongodb://localhost:27017';
const DB_NAME = 'cpg_code_editor';

const client = new MongoClient(DB_URL);
client.connect();
const db = client.db(DB_NAME);

process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});

module.exports = db;
