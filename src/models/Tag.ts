import mongoose, { Document, Schema } from "mongoose";
import logger from "../config/logger";

interface ITag extends Document {
  name: string;
  tagsCount: number; // Number of resources using this tag
}
