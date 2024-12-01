// src/config/environment.ts
import dotenv from "dotenv";
import path from "path";

const environment = process.env.NODE_ENV || "development";

// cwd() gets the current working directory
// resolve() combines these parts to create a full path to your env file
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${environment}`),
});

export const config = {
  env: environment,
  isDevelopment: environment === "development",
  isProduction: environment === "production",
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/devhub",
};
