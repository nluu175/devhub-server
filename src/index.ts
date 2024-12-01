// src/index.ts
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";
import { createApolloServer } from "./config/apollo";
import { createContext } from "./middleware/context";
import { apiRoutes } from "./routes/api";
import { connectDB } from "./config/db";

const app = express();
const server = createApolloServer();

async function startServer() {
  try {
    await connectDB();

    await server.start();

    app.use(cors());
    app.use(bodyParser.json());

    app.use("/api", apiRoutes);

    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: createContext,
      })
    );

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
      console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
