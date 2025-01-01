export const typeDefs = `#graphql
  enum ArticleType {
    TUTORIAL
    TOOL
    LIBRARY
    ARTICLE
  }

  type User {
    id: ID!
    username: String!
    email: String!
    bio: String
    avatar: String
    createdAt: String
    updatedAt: String
  }

  type Resource {
    id: ID!
    title: String!
    description: String!
    content: String!
    excerpt: String
    url: String!
    articleType: ArticleType!
    tags: [String]!
    submittedById: ID!
    votes: Int!
    averageRating: Float!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input AddUserInput {
    username: String!
    email: String!
    password: String!
    bio: String
    avatar: String
  }

  input UpdateUserInput {
    username: String
    email: String
    password: String
    bio: String
    avatar: String
  }

  input AddResourceInput {
    title: String!
    description: String!
    content: String!
    url: String!
    articleType: ArticleType!
    tags: [String]!
    submittedById: ID!
    votes: Int!
    averageRating: Float!
  }


  input UpdateResourceInput {
    title: String
    description: String
    content: String
    url: String
    articleType: ArticleType
    tags: [String]
    submittedById: ID
    votes: Int
    averageRating: Float
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    resources: [Resource]
    resource(id: ID!): Resource
  }

  type Mutation {
    addUser(input: AddUserInput!): User
    addResource(input: AddResourceInput!): Resource
    loginUser(input: LoginInput!): AuthPayload!
  }
`;
