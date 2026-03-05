import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Book } from '../types';

const statusLabels: Record<string, string> = {
  want: '想读',
  reading: '在读',
  read: '已读',
};

const statusBadges: Record<string, string> = {
  want: 'badge badge-want',
  reading: 'badge badge-reading',
  read: 'badge badge-read',
};

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link to={`/book/${book.id}`} className="book-card">
      <div className="book-cover">
        {book.cover ? (
          <img src={book.cover} alt={book.title} />
        ) : (
          <div className="book-cover-placeholder">{book.title.charAt(0)}</div>
        )}
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <div className="book-meta">
          <span className={statusBadges[book.status]}>{statusLabels[book.status]}</span>
          {book.rating !== undefined && book.rating > 0 && (
            <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-accent)' }}>
              <Star size={14} fill="currentColor" />
              {book.rating}
            </span>
          )}
        </div>
        {book.progress !== undefined && book.status === 'reading' && (
          <div className="mt-2">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${book.progress}%` }} />
            </div>
            <p className="text-sm text-muted mt-1">{book.progress}% 已读</p>
          </div>
        )}
      </div>
    </Link>
  );
}
