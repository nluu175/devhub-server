import { bookQueries } from "./queries";
import { bookMutations } from "./mutations";

export const bookResolvers = {
  Query: bookQueries,
  Mutation: bookMutations,
};
