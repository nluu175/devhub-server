import { Request } from "express";

// Add Context interface
export interface Context {
  token?: string;
  // Add more context properties as needed
  // user?: {
  //   id: string;
  //   email: string;
  //   roles: string[];
  // };
  // isAuthenticated: boolean;
}

export const createContext = async ({
  req,
}: {
  req: Request;
}): Promise<Context> => ({
  token: req.headers.authorization,
});
