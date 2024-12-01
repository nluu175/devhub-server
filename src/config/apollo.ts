import { ApolloServer } from "@apollo/server";
import { typeDefs } from "../schema/typeDefs";
import { resolvers } from "../resolvers";

export const createApolloServer = () =>
  new ApolloServer({
    typeDefs,
    resolvers,
  });
