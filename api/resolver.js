const { queryProjectList } = require('../database/project');

const resolver = {
  projectList: async () => {
    const result = await queryProjectList();
    return result;
  },
};

module.exports = resolver;
