import mongoose from "mongoose";
import { config } from "./environment";
import logger from "./logger";

export async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info(`Connected to MongoDB (${config.env} environment)`);

    if (config.isDevelopment) {
      mongoose.set(
        "debug",
        (collectionName: string, method: string, ...args: any[]) => {
          logger.debug(
            `Mongoose: ${collectionName}.${method}(${JSON.stringify(args)})`
          );
        }
      );
    }
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});
