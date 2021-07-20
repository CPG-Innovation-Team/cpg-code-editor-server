const { queryProjectList } = require('../mongodb');

const resolver = {
  projectList: async () => {
    const result = await queryProjectList();
    return result;
  },
};

module.exports = resolver;
