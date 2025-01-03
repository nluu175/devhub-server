import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { expressMiddleware } from "@apollo/server/express4";

import { createGraphqlServer } from "./config/apollo";
import { connectDB } from "./config/db";
import logger from "./config/logger";

import { createGraphContext } from "./middleware/graphContext";
import { httpLogger } from "./middleware/httpLogger";

import { apiRoutes } from "./routes/api";
import { requestTimer } from "./middleware/performanceWatch";

const app = express();
let server;

async function startServer() {
  try {
    await connectDB();

    server = createGraphqlServer();
    await server.start();

    // Middlewares
    app.use(
      cors({
        origin: ["https://studio.apollographql.com", "http://localhost:4000"],
        credentials: true,
        methods: ["GET", "POST", "OPTIONS"],
      })
    );

    app.use(bodyParser.json());
    app.use(httpLogger);

    // REST
    app.use("/api", apiRoutes);

    app.use(
      "/graphql",
      cors({
        origin: "*",
        credentials: false,
        methods: ["POST", "GET", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
      requestTimer,
      bodyParser.json({ limit: "50mb" }),
      expressMiddleware(server, {
        context: createGraphContext,
      })
    );

    const PORT = process.env.PORT || 4000;
    const httpServer = app.listen(PORT, () => {
      logger.info(`Server ready at http://localhost:${PORT}`);
      logger.info(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });

    httpServer.timeout = 30000;
    httpServer.keepAliveTimeout = 35000;
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled Rejection:", error);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received. Shutting down gracefully...");
  process.exit(0);
});

startServer();
