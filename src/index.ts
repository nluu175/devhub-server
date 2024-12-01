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
    app.use(bodyParser.json());
    app.use(httpLogger);

    app.use("/api", apiRoutes);
    app.use(
      "/graphql",
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

startServer();
