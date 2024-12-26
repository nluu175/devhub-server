const baseTypeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    bio: String
    avatar: String
    createdAt: String
    updatedAt: String
  }

  enum ResourceType {
    TUTORIAL
    TOOL
    LIBRARY
    ARTICLE
  }

  type Resource {
    id: ID!
    title: String!
    description: String!
    url: String!
    type: ResourceType!
    tags: [String]!
    submittedById: ID!
    votes: Int!
    averageRating: Float!
    createdAt: String!
    updatedAt: String!
  }
`;

export const mainTypeDefs = `#graphql
  ${baseTypeDefs}

  input UserInput {
    username: String!
    email: String!
    password: String!
    bio: String
    avatar: String
  }

  input ResourceInput {
    title: String!
    description: String!
    url: String!
    type: ResourceType!
    tags: [String]
    submittedById: ID!
    votes: Int
    averageRating: Float
  }

  type Query {
    users: [User]
    user(id: ID!): User
    resources: [Resource]
    resource(id: ID!): Resource
  }

  type Mutation {
    addUser(input: UserInput!): User
    addResource(input: ResourceInput!): Resource
  }
`;

export const authTypeDefs = `#graphql
  ${baseTypeDefs}

  input LoginInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    _empty: String
  }

  type Mutation {
    login(input: LoginInput!): AuthPayload!
  }
`;
