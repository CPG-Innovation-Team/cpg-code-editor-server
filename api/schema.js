const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    project(id: String): [Project]
  }

  type Mutation {
    createProject(projectId: String, projectName: String, syntax: String): Project
  }

  type Project {
    id: String
    projectName: String
    code: String
    createTime: Float
    updateTime: Float
    syntax: String
  }
`);

module.exports = schema;
