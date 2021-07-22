const { queryProjectList, createProject } = require('../modules/project');
const { createUser } = require('../modules/user');

const resolver = {
  project: async (args) => {
    const result = await queryProjectList(args);
    return result;
  },
  createProject: async ({ projectName, syntax }) => {
    const result = await createProject(projectName, syntax);
    return result;
  },
  createUser: async ({ userName, avatar }) => {
    const result = await createUser(userName, avatar);
    return result;
  },
};

module.exports = resolver;