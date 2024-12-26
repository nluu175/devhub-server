import mongoose, { Document, Schema } from "mongoose";
import logger from "../config/logger";

enum RatingScore {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

interface IRating extends Document {
  resourceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  score: RatingScore;
  createdAt: Date;
}
