import { Resource } from "../../models/Resource";
import { AddResourceInput } from "./types";
import { ErrorCode } from "../../types/error-codes";
import { GraphQLError } from "graphql";
import logger from "../../config/logger";
import { GraphContext } from "../../middleware/graphContext";

export const resourceMutations = {
  addResource: async (
    _: unknown,
    { input }: { input: AddResourceInput },
    context: GraphContext
  ) => {
    try {
      if (!context.isAuthenticated) {
        throw new GraphQLError("Not authenticated");
      }

      const newResource = await Resource.create(input);
      logger.info(`New resource created: ${newResource.title}`);

      return newResource;
    } catch (error) {
      logger.error("Error creating resource:", error);

      throw new GraphQLError("Failed to create resource", {
        extensions: {
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          error: error instanceof Error ? error.message : String(error),
        },
      });
    }
  },
};
