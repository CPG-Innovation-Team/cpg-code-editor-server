const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    projectList: [Project]
  }

  type Project {
    id: String
    code: String
    createTime: Float
    updateTime: Float
    syntax: String
  }
`);

module.exports = schema;
