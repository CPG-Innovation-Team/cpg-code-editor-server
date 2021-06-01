const redis = require('redis');
const client = redis.createClient();

client.on('error', function (err) {
  console.error('Redis error: ' + err);
});

function updateCode(roomId, code, callback) {
  client.hmset(roomId, ['code', code, 'updateTime', Date.now()], (err, res) => {
    callback(err, res);
  });
}

function getCode(roomId, callback) {
  client.hget(roomId, 'code', (err, res) => {
    callback(err, res);
  });
}

module.exports = { updateCode, getCode };
