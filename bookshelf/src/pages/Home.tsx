import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBooks } from '../lib/supabase-books';
import BookCard from '../components/BookCard';
import type { Book } from '../types';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setBooks([]);
      setLoading(false);
      return;
    }
    getBooks()
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const reading = books.filter((b) => b.status === 'reading');
  const recent = [...books].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 6);
  const readCount = books.filter((b) => b.status === 'read').length;

  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="hero-title mx-auto">
          {isAuthenticated ? `你好，${user?.name || user?.email}` : '个人书架'}
        </h1>
        <p className="hero-subtitle mx-auto">
          记录阅读，管理藏书，让每一本书都有归属
        </p>
      </section>

      <section className="grid-3">
        <div className="card">
          <div className="stat-card">
            <div className="stat-icon blue">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-2xl font-semibold">{loading ? '...' : books.length}</p>
              <p className="text-sm text-muted">藏书总数</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="stat-card">
            <div className="stat-icon teal">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-2xl font-semibold">{loading ? '...' : reading.length}</p>
              <p className="text-sm text-muted">正在阅读</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="stat-card">
            <div className="stat-icon green">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-2xl font-semibold">{loading ? '...' : readCount}</p>
              <p className="text-sm text-muted">已读完</p>
            </div>
          </div>
        </div>
      </section>

      {reading.length > 0 && (
        <section>
          <h2 className="section-title">正在阅读</h2>
          <div className="grid-4">
            {reading.slice(0, 3).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">最近添加</h2>
          {isAuthenticated && (
            <Link to="/add" className="link flex items-center gap-2 text-sm">
              <Plus size={16} />
              添加书籍
            </Link>
          )}
        </div>
        {loading ? (
          <div className="card card-lg p-8 text-center">
            <p className="text-muted">加载中...</p>
          </div>
        ) : recent.length > 0 ? (
          <div className="grid-6">
            {recent.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="card card-lg p-8 text-center">
            <BookOpen size={64} className="empty-state-icon" style={{ margin: '0 auto 16px', display: 'block' }} />
            <p className="text-muted mb-6">
              {isAuthenticated ? '还没有添加任何书籍' : '登录后添加你的第一本书'}
            </p>
            {isAuthenticated ? (
              <Link to="/add" className="btn btn-primary inline-flex items-center gap-2" style={{ borderRadius: '9999px', padding: '14px 28px' }}>
                <Plus size={16} />
                添加第一本书
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary inline-flex items-center gap-2" style={{ borderRadius: '9999px', padding: '14px 28px' }}>
                登录
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
