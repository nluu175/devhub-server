export interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear?: number;
}

export interface Context {
  token?: string;
}
