import logger from "../../config/logger";
import { Resource } from "../../models/Resource";
import { AddResourceInput } from "./types";
import { ErrorCode } from "../../types/error-codes";
import { GraphQLError } from "graphql";

export const resourceMutations = {
  addResource: async (_: never, { input }: { input: AddResourceInput }) => {
    try {
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
