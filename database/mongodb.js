const { MongoClient } = require('mongodb');

const DB_URL = process.env.NODE_ENV === 'test' ? process.env.MONGO_URL : 'mongodb://localhost:27017';
const DB_NAME = 'cpg_code_editor';

const client = new MongoClient(DB_URL);
client.connect();
const db = client.db(DB_NAME);

const dbClose = () => {
  client.close();
};

process.on('SIGINT', async () => {
  await dbClose();
  process.exit(0);
});

module.exports = { db, dbClose };
