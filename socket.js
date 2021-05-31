const stringRandom = require('string-random');
const { Server } = require('socket.io');

const socketExport = {};
const roomObj = {};

function generateRoomId() {
  let roomId = stringRandom(5);
  if (roomObj[roomId]) {
    roomId = generateRoomId();
  }
  return roomId;
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

    socket.on('clientUploadCode', (res) => {
      let roomId = res.roomId;
      if (!roomId) {
        roomId = generateRoomId();
      }
      socket.join(roomId);
      roomObj[roomId] = res.code;
      console.log('room: ' + roomId + ' update code: ' + res.code);
      io.to(roomId).emit('serverCodeSync', { roomId, code: res.code });
    });

    socket.on('clientEnterRoom', (roomId) => {
      console.log('client join room: ' + roomId + ' socketId: ' + socket.id);
      socket.join(roomId);
      io.to(roomId).emit('serverCodeSync', { roomId, code: roomObj[roomId] });
    });
  });
};

module.exports = socketExport;
