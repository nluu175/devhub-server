import { Book } from "../../models/Book";

export const bookQueries = {
  books: async (_: never) => {
    return await Book.find();
  },
  book: async (_: never, { id }: { id: string }) => {
    return await Book.findById(id);
  },
};
