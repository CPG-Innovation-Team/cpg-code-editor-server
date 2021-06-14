const redis = require('redis');
const { promisify } = require('util');

const EXPIRE_TIME = 259200; // Expire time for recycling unused room

const redisHandler = new Promise((resolve) => {
  const client = redis.createClient();
  client.on('connect', () => {
    console.log('Redis coneected');
    resolve(client);
  });
  client.on('error', (err) => {
    console.error(`Redis error: ${err}`);
  });
});

async function getCode(roomId) {
  return new Promise((resolve, reject) => redisHandler.then(async (client) => {
    await client
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
    client.unref();
  }));
}

async function updateCode(roomId, code) {
  return new Promise((resolve, reject) => redisHandler.then(async (client) => {
    await client
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
    client.unref();
  }));
}

async function roomExistQuery(roomId) {
  return new Promise((resolve) => redisHandler.then(async (client) => {
    const exists = promisify(client.exists).bind(client);
    await resolve(exists(roomId));
    client.unref();
  }));
}

module.exports = { updateCode, getCode, roomExistQuery };
