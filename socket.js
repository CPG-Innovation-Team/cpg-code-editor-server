const { Server } = require('socket.io');
const { saveClientProjectUpdateAndEmit, clientEnterProject, clientOffline } = require('./modules/project');

const socketExport = {};

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
      io.emit('userDisconnected');
      clientOffline(socket.id);
    });

    socket.on('clientUpdateProjectInfo', async (socketRes) => {
      socket.join(socketRes.projectId);
      const emitObject = await saveClientProjectUpdateAndEmit(socketRes);
      if (emitObject) {
        io.to(socketRes.projectId).emit('serverProjectInfoSync', emitObject);
      }
    });

    socket.on('clientUpdateProjectCode', async (socketRes) => {
      socket.join(socketRes.projectId);
      console.log(socketRes);
      io.to(socketRes.projectId).emit('serverProjectCodeSync', socketRes);
    });

    socket.on('clientEnterProject', async (projectId, userId) => {
      socket.join(projectId);

      const emitObject = await clientEnterProject(projectId, userId, socket.id);
      io.to(projectId).emit('serverProjectInfoSync', emitObject);
    });
  });
};

module.exports = socketExport;
