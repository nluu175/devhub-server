import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";
import { createApolloServer } from "./config/apollo";
import { createContext } from "./middleware/context";
import { apiRoutes } from "./routes/api";
import { connectDB } from "./config/db";
import { httpLogger } from "./middleware/httpLogger";
import logger from "./config/logger";

const app = express();
const server = createApolloServer();

async function startServer() {
  try {
    await connectDB();
    await server.start();

    // Middlewares
    app.use(cors());

    // What it does:

    // - Looks at requests with Content-Type: application/json
    // - Takes the raw JSON data from the request body
    // - Parses it into a JavaScript object
    // - Puts that object on req.body
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
      cors<cors.CorsRequest>(), // Enable CORS specifically for GraphQL
      bodyParser.json(), // Parse JSON requests
      expressMiddleware(server, {
        context: createContext,
      })
    );

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      logger.info(`Server ready at http://localhost:${PORT}`);
      logger.info(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled Rejection:", error);
  process.exit(1);
});

// Handle server shutdowns
process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received. Shutting down gracefully...");
  process.exit(0);
});

startServer();
