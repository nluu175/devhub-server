import { Request } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/User";
import logger from "../config/logger";

export interface GraphContext {
  token?: string;
  user?: IUser;
  isAuthenticated: boolean;
}

export const createGraphContext = async ({
  req,
}: {
  req: Request;
}): Promise<GraphContext> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return {
        isAuthenticated: false,
      };
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "tempsecretkey"
    ) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return {
        token,
        isAuthenticated: false,
      };
    }

    return {
      token,
      user,
      isAuthenticated: true,
    };
  } catch (error) {
    logger.error("Context creation error:", error);
    return {
      isAuthenticated: false,
    };
  }
};
