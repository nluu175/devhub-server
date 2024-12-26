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

  input LoginInput {
    email: String!
    password: String!
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

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    addUser(input: UserInput!): User
  }
`;

export const authTypeDefs = `#graphql
  ${baseTypeDefs}

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
