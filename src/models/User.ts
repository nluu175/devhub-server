import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUser {
  // core
  username: string;
  email: string;
  password: string;
  // optional??
  bio?: string;
  avatar?: string;
  // handled by timestamps
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
        const { compare } = await import("bcryptjs");
        return compare(candidatePassword, this.password);
      },
    },
    toJSON: {
      transform: (_, ret) => {
        delete ret.password; // Remove password from JSON responses
        return ret;
      },
    },
  }
);

// Index
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// userSchema.methods.comparePassword = async function (
//   candidatePassword: string
// ) {
//   const { compare } = await import("bcryptjs");
//   return compare(candidatePassword, this.password);
// };

export const User = mongoose.model<IUserDocument>("User", userSchema);
