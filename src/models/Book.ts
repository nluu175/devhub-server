import mongoose, { Document } from "mongoose";
import { Book as BookType } from "../types";

export interface BookDocument extends Document, Omit<BookType, "id"> {
  // Add any additional methods or virtual properties here
}

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    publishedYear: Number,
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model<BookDocument>("Book", bookSchema);
