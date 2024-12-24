import { ApolloServer } from "@apollo/server";
import { GraphQLError } from "graphql";

import logger from "./logger";

import { typeDefs } from "../schema/typeDefs";
import { resolvers } from "../resolvers";

export const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    formatError: (formattedError) => {
      try {
        logger.error("GraphQL Error:", {
          message: formattedError.message,
          locations: formattedError.locations,
          path: formattedError.path,
        });
      } catch (loggingError) {
        console.error("Error while logging:", loggingError);
      }

      return new GraphQLError(formattedError.message, {
        extensions: {
          code: formattedError.extensions?.code || "INTERNAL_SERVER_ERROR",
          path: formattedError.path,
        },
      });
    },
  });
};
