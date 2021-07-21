const { queryProjectList, createProject } = require('../database/project');

const resolver = {
  project: async ({ id }) => {
    const result = await queryProjectList(id);
    return result;
  },
  createProject: async ({ projectId, projectName, syntax }) => {
    const result = await createProject(projectId, projectName, syntax);
    return result;
  },
};

module.exports = resolver;
