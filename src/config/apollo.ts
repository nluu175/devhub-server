import { ApolloServer } from "@apollo/server";
import { typeDefs } from "../schema/typeDefs";
import { resolvers } from "../resolvers";
import logger from "./logger";

export const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      logger.error("GraphQL Error:", error);
      return error;
    },
  });
};
