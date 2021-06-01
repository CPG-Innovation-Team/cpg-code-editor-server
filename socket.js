const stringRandom = require('string-random');
const { getCode, updateCode, roomExistQuery } = require('./redis');
const { Server } = require('socket.io');

const socketExport = {};

async function generateRoomId() {
  let roomId = stringRandom(5);
  const roomExist = await roomExistQuery(roomId);

  return new Promise((resolve) => {
    if (roomExist) {
      resolve(generateRoomId());
    } else {
      resolve(roomId);
    }
  });
}

socketExport.getSocketIO = function (server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // Only for debug
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('user connected, socketId: ' + socket.id);
    socket.on('disconnect', () => {
      console.log('user disconnected, socketId: ' + socket.id);
    });

    socket.on('clientUploadCode', async (socketRes) => {
      let roomId = socketRes.roomId;
      if (!roomId) {
        roomId = await generateRoomId();
        console.log('create new room: ' + roomId);
      }
      socket.join(roomId);

      updateCode(roomId, socketRes.code)
        .then((redisRes) => {
          console.log('redis update code: ' + redisRes);
          console.log('room: ' + roomId + ' update code: ' + socketRes.code);
          io.to(roomId).emit('serverCodeSync', {
            roomId,
            code: socketRes.code,
          });
        })
        .catch((err) => {
          console.log('update code error:' + err);
        });
    });

    socket.on('clientEnterRoom', (roomId) => {
      console.log('client join room: ' + roomId + ' socketId: ' + socket.id);
      socket.join(roomId);

      getCode(roomId)
        .then((code) => {
          console.log('redis get code: ' + code);
          io.to(roomId).emit('serverCodeSync', { roomId, code });
        })
        .catch((err) => {
          console.log('get code error: ' + err);
        });
    });
  });
};

module.exports = socketExport;
