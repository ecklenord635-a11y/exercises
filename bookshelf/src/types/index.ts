export type ReadingStatus = 'want' | 'reading' | 'read';

export interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  isbn?: string;
  publisher?: string;
  publishDate?: string;
  status: ReadingStatus;
  rating?: number;
  progress?: number;
  totalPages?: number;
  startDate?: string;
  finishDate?: string;
  review?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
