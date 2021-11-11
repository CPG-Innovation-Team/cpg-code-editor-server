const { MongoClient } = require('mongodb');

const DB_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = 'cpg_code_editor';

const client = new MongoClient(DB_URL);
let db;

const dbConnect = async (callback) => {
  const connection = await client.connect();
  if (callback) {
    callback();
  }
  db = connection.db(DB_NAME);
};

const getDB = () => {
  return db;
};

const dbClose = () => {
  client.close();
};

process.on('SIGINT', async () => {
  dbClose();
  process.exit(0);
});

module.exports = { getDB, dbConnect, dbClose };
