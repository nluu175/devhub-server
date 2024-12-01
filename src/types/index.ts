export interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear?: number;
}

export interface BookInput {
  title: string;
  author: string;
  publishedYear?: number;
}
