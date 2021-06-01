const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient();

const hget = promisify(client.hget).bind(client);
const hmset = promisify(client.hmset).bind(client);
const exists = promisify(client.exists).bind(client);

client.on('error', function (err) {
  console.error('Redis error: ' + err);
});

async function getCode(roomId) {
  return await hget(roomId, 'code');
}

async function updateCode(roomId, code) {
  return await hmset(roomId, ['code', code, 'updateTime', Date.now()]);
}

async function roomExistQuery(roomId) {
  return await exists(roomId);
}

module.exports = { updateCode, getCode, roomExistQuery };
