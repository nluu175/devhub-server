import mongoose, { Document, Schema } from "mongoose";
import logger from "../config/logger";

enum ResourceType {
  TUTORIAL = "TUTORIAL",
  TOOL = "TOOL",
  LIBRARY = "LIBRARY",
  ARTICLE = "ARTICLE",
}

interface IResource extends Document {
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  tags: string[];
  submittedById: mongoose.Types.ObjectId;
  votes: number;
  averageRating: number;
  // handled by `timestamps: true`
  createdAt: Date;
  updatedAt: Date;
}

// interface IResourceDocument extends IResource, Document {}

const resourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
      validate: {
        validator: (v: string) => {
          try {
            new URL(v);
            return true;
          } catch (e) {
            return false;
          }
        },
        message: "Please enter a valid URL",
      },
    },
    type: {
      type: String,
      enum: Object.values(ResourceType), // Use enum values instead of enum type
      required: [true, "Resource type is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    submittedById: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Resource must have an author"],
    },
    votes: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot be more than 5"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
resourceSchema.index({ title: "text", description: "text" });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ type: 1 });
resourceSchema.index({ createdAt: -1 });

export const Resource = mongoose.model<IResource>("Resource", resourceSchema);
