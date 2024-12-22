import { User } from "../../models/User";

export const userQueries = {
  users: async (_: never) => {
    return await User.find();
  },
  user: async (_: never, { id }: { id: string }) => {
    return await User.findById(id);
  },
};
