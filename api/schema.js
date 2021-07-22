const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    project(_id: String, hash: String): [Project]
  }

  type Mutation {
    createProject(projectName: String, syntax: String): InsertResult
  }

  type Project {
    _id: ID
    hash: String
    projectName: String
    code: String
    createTime: Float
    updateTime: Float
    syntax: String
  }

  type InsertResult {
    success: Boolean
    data: [Project]
  }
`);

module.exports = schema;
