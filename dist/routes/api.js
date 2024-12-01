"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = void 0;
const express_1 = require("express");
const books_js_1 = require("../data/books.js");
const router = (0, express_1.Router)();
router.get("/health", (_, res) => {
    res.json({ status: "ok" });
});
router.get("/books", (_, res) => {
    res.json(books_js_1.books);
});
exports.apiRoutes = router;
