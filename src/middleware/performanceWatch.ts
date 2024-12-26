import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export const requestTimer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`Request completed in ${duration}ms`);
    if (duration > 5000) {
      logger.warn(`Slow request detected: ${duration}ms`);
    }
  });
  next();
};
