const { queryProjectList, createProject, updateProject, removeProject } = require('../modules/project');
const { createUser, updateUser } = require('../modules/user');

const resolver = {
  project: async (args) => {
    const result = await queryProjectList(args);
    return result;
  },
  createProject: async ({ userId, projectName, syntax }) => {
    const result = await createProject(userId, projectName, syntax);
    return result;
  },
  updateProject: async ({ id, isTop }) => {
    const result = await updateProject(id, { isTop });
    return result;
  },
  removeProject: async ({ id }) => {
    const result = await removeProject(id);
    return result;
  },
  createUser: async ({ userName, avatar }) => {
    const result = await createUser(userName, avatar);
    return result;
  },
  updateUser: async ({ id, userName, avatar }) => {
    const result = await updateUser(id, userName, avatar);
    return result;
  },
};

module.exports = resolver;
