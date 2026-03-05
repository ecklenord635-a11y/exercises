import { useState, useEffect } from 'react';
import { getBooks } from '../lib/supabase-books';
import BookCard from '../components/BookCard';
import type { Book, ReadingStatus } from '../types';

const shelves: { status: ReadingStatus; label: string }[] = [
  { status: 'want', label: '想读' },
  { status: 'reading', label: '在读' },
  { status: 'read', label: '已读' },
];

export default function Shelf() {
  const [activeShelf, setActiveShelf] = useState<ReadingStatus | 'all'>('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredBooks =
    activeShelf === 'all'
      ? books
      : books.filter((b) => b.status === activeShelf);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title" style={{ fontSize: '28px', marginBottom: 8 }}>我的书架</h1>
        <p className="text-muted mt-1">共 {books.length} 本书</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveShelf('all')}
          className={`btn btn-sm ${activeShelf === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '9999px' }}
        >
          全部
        </button>
        {shelves.map(({ status, label }) => (
          <button
            key={status}
            onClick={() => setActiveShelf(status)}
            className={`btn btn-sm ${activeShelf === status ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '9999px' }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card p-8 text-center">
          <p className="text-muted">加载中...</p>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid-5">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-muted">
            {activeShelf === 'all' ? '还没有添加任何书籍' : `暂无「${shelves.find((s) => s.status === activeShelf)?.label}」的书籍`}
          </p>
        </div>
      )}
    </div>
  );
}
