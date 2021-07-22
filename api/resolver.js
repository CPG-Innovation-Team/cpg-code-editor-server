const { queryProjectList, createProject } = require('../database/project');

const resolver = {
  project: async ({ ...args }) => {
    const result = await queryProjectList({ ...args });
    return result;
  },
  createProject: async ({ projectId, projectName, syntax }) => {
    const result = await createProject(projectId, projectName, syntax);
    return result;
  },
};

module.exports = resolver;
