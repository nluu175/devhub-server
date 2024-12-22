export interface User {
  username: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
}
