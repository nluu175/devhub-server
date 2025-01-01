// reference: https://graphql-compose.github.io/docs/6.x.x/plugins/plugin-mongoose.html
// https://www.apollographql.com/docs/graphos/schema-design/guides/naming-conventions
import { composeWithMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";

import { GraphContext } from "../middleware/graphContext";

import { User } from "../models/User";
import { Resource } from "../models/Resource";

import { userQueries } from "../resolvers/users/queries";
import { userMutations } from "../resolvers/users/mutations";
import { resourceQueries } from "../resolvers/resources/queries";
import { resourceMutations } from "../resolvers/resources/mutations";

// other required types
import { AddUserInput, LoginInput } from "../resolvers/users/types";
import { ArticleType, AddResourceInput } from "../resolvers/resources/types";
import { scalarTypes, enumTypes, inputTypes } from "./types";

// Mongoose Schema to Type Composer
const UserTC = composeWithMongoose(User);
const ResourceTC = composeWithMongoose(Resource);

// -- Register Scalar Types
Object.entries(scalarTypes).forEach(([name, definition]) => {
  schemaComposer.createScalarTC({ name, ...definition });
});

// -- Register Enum Types
Object.entries(enumTypes).forEach(([name, definition]) => {
  schemaComposer.createEnumTC({ name, ...definition });
});

// -- Register Input Types
Object.entries(inputTypes).forEach(([name, fields]) => {
  schemaComposer.createInputTC({ name, fields });
});

export const resolvers = {
  // --- User Resolver
  users: {
    type: [UserTC],
    resolve: ({ context }: { context: GraphContext }) =>
      userQueries.users(null, {}, context),
  },
  user: {
    type: UserTC,
    args: { id: "String!" },
    resolve: ({
      args,
      context,
    }: {
      args: { id: string };
      context: GraphContext;
    }) => {
      userQueries.user(null, args, context);
    },
  },
  addUser: {
    type: UserTC,
    args: { input: "AddUserInput!" },
    resolve: ({
      args,
      context,
    }: {
      args: { input: AddUserInput };
      context: GraphContext;
    }) => userMutations.addUser(null, args, context),
  },
  loginUser: {
    type: `type LoginResponse { token: String!, user: User! }`,
    args: { input: "LoginInput!" },
    resolve: ({ args }: { args: { input: LoginInput } }) =>
      userMutations.loginUser(null, args),
  },

  // --- Resource Resolver
  resources: {
    type: [ResourceTC],
    resolve: ({ context }: { context: GraphContext }) =>
      resourceQueries.resources(null, {}, context),
  },
  resource: {
    type: ResourceTC,
    args: { id: "String!" },
    resolve: ({
      args,
      context,
    }: {
      args: { id: string };
      context: GraphContext;
    }) => {
      resourceQueries.resource(null, args, context);
    },
  },
  addResource: {
    type: ResourceTC,
    args: { input: "AddResourceInput!" },
    resolve: ({
      args,
      context,
    }: {
      args: { input: AddResourceInput };
      context: GraphContext;
    }) => resourceMutations.addResource(null, args, context),
  },
};

// -- Register Type Composer to Resolvers
Object.entries(resolvers).forEach(([name, resolver]) => {
  ResourceTC.addResolver({ name, ...resolver });
  UserTC.addResolver({ name, ...resolver });
});

schemaComposer.Query.addFields({
  users: UserTC.getResolver("users"),
  user: UserTC.getResolver("user"),
  resources: ResourceTC.getResolver("resources"),
  resource: ResourceTC.getResolver("resource"),
});

schemaComposer.Mutation.addFields({
  addUser: UserTC.getResolver("addUser"),
  loginUser: UserTC.getResolver("loginUser"),
  addResource: ResourceTC.getResolver("addResource"),
});

export const typeDefs = schemaComposer.buildSchema();
