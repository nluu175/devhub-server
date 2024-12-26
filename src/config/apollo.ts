import { ApolloServer } from "@apollo/server";
import { GraphQLError } from "graphql";

import logger from "./logger";

import { mainTypeDefs, authTypeDefs } from "../schema/typeDefs";
import { mainResolvers, authResolvers } from "../resolvers";

export const createGraphqlServer = () => {
  return new ApolloServer({
    typeDefs: mainTypeDefs,
    resolvers: mainResolvers,
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

export const createAuthGraphqlServer = () => {
  return new ApolloServer({
    typeDefs: authTypeDefs,
    resolvers: authResolvers,
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
