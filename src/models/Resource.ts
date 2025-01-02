import mongoose, { Document, Schema } from "mongoose";

// reference: https://github.com/markdown-it/markdown-it
import MarkdownIt from "markdown-it";
import removeMd from "remove-markdown";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

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
  content: string; // currently considering markdown as a datatype
  excerpt?: string; // preview of the content; auto-generated
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
      // TODO:
      // Consider using this for markdown validation
      // https://github.com/markdown-it/markdown-it
      maxlength: [100000, "Content too long"],
      validate: {
        validator: (s: string) => {
          const md = new MarkdownIt();
          try {
            md.render(s);
            return true;
          } catch {
            return false;
          }
        },
        message: "Invalid Markdown content",
      },
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
      enum: Object.values(ArticleType),
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

resourceSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const window = new JSDOM("").window;
    const domPurify = DOMPurify(window);
    this.content = domPurify.sanitize(this.content);
  }
  next();
});

// TODO: Handle the case where first 200 chars has other format (aka Markdown)
resourceSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    // Generate a plain-text excerpt
    // reference: https://www.npmjs.com/package/remove-markdown
    const plainTextContent = removeMd(this.content);
    this.excerpt = plainTextContent.slice(0, 200).trim() + "...";
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
