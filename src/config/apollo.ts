import { ApolloServer } from "@apollo/server";
import { GraphQLError, GraphQLFormattedError } from "graphql";

import logger from "./logger";

import { typeDefs } from "../schema/typeDefs";
import { mainResolvers } from "../resolvers";

import { ErrorCode } from "../types/error-codes";

export const formatError = (formattedError: GraphQLFormattedError) => {
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
      code: formattedError.extensions?.code || ErrorCode.INTERNAL_SERVER_ERROR,
      path: formattedError.path,
    },
  });
};

export const createGraphqlServer = () => {
  return new ApolloServer({
    typeDefs: typeDefs,
    resolvers: mainResolvers,
    introspection: true,
    formatError,
  });
};
