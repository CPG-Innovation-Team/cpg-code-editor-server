const stringRandom = require('string-random');
const { Server } = require('socket.io');
const { queryProjectById, updateProject } = require('./database/project');

const socketExport = {};

async function generateProjectId() {
  const projectId = stringRandom(5);
  const roomExist = await queryProjectById(projectId);

  return new Promise((resolve) => {
    if (roomExist) {
      resolve(generateProjectId());
    } else {
      resolve(projectId);
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
      let { projectId } = socketRes;
      if (!projectId) {
        projectId = await generateProjectId();
        console.log(`Create new room: ${projectId}`);
      }
      socket.join(projectId);

      updateProject(projectId, { code: socketRes.code })
        .then((redisRes) => {
          console.log(`MongoDB update code: ${redisRes}`);
          console.log(`Project: ${projectId} update code: ${socketRes.code}`);
          io.to(projectId).emit('serverCodeSync', {
            projectId,
            code: socketRes.code,
          });
        })
        .catch((err) => {
          console.log(`Update code error: ${err}`);
        });
    });

    socket.on('clientEnterRoom', (projectId) => {
      console.log(`Client join room: ${projectId} socketId: ${socket.id}`);
      socket.join(projectId);

      queryProjectById(projectId)
        .then((projectInfo) => {
          console.log(`MongoDB get code: ${projectInfo.code}`);
          io.to(projectId).emit('serverCodeSync', { projectId, code: projectInfo.code });
        })
        .catch((err) => {
          console.log(`MongoDB get code error: ${err}`);
        });
    });
  });
};

module.exports = socketExport;
