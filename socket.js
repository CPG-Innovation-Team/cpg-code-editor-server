const { Server } = require('socket.io');
const { queryProjectList, modifyProjectEditStatus, saveClientProjectUpdateAndEmit } = require('./modules/project');

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
    });

    socket.on('clientUpdateProjectInfo', async (socketRes) => {
      socket.join(socketRes.projectId);

      const emitObject = await saveClientProjectUpdateAndEmit(socketRes);
      if (emitObject) {
        io.to(socketRes.projectId).emit('serverProjectInfoSync', emitObject);
      }
    });

    socket.on('clientEnterProject', (projectId, userId) => {
      socket.join(projectId);

      modifyProjectEditStatus(projectId, userId, { isOnline: true });
      queryProjectList({ _id: projectId }).then((projectInfo) => {
        io.to(projectId).emit('serverProjectInfoSync', {
          projectId,
          code: projectInfo[0].code,
          editUser: {
            userId,
            isOnline: true,
          },
        });
      });
    });
  });
};

module.exports = socketExport;
