"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const apollo_1 = require("./config/apollo");
const context_1 = require("./middleware/context");
const api_js_1 = require("./routes/api.js");
const app = (0, express_1.default)();
const server = (0, apollo_1.createApolloServer)();
async function startServer() {
    try {
        await server.start();
        app.use((0, cors_1.default)());
        app.use(body_parser_1.default.json());
        // API Routes
        app.use("/api", api_js_1.apiRoutes);
        // GraphQL Endpoint
        app.use("/graphql", (0, express4_1.expressMiddleware)(server, {
            context: context_1.createContext,
        }));
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`🚀 Server ready at http://localhost:${PORT}`);
            console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
