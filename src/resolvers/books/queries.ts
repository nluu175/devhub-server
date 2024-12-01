import { Book } from "../../types/index";
import { books } from "../../data/books";

export const bookQueries = {
  books: () => books,
  book: (_: any, { id }: { id: string }) => {
    const book = books.find((b) => b.id === id);
    if (!book) {
      throw new Error("Book not found");
    }
    return book;
  },
};
