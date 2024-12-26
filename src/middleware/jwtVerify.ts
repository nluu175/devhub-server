import { Request, Response, NextFunction } from "express";
import { GraphQLError } from "graphql";

import jwt from "jsonwebtoken";

import logger from "../config/logger";

import { ErrorCode } from "../types/error-codes";

interface JwtPayload {
  userId: string;
}

// interface CustomRequest extends Request {
//   user?: {
//     userId: string;
//   };
// }

// NOTE: Example of Header:
// Authorization: Bearer [token]
export const verifyToken = (
  req: Request,
  // req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new GraphQLError("Authorization header missing", {
        extensions: { code: ErrorCode.UNAUTHENTICATED },
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new GraphQLError("Token not provided", {
        extensions: { code: ErrorCode.UNAUTHENTICATED },
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "temporary-key"
    ) as JwtPayload;

    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    logger.error("Token verification failed:", error);
    throw new GraphQLError("Invalid or expired token", {
      extensions: { code: ErrorCode.UNAUTHENTICATED },
    });
  }
};
