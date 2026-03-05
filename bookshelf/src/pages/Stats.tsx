import { useState, useEffect, useMemo } from 'react';
import { getBooks } from '../lib/supabase-books';
import { BookOpen, TrendingUp, Star, Calendar } from 'lucide-react';
import type { Book } from '../types';

export default function Stats() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const read = books.filter((b) => b.status === 'read');
    const reading = books.filter((b) => b.status === 'reading');
    const want = books.filter((b) => b.status === 'want');
    const rated = books.filter((b) => b.rating && b.rating > 0);
    const avgRating = rated.length > 0
      ? (rated.reduce((s, b) => s + (b.rating || 0), 0) / rated.length).toFixed(1)
      : '-';

    const byYear: Record<string, number> = {};
    read.forEach((b) => {
      const year = b.finishDate ? b.finishDate.slice(0, 4) : new Date().getFullYear().toString();
      byYear[year] = (byYear[year] || 0) + 1;
    });
    const topYear = Object.entries(byYear).sort((a, b) => b[1] - a[1])[0];

    return { total: books.length, read: read.length, reading: reading.length, want: want.length, avgRating, topYear };
  }, [books]);

  const cards = [
    { icon: BookOpen, label: '藏书总数', value: stats.total, color: 'stat-icon blue' },
    { icon: TrendingUp, label: '已读完', value: stats.read, color: 'stat-icon green' },
    { icon: BookOpen, label: '正在读', value: stats.reading, color: 'stat-icon teal' },
    { icon: Star, label: '平均评分', value: stats.avgRating, color: 'stat-icon gold' },
    { icon: Calendar, label: '阅读高峰年', value: stats.topYear ? `${stats.topYear[0]} 年 ${stats.topYear[1]} 本` : '-', color: 'stat-icon', style: { background: 'linear-gradient(135deg, rgba(45, 90, 74, 0.12) 0%, rgba(45, 90, 74, 0.06) 100%)', color: 'var(--color-primary)' } },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title" style={{ fontSize: '28px', marginBottom: 8 }}>阅读统计</h1>
        <p className="text-muted mt-1">你的阅读数据一览</p>
      </div>

      <div className="grid-3">
        {cards.map(({ icon: Icon, label, value, color, style }) => (
          <div key={label} className="card">
            <div className="stat-card">
              <div className={color} style={style || {}}>
                <Icon size={28} />
              </div>
              <div>
                <p className="text-2xl font-semibold">{loading ? '...' : value}</p>
                <p className="text-sm text-muted">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && books.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-muted">添加书籍后即可查看统计</p>
        </div>
      )}
    </div>
  );
}
