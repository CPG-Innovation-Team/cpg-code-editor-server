const { getDB } = require('./mongodb');

const userCollection = () => {
  return getDB().collection('user_info');
};

const dbInsertUser = async (param) => {
  return userCollection().insertOne({ ...param });
};

const dbUpdateUser = async (queryParam, data) => {
  return userCollection().updateOne(queryParam, { $set: data });
};

module.exports = { dbInsertUser, dbUpdateUser, userCollection };
