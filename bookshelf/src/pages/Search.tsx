import { useState, useEffect, useMemo } from 'react';
import { getBooks } from '../lib/supabase-books';
import BookCard from '../components/BookCard';
import { Search as SearchIcon } from 'lucide-react';
import type { Book, ReadingStatus } from '../types';

const statusOptions: { value: ReadingStatus | ''; label: string }[] = [
  { value: '', label: '全部' },
  { value: 'want', label: '想读' },
  { value: 'reading', label: '在读' },
  { value: 'read', label: '已读' },
];

export default function Search() {
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | ''>('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'rating'>('date');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredBooks = useMemo(() => {
    let list = [...books];
    if (keyword.trim()) {
      const k = keyword.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(k) ||
          b.author.toLowerCase().includes(k) ||
          b.tags?.some((t) => t.toLowerCase().includes(k))
      );
    }
    if (statusFilter) {
      list = list.filter((b) => b.status === statusFilter);
    }
    list.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
    return list;
  }, [books, keyword, statusFilter, sortBy]);

  return (
    <div className="space-y-8">
      <h1 className="section-title" style={{ fontSize: '28px', marginBottom: 24 }}>搜索书籍</h1>

      <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
        <div className="flex-1" style={{ minWidth: '200px', position: 'relative' }}>
          <SearchIcon size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索书名、作者、标签..."
            className="input"
            style={{ paddingLeft: 48 }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ReadingStatus | '')}
          className="input"
          style={{ width: 'auto', minWidth: '100px' }}
        >
          {statusOptions.map(({ value, label }) => (
            <option key={value || 'all'} value={value}>{label}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'rating')}
          className="input"
          style={{ width: 'auto', minWidth: '100px' }}
        >
          <option value="date">按时间</option>
          <option value="title">按书名</option>
          <option value="rating">按评分</option>
        </select>
      </div>

      {loading ? (
        <div className="card card-lg p-8 text-center">
          <p className="text-muted">加载中...</p>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid-5">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="card card-lg p-8 text-center">
          <SearchIcon size={64} className="empty-state-icon" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p className="text-muted">未找到匹配的书籍</p>
        </div>
      )}
    </div>
  );
}
