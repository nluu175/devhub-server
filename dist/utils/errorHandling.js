"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const graphql_1 = require("graphql");
class NotFoundError extends graphql_1.GraphQLError {
    constructor(message) {
        super(message, {
            extensions: {
                code: "NOT_FOUND",
            },
        });
    }
}
exports.NotFoundError = NotFoundError;
