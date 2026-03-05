import { supabase } from './supabase';
import type { Book } from '../types';

function toBook(row: Record<string, unknown>): Book {
  return {
    id: row.id as string,
    title: row.title as string,
    author: row.author as string,
    cover: row.cover as string | undefined,
    isbn: row.isbn as string | undefined,
    publisher: row.publisher as string | undefined,
    publishDate: row.publish_date as string | undefined,
    status: row.status as Book['status'],
    rating: row.rating as number | undefined,
    progress: row.progress as number | undefined,
    totalPages: row.total_pages as number | undefined,
    startDate: row.start_date as string | undefined,
    finishDate: row.finish_date as string | undefined,
    review: row.review as string | undefined,
    tags: row.tags as string[] | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getBookById(id: string): Promise<Book | null> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return toBook(data);
}

export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toBook);
}

export async function addBook(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('请先登录');

  const { data, error } = await supabase
    .from('books')
    .insert({
      user_id: user.id,
      title: book.title,
      author: book.author,
      cover: book.cover || null,
      isbn: book.isbn || null,
      publisher: book.publisher || null,
      publish_date: book.publishDate || null,
      status: book.status,
      rating: book.rating || null,
      progress: book.progress ?? null,
      total_pages: book.totalPages || null,
      start_date: book.startDate || null,
      finish_date: book.finishDate || null,
      review: book.review || null,
      tags: book.tags || null,
    })
    .select()
    .single();
  if (error) throw error;
  return toBook(data);
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .update({
      title: updates.title,
      author: updates.author,
      cover: updates.cover,
      isbn: updates.isbn,
      publisher: updates.publisher,
      publish_date: updates.publishDate,
      status: updates.status,
      rating: updates.rating,
      progress: updates.progress,
      total_pages: updates.totalPages,
      start_date: updates.startDate,
      finish_date: updates.finishDate,
      review: updates.review,
      tags: updates.tags,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return toBook(data);
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase.from('books').delete().eq('id', id);
  if (error) throw error;
}
