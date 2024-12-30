import mongoose, { Document, Schema } from "mongoose";
import logger from "../config/logger";

enum ArticleType {
  TUTORIAL = "TUTORIAL",
  TOOL = "TOOL",
  LIBRARY = "LIBRARY",
  ARTICLE = "ARTICLE",
}

// TODO:
// Currently considering 2 types of resource.
// - article written on this platform
// - url from other resource
interface IResource extends Document {
  title: string;
  description: string;
  content: string;
  excerpt?: string; // preview of the content
  url: string; // link to other resource?
  articleType: ArticleType;
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
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    excerpt: {
      type: String,
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
    articleType: {
      type: String,
      enum: Object.values(ArticleType), // Use enum values instead of enum type
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

// TODO: Handle the case where first 200 chars has other format?
resourceSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    // Generate excerpt from content (first 200 characters)
    this.excerpt = this.content.slice(0, 200).trim() + "...";
  }
  next();
});

resourceSchema.index(
  { title: "text", description: "text", content: "text" },
  {
    weights: {
      // Title matches are most important
      // Description matches are second
      // Content matches are third
      title: 10,
      description: 5,
      content: 1,
    },
  }
);
resourceSchema.index({ tags: 1 });
resourceSchema.index({ type: 1 });
resourceSchema.index({ createdAt: -1 });

export const Resource = mongoose.model<IResource>("Resource", resourceSchema);
