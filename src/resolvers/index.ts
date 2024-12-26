import { userResolvers } from "./users";
import { resourceResolvers } from "./resources";

export const mainResolvers = {
  Query: {
    ...userResolvers.Query,
    ...resourceResolvers.Query,
  },
  Mutation: {
    addUser: userResolvers.Mutation.addUser,
    ...resourceResolvers.Mutation,
  },
};

export const authResolvers = {
  Query: {},
  Mutation: {
    login: userResolvers.Mutation.login,
  },
};
