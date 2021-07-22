const { queryProjectList, createProject } = require('../modules/project');

const resolver = {
  project: async (args) => {
    const result = await queryProjectList(args);
    return result;
  },
  createProject: async ({ projectName, syntax }) => {
    const result = await createProject(projectName, syntax);
    return result;
  },
};

module.exports = resolver;
