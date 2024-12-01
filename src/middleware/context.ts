import { Request } from "express";
import { Context } from "../types/index";

export const createContext = async ({
  req,
}: {
  req: Request;
}): Promise<Context> => ({
  token: req.headers.authorization,
});
