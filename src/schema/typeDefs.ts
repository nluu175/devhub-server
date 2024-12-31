// reference: https://graphql-compose.github.io/docs/6.x.x/plugins/plugin-mongoose.html
// https://www.apollographql.com/docs/graphos/schema-design/guides/naming-conventions
import { composeWithMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";

import { GraphContext } from "../middleware/graphContext";

import { User } from "../models/User";
import { userQueries } from "../resolvers/users/queries";
import { userMutations } from "../resolvers/users/mutations";

import { AddUserInput, LoginInput } from "../resolvers/users/types";

// User Type Composer
const UserTC = composeWithMongoose(User);

// Add custom id field and remove _id
UserTC.addFields({
  id: {
    type: "MongoID",
    resolve: (source) => source._id,
  },
});
// UserTC.removeField("_id");

// Input Types
const inputTypes = {
  AddUserInput: {
    username: "String!",
    email: "String!",
    password: "String!",
    bio: "String",
    avatar: "String",
  },
  LoginInput: {
    email: "String!",
    password: "String!",
  },
};

Object.entries(inputTypes).forEach(([name, fields]) => {
  schemaComposer.createInputTC({ name, fields });
});

const resolvers = {
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
    }) => userQueries.user(null, args, context),
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
};

Object.entries(resolvers).forEach(([name, resolver]) => {
  UserTC.addResolver({ name, ...resolver });
});

schemaComposer.Query.addFields({
  users: UserTC.getResolver("users"),
  user: UserTC.getResolver("user"),
});

schemaComposer.Mutation.addFields({
  addUser: UserTC.getResolver("addUser"),
  loginUser: UserTC.getResolver("loginUser"),
});

export const typeDefs = schemaComposer.buildSchema();
