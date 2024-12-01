"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const createContext = async ({ req, }) => ({
    token: req.headers.authorization,
});
exports.createContext = createContext;
