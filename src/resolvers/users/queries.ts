import { GraphQLError } from "graphql";
import { IUser, User } from "../../models/User";
import logger from "../../config/logger";

import { ErrorCode } from "../../types/error-codes";

export const userQueries = {
  users: async (_: never): Promise<IUser[]> => {
    try {
      logger.info("Fetching all users");
      const users = await User.find().exec();
      // const users = await User.find().lean().exec();
      logger.info(`Found ${users.length} users`);
      return users;
    } catch (error) {
      logger.error("Error fetching users:", error);
      throw new GraphQLError("Failed to fetch users", {
        extensions: {
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          error: error instanceof Error ? error.message : String(error),
        },
      });
    }
  },
  user: async (_: never, { id }: { id: string }): Promise<IUser> => {
    try {
      logger.info(`Fetching user with ID: ${id}`);
      const user = await User.findById(id).exec();

      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: {
            code: ErrorCode.NOT_FOUND,
            userId: id,
          },
        });
      }

      return user;
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }

      logger.error("Error fetching user:", error);
      throw new GraphQLError("Failed to fetch user", {
        extensions: {
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          error: error instanceof Error ? error.message : String(error),
        },
      });
    }
  },
};
