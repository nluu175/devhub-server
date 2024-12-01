"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookResolvers = void 0;
const books_js_1 = require("../data/books.js");
exports.bookResolvers = {
    Query: {
        books: () => books_js_1.books,
        book: (_, { id }) => {
            const book = books_js_1.books.find((b) => b.id === id);
            if (!book) {
                throw new Error("Book not found");
            }
            return book;
        },
    },
    Mutation: {
        addBook: (_, { input }) => {
            const newBook = {
                id: String(books_js_1.books.length + 1),
                ...input,
            };
            books_js_1.books.push(newBook);
            return newBook;
        },
        updateBook: (_, { id, input }) => {
            const index = books_js_1.books.findIndex((b) => b.id === id);
            if (index === -1) {
                throw new Error("Book not found");
            }
            const updatedBook = {
                ...books_js_1.books[index],
                ...input,
            };
            books_js_1.books[index] = updatedBook;
            return updatedBook;
        },
        deleteBook: (_, { id }) => {
            const index = books_js_1.books.findIndex((b) => b.id === id);
            if (index === -1) {
                throw new Error("Book not found");
            }
            books_js_1.books.splice(index, 1);
            return true;
        },
    },
};
