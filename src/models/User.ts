import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import logger from "../config/logger";

export interface IUser {
  username: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Document provides built-in MongoDB document methods like save(), update(),
export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// This means:
// - We're creating a new MongoDB schema
// - Documents created with this schema should match the IUserDocument interface
// - TypeScript will enforce this type checking
// "trim" ensures saved strings are properly trimmed
const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    avatar: {
      type: String,
      trim: true,
    },
  },
  {
    // timestamps automatically handle "createdAt" and "updatedAt"
    timestamps: true,
    methods: {
      async comparePassword(candidatePassword: string) {
        try {
          const isMatch = await bcrypt.compare(
            candidatePassword,
            this.password
          );
          return isMatch;
        } catch (error) {
          logger.error("Error comparing passwords:", error);
          throw error;
        }
      },
    },
    toJSON: {
      transform: (_, document) => {
        delete document.password;
        return document;
      },
    },
  }
);

// Index
// TODO: consider this
// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 12);
    }

    // Passes control to the next middleware in the document's save operation
    next();
  } catch (error) {
    logger.error("Error hashing password:", error);
    next();
  }
});

export const User = mongoose.model<IUserDocument>("User", userSchema);
