import { User } from "../../models/User";
import { UserInput } from "./types";
import logger from "../../config/logger";

export const userMutations = {
  addUser: async (_: never, { input }: { input: UserInput }) => {
    try {
      const newUser = await User.create(input);

      logger.info(`New user created: ${newUser.username}`);
      return newUser;
    } catch (error) {
      logger.error("Error creating user:", error);

      throw new Error("Failed to create user");
    }
  },
};
