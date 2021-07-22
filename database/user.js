const db = require('./mongodb');

const userCollection = db.collection('user_info');

const dbInsertUser = async (param) => {
  const result = await userCollection.insertOne({ ...param });
  return result;
};

module.exports = { dbInsertUser };
