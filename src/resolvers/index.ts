import { userResolvers } from "./users";
import { resourceResolvers } from "./resources";

export const mainResolvers = {
  Query: {
    ...userResolvers.Query,
    ...resourceResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...resourceResolvers.Mutation,
  },
};
