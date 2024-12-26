import mongoose, { Document, Schema } from "mongoose";
import logger from "../config/logger";

interface IComment extends Document {
  resourceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
