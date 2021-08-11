const { Server } = require('socket.io');
const { queryProjectList, updateProject, modifyProjectEditStatus } = require('./modules/project');

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
      const { projectId, projectName, code, syntax, userId, isOnline, isEditing, currectCursor } = socketRes;
      socket.join(projectId);

      if (projectName || code || syntax) {
        await updateProject(projectId, { projectName, code, syntax, userId });
        await modifyProjectEditStatus(projectId, userId, { isEditing: false });
        io.to(projectId).emit('serverProjectInfoSync', { projectId, projectName, code, syntax });
      }

      if (isEditing || currectCursor) {
        await modifyProjectEditStatus(projectId, userId, isOnline, isEditing, currectCursor);
        io.to(projectId).emit('serverProjectInfoSync', { projectId, userId, isOnline, isEditing, currectCursor });
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
