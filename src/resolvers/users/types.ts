export interface AddUserInput {
  username: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
