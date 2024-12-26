import mongoose from "mongoose";

// TODO: move this to a shared location
enum ResourceType {
  TUTORIAL = "TUTORIAL",
  TOOL = "TOOL",
  LIBRARY = "LIBRARY",
  ARTICLE = "ARTICLE",
}

export interface AddResourceInput {
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  tags: string[];
  submittedById: string;
  votes: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}
