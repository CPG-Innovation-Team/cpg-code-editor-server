const { queryProjectList } = require('../database/project');

const resolver = {
  project: async ({ id }) => {
    const result = await queryProjectList(id);
    return result;
  },
};

module.exports = resolver;
