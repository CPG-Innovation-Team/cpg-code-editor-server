const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();
const exists = promisify(client.exists).bind(client);

const EXPIRE_TIME = 259200; // Expire time for recycling unused room

client.on('error', (err) => {
  console.error(`Redis error: ${err}`);
});

async function getCode(roomId) {
  return new Promise((resolve, reject) => {
    client
      .multi()
      .hget(roomId, 'code')
      .expire(roomId, EXPIRE_TIME)
      .exec((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0]);
        }
      });
  });
}

async function updateCode(roomId, code) {
  return new Promise((resolve, reject) => {
    client
      .multi()
      .hmset(roomId, ['code', code, 'updateTime', Date.now()])
      .expire(roomId, EXPIRE_TIME)
      .exec((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0]);
        }
      });
  });
}

async function roomExistQuery(roomId) {
  return exists(roomId);
}

module.exports = { updateCode, getCode, roomExistQuery };
