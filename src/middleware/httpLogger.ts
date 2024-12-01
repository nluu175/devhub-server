import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Skip logging for Apollo health checks
  // These are POST requests to /graphql with no query
  if (
    req.path === "/graphql" &&
    req.method === "POST" &&
    (!req.body?.query || req.body.query.includes("IntrospectionQuery"))
  ) {
    return;
  }

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.http(
      `${req.method} ${req.url} ${res.statusCode} - ${duration}ms | IP: ${req.ip}`
    );
  });

  next();
};
