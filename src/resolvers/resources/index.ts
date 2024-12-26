import { resourceQueries } from "./queries";
import { resourceMutations } from "./mutations";

export const resourceResolvers = {
  Query: resourceQueries,
  Mutation: resourceMutations,
};
