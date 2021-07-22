const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    project(_id: String, hash: String): [Project]
  }

  type Mutation {
    createProject(projectName: String, syntax: String): InsertProjectResult
    createUser(userName: String, avatar: String): InsertUserResult
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

  type InsertProjectResult {
    success: Boolean
    data: [Project]
  }

  type InsertUserResult {
    success: Boolean
    userId: ID
  }
`);

module.exports = schema;
