import { userResolvers } from "./users";

export const mainResolvers = {
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    addUser: userResolvers.Mutation.addUser,
  },
};

export const authResolvers = {
  Query: {},
  Mutation: {
    login: userResolvers.Mutation.login,
  },
};
