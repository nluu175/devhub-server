export const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String!
    author: String!
    publishedYear: Int
  }

  input BookInput {
    title: String!
    author: String!
    publishedYear: Int
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    addBook(input: BookInput!): Book!
    updateBook(id: ID!, input: BookInput!): Book!
    deleteBook(id: ID!): Boolean!
  }
`;
