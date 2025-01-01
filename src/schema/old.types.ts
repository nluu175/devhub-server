// NOTE: Currently need to manually modify this whenever there is a change in type
// NOTE: This file must sync with whatever typescript types we use
// TODO: Should look for a way to auto-sync these types

// Scalar Types
export const scalarTypes = {
  DateTime: {
    serialize: (value: any) =>
      value instanceof Date ? value.toISOString() : value,
    parseValue: (value: any) => new Date(value as string),
    parseLiteral: (ast: any) =>
      ast.kind === "StringValue" ? new Date(ast.value) : null,
  },
};

// EnumType
export const enumTypes = {
  ArticleType: {
    values: {
      TUTORIAL: { value: "TUTORIAL" },
      TOOL: { value: "TOOL" },
      LIBRARY: { value: "LIBRARY" },
      ARTICLE: { value: "ARTICLE" },
    },
  },
};

// Input Types
export const inputTypes = {
  AddUserInput: {
    username: "String!",
    email: "String!",
    password: "String!",
    bio: "String",
    avatar: "String",
  },
  LoginInput: {
    email: "String!",
    password: "String!",
  },
  AddResourceInput: {
    title: "String!",
    description: "String!",
    content: "String!",
    excerpt: "String",
    url: "String!",
    articleType: "ArticleType!",
    tags: "[String!]!",
    submittedById: "MongoID!",
    votes: "Int!",
    averageRating: "Float!",
    createdAt: "DateTime!",
    updatedAt: "DateTime!",
  },
};
