const { Server } = require('socket.io');
const { queryProjectList, updateProject } = require('./modules/project');

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
      const { projectId, projectName, code, syntax, userId } = socketRes;
      socket.join(projectId);

      updateProject(projectId, { projectName, code, syntax, userId })
        .then(() => {
          io.to(projectId).emit('serverProjectInfoSync', { projectId, projectName, code, syntax });
        })
        .catch((err) => {
          console.log(`Update code error: ${err}`);
        });
    });

    socket.on('clientEnterRoom', (projectId) => {
      console.log(`Client join room: ${projectId} socketId: ${socket.id}`);
      socket.join(projectId);

      queryProjectList({ _id: projectId }).then((projectInfo) => {
        io.to(projectId).emit('serverCodeSync', { projectId, code: projectInfo.code });
      });
    });
  });
};

module.exports = socketExport;
