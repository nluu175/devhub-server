import { bookResolvers } from "./books";

export const resolvers = {
  Query: {
    ...bookResolvers.Query,
  },
  Mutation: {
    ...bookResolvers.Mutation,
  },
};
