const { dbInsertUser, dbUpdateUser } = require('../database/user');
const { ObjectId } = require('mongodb');

const createUser = async (userName, avatar) => {
  const createTime = Date.now();
  const result = await dbInsertUser({
    userName,
    avatar,
    createTime,
  });

  return {
    success: result.acknowledged,
    userId: result.insertedId,
  };
};

const updateUser = async (userId, userName, avatar) => {
  const createTime = Date.now();
  const result = await dbUpdateUser({ _id: ObjectId(userId) }, { userName, avatar });

  return { success: result.acknowledged };
};

module.exports = { createUser, updateUser };
