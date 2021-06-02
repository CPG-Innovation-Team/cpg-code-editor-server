const stringRandom = require('string-random');
const { Server } = require('socket.io');
const { getCode, updateCode, roomExistQuery } = require('./redis');

const socketExport = {};

async function generateRoomId() {
  const roomId = stringRandom(5);
  const roomExist = await roomExistQuery(roomId);

  return new Promise((resolve) => {
    if (roomExist) {
      resolve(generateRoomId());
    } else {
      resolve(roomId);
    }
  });
}

socketExport.getSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // Only for debug
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected, socketId: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`User disconnected, socketId: ${socket.id}`);
    });

    socket.on('clientUploadCode', async (socketRes) => {
      let { roomId } = socketRes;
      if (!roomId) {
        roomId = await generateRoomId();
        console.log(`Create new room: ${roomId}`);
      }
      socket.join(roomId);

      updateCode(roomId, socketRes.code)
        .then((redisRes) => {
          console.log(`Redis update code: ${redisRes}`);
          console.log(`Room: ${roomId} update code: ${socketRes.code}`);
          io.to(roomId).emit('serverCodeSync', {
            roomId,
            code: socketRes.code,
          });
        })
        .catch((err) => {
          console.log(`Update code error: ${err}`);
        });
    });

    socket.on('clientEnterRoom', (roomId) => {
      console.log(`Client join room: ${roomId} socketId: ${socket.id}`);
      socket.join(roomId);

      getCode(roomId)
        .then((code) => {
          console.log(`Redis get code: ${code}`);
          io.to(roomId).emit('serverCodeSync', { roomId, code });
        })
        .catch((err) => {
          console.log(`Redis get code error: ${err}`);
        });
    });
  });
};

module.exports = socketExport;
