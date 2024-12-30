import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

import { User } from "../../models/User";
import { AddUserInput, LoginInput } from "./types";
import { ErrorCode } from "../../types/error-codes";
import logger from "../../config/logger";
import { graphContext } from "../../middleware/graphContext";

export const userMutations = {
  addUser: async (
    _: never,
    { input }: { input: AddUserInput },
    context: graphContext
  ) => {
    if (!context.isAuthenticated) {
      throw new GraphQLError("Not authenticated");
    }

    try {
      const newUser = await User.create(input);
      logger.info(`New user created: ${newUser.username}`);

      return newUser;
    } catch (error) {
      logger.error("Error creating user:", error);

      throw new Error("Failed to create user");
    }
  },
  login: async (_: never, { input }: { input: LoginInput }) => {
    try {
      const { email, password } = input;
      logger.info(`Attempting login for email: ${email}`);

      const user = await User.findOne({ email }).exec();

      if (!user) {
        logger.info(`No user found with email: ${email}`);
        throw new GraphQLError("Invalid email or password", {
          extensions: { code: ErrorCode.INVALID_CREDENTIALS },
        });
      }
      logger.info(`User found with email: ${email}`);

      const isValidPassword = await user
        .comparePassword(password)
        .catch((error) => {
          logger.error("Password comparison error:", error);
          throw error;
        });
      logger.info(`Password validation result: ${isValidPassword}`);

      if (!isValidPassword) {
        throw new GraphQLError("Invalid email or password", {
          extensions: { code: ErrorCode.INVALID_CREDENTIALS },
        });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || "tempsecretkey",
        { expiresIn: "24h" }
      );

      return {
        token,
        user,
      };
    } catch (error) {
      logger.error("Login error details:", {
        error: error instanceof Error ? error.stack : String(error),
        input: { email: input.email },
      });

      if (error instanceof GraphQLError) {
        throw error;
      }

      throw new GraphQLError("Failed to login", {
        extensions: {
          code: ErrorCode.INVALID_CREDENTIALS,
          error: error instanceof Error ? error.message : String(error),
        },
      });
    }
  },
};
