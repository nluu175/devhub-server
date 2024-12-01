import { Book } from "../../models/Book";
import { BookInput } from "../../types";

// The underscore _ in this context is a convention used for parameters that we need to include in the function signature (because GraphQL resolvers require it) but won't actually use in the function.

// In GraphQL resolvers, each resolver function receives four parameters in this order:
// function resolver(
//   parent,    // The parent object (result from previous resolver)
//   args,      // Arguments passed to the field
//   context,   // Shared context object (like auth info)
//   info       // Information about the execution state of the query
// )
export const bookMutations = {
  addBook: async (_: never, { input }: { input: BookInput }) => {
    const newBook = await Book.create(input);
    return newBook;
  },
};
