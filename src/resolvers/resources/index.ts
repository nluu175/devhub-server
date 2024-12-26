import { resourceQueries } from "./queries";
import { resourceMutations } from "./mutations";

export const userResolvers = {
  Query: resourceQueries,
  Mutation: resourceMutations,
};
