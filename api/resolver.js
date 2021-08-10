const { queryProjectList, createProject, updateProject, removeProject } = require('../modules/project');
const { createUser, updateUser } = require('../modules/user');

const resolver = {
  project: async (args) => queryProjectList(args),
  createProject: async ({ userId, projectName, syntax }) => createProject(userId, projectName, syntax),
  updateProject: async ({ id, isTop }) => updateProject(id, { isTop }),
  removeProject: async ({ id }) => removeProject(id),
  createUser: async ({ userName, avatar }) => createUser(userName, avatar),
  updateUser: async ({ id, userName, avatar }) => updateUser(id, userName, avatar),
};

module.exports = resolver;
