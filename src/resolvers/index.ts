import { userResolvers } from "./users";
import { resourceResolvers } from "./resources";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...resourceResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...resourceResolvers.Mutation,
  },
};
