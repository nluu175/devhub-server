import mongoose from "mongoose";

export enum ArticleType {
  TUTORIAL = "TUTORIAL",
  TOOL = "TOOL",
  LIBRARY = "LIBRARY",
  ARTICLE = "ARTICLE",
}

export interface AddResourceInput {
  title: string;
  description: string;
  content: string;
  url: string;
  articleType: ArticleType;
  tags: string[];
  submittedById: mongoose.Types.ObjectId;
  votes: number;
  averageRating: number;
}

export interface UpdateResourceInput {
  title?: string;
  description?: string;
  content?: string;
  excerpt?: string;
  url?: string;
  articleType?: ArticleType;
  tags?: string[];
  submittedById?: mongoose.Types.ObjectId;
  votes?: number;
  averageRating?: number;
}
