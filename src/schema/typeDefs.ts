export const mainTypeDefs = `#graphql
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

  input LoginInput {
    email: String!
    password: String!
  }

  # type AuthPayload {
  #   token: String!
  #   user: User!
  # }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    addUser(input: UserInput!): User
    # login(input: LoginInput!): AuthPayload!
  }
`;

export const authTypeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    bio: String
    avatar: String
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    _empty: String
  }

  type Mutation {
    login(input: LoginInput!): AuthPayload!
  }
`;
