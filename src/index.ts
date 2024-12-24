import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { expressMiddleware } from "@apollo/server/express4";

import { createApolloServer } from "./config/apollo";
import { connectDB } from "./config/db";
import logger from "./config/logger";

import { createContext } from "./middleware/context";
import { httpLogger } from "./middleware/httpLogger";
import { verifyToken } from "./middleware/jwtVerify";

import { apiRoutes } from "./routes/api";

const app = express();
let server;

async function startServer() {
  try {
    await connectDB();

    server = createApolloServer();
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

    // rest
    app.use("/api", apiRoutes);

    // The reason for the hanging:

    // In the original setup, the global middleware might have been interfering with Apollo's middleware
    // Request processing could get stuck between different middleware layers
    // The body parser might have already consumed the request body before Apollo's middleware could process it

    // By applying fresh middleware specifically for the GraphQL route:
    // - Each GraphQL request gets its own clean middleware stack
    // - The request body is properly parsed for Apollo
    // - CORS headers are properly set for GraphQL operations
    // - There's no interference between global and route-specific middleware

    app.use(
      "/graphql",
      cors({
        origin: "*",
        credentials: false,
        methods: ["POST", "GET", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
      (req, res, next) => {
        const start = Date.now();
        res.on("finish", () => {
          const duration = Date.now() - start;
          logger.info(`Request completed in ${duration}ms`);
          if (duration > 5000) {
            logger.warn(`Slow request detected: ${duration}ms`);
          }
        });
        next();
      },
      bodyParser.json({ limit: "50mb" }),
      expressMiddleware(server, {
        context: createContext,
      })
    );

    app.use("/graphql", verifyToken, expressMiddleware(server));

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
