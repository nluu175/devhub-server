export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    bio: String
    avatar: String
    createdAt: String
    updatedAt: String
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
    bio: String
    avatar: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    addUser(input: UserInput!): User
  }
`;
