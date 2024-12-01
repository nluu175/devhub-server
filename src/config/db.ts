// src/config/db.ts
import mongoose from "mongoose";
import { config } from "./environment";

export async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log(`📦 Connected to MongoDB (${config.env} environment)`);

    // Add more logging in development
    if (config.isDevelopment) {
      mongoose.set("debug", true);
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
