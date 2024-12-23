import { Request, Response, NextFunction } from "express";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import logger from "../config/logger";

interface JwtPayload {
  userId: string;
}

// interface CustomRequest extends Request {
//   user?: {
//     userId: string;
//   };
// }

// NOTE: Example of Header:
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYxZDVjN2U4ZDY3NjQ0YjY2NmYyMzYiLCJpYXQiOjE3MTA0MDk3MTksImV4cCI6MTcxMDQ5NjExOX0.7rxrF2FD6D3tKuYe4_jNqXZvwB4-9h1TpkrVwj2WUyQ
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
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new GraphQLError("Token not provided", {
        extensions: { code: "UNAUTHENTICATED" },
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
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
};
