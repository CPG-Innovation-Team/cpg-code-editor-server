const { db } = require('./mongodb');

const userCollection = db.collection('user_info');

const dbInsertUser = async (param) => {
  const result = await userCollection.insertOne({ ...param });
  return result;
};

const dbUpdateUser = async (queryParam, data) => {
  const result = await userCollection.updateOne(queryParam, { $set: data });
  return result;
};

module.exports = { dbInsertUser, dbUpdateUser, userCollection };
