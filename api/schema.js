const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    project(_id: String, hash: String): [Project]
  }

  type Mutation {
    createProject(projectId: String, projectName: String, syntax: String): Project
  }

  type Project {
    _id: String
    hash: String
    projectName: String
    code: String
    createTime: Float
    updateTime: Float
    syntax: String
  }
`);

module.exports = schema;
