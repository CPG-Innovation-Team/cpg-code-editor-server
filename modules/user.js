const { dbInsertUser } = require('../database/user');

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

module.exports = { createUser };
