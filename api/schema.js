const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    project(_id: String, hash: String): [Project]
  }

  type Mutation {
    createProject(userId: String!, projectName: String!, syntax: String!): handleProjectResult
    updateProject(id: String!, isTop: Boolean): handleProjectResult
    removeProject(id: String!): handleProjectResult
    createUser(userName: String!, avatar: String!): handleUserResult
    updateUser(id: String!, userName: String, avatar: String): handleUserResult
  }

  type Project {
    _id: ID!
    hash: String!
    projectName: String!
    code: String
    createTime: Float!
    updateTime: Float
    syntax: String!
    createUser: String
    lastModifiedUser: String
    isTop: Boolean
    editInfo: [ProjectEditInfo]
  }

  type ProjectEditInfo {
    userId: ID
    userName: String
    avatar: String
    isOnline: Boolean
    isEditing: Boolean
  }

  type handleProjectResult {
    success: Boolean!
    data: [Project]
  }

  type handleUserResult {
    success: Boolean!
    userId: ID
  }
`);

module.exports = schema;
