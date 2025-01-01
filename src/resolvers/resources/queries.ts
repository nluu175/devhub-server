import { GraphQLError } from "graphql";

import { Resource } from "../../models/Resource";
import { ErrorCode } from "../../types/error-codes";
import logger from "../../config/logger";
import { GraphContext } from "../../middleware/graphContext";

export const resourceQueries = {
  resources: async (_: unknown, args: {}, context: GraphContext) => {
    if (!context.isAuthenticated) {
      throw new GraphQLError("Not authenticated");
    }

    try {
      logger.info("Fetching all resources");
      const resources = await Resource.find().exec();
      logger.info(`Found ${resources.length} resources`);
      return resources;
    } catch (error) {
      logger.error("Error fetching resources:", error);
      throw new GraphQLError("Failed to fetch resources", {
        extensions: {
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          error: error instanceof Error ? error.message : String(error),
        },
      });
    }
  },
  resource: async (
    _: unknown,
    { id }: { id: string },
    context: GraphContext
  ) => {
    if (!context.isAuthenticated) {
      throw new GraphQLError("Not authenticated");
    }

    try {
      logger.info(`Fetching resource with ID: ${id}`);
      const resource = await Resource.findById(id).exec();

      if (!resource) {
        throw new GraphQLError("Resource not found", {
          extensions: {
            code: ErrorCode.NOT_FOUND,
            resourceId: id,
          },
        });
      }

      return resource;
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }

      logger.error("Error fetching resource:", error);
      throw new GraphQLError("Failed to fetch resource", {
        extensions: {
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          error: error instanceof Error ? error.message : String(error),
        },
      });
    }
  },
};
