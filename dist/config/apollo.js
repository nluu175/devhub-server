"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApolloServer = void 0;
const server_1 = require("@apollo/server");
const typeDefs_js_1 = require("../schema/typeDefs.js");
const bookResolvers_js_1 = require("../resolvers/bookResolvers.js");
const createApolloServer = () => new server_1.ApolloServer({
    typeDefs: typeDefs_js_1.typeDefs,
    resolvers: bookResolvers_js_1.bookResolvers,
});
exports.createApolloServer = createApolloServer;
