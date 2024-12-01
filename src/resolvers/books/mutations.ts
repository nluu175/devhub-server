import { Book } from "../../types/index";
import { books } from "../../data/books";

export const bookMutations = {
  addBook: (_: any, { input }: { input: Omit<Book, "id"> }) => {
    const newBook: Book = {
      id: String(books.length + 1),
      ...input,
    };
    books.push(newBook);
    return newBook;
  },
  updateBook: (
    _: any,
    { id, input }: { id: string; input: Omit<Book, "id"> }
  ) => {
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error("Book not found");
    }

    const updatedBook = {
      ...books[index],
      ...input,
    };
    books[index] = updatedBook;
    return updatedBook;
  },
  deleteBook: (_: any, { id }: { id: string }) => {
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error("Book not found");
    }

    books.splice(index, 1);
    return true;
  },
};
