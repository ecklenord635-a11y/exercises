import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBook } from '../lib/supabase-books';
import type { ReadingStatus } from '../types';

const statusOptions: { value: ReadingStatus; label: string }[] = [
  { value: 'want', label: '想读' },
  { value: 'reading', label: '在读' },
  { value: 'read', label: '已读' },
];

export default function AddBook() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    author: '',
    cover: '',
    isbn: '',
    publisher: '',
    publishDate: '',
    status: 'want' as ReadingStatus,
    rating: 0,
    progress: 0,
    totalPages: '',
    review: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      const book = await addBook({
        title: form.title.trim(),
        author: form.author.trim(),
        cover: form.cover || undefined,
        isbn: form.isbn || undefined,
        publisher: form.publisher || undefined,
        publishDate: form.publishDate || undefined,
        status: form.status,
        rating: form.rating || undefined,
        progress: form.status === 'reading' ? form.progress : form.status === 'read' ? 100 : undefined,
        totalPages: form.totalPages ? parseInt(form.totalPages, 10) : undefined,
        review: form.review || undefined,
      });
      navigate(`/book/${book.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="section-title" style={{ fontSize: '28px', marginBottom: 32 }}>添加书籍</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
        )}
        <div className="card space-y-6">
          <h2 className="text-lg font-medium">基本信息</h2>
          <div>
            <label className="label">书名 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="请输入书名"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">作者 *</label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              placeholder="请输入作者"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">封面图片 URL</label>
            <input
              type="url"
              value={form.cover}
              onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))}
              placeholder="https://..."
              className="input"
            />
          </div>
          <div className="grid-2-cols">
            <div>
              <label className="label">ISBN</label>
              <input
                type="text"
                value={form.isbn}
                onChange={(e) => setForm((f) => ({ ...f, isbn: e.target.value }))}
                placeholder="978-7-..."
                className="input"
              />
            </div>
            <div>
              <label className="label">出版日期</label>
              <input
                type="text"
                value={form.publishDate}
                onChange={(e) => setForm((f) => ({ ...f, publishDate: e.target.value }))}
                placeholder="2024"
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="card space-y-6">
          <h2 className="text-lg font-medium">阅读状态</h2>
          <div>
            <label className="label">状态</label>
            <div className="btn-group">
              {statusOptions.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: value }))}
                  className={`btn-status btn-sm ${form.status === value ? 'active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {form.status === 'reading' && (
            <div>
              <label className="label">阅读进度 (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.progress}
                onChange={(e) => setForm((f) => ({ ...f, progress: parseInt(e.target.value) || 0 }))}
                className="input"
              />
            </div>
          )}
          <div>
            <label className="label">评分 (1-5)</label>
            <div className="btn-group">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, rating: n }))}
                  className={`btn-rating ${form.rating >= n ? 'active' : ''}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">书评</label>
            <textarea
              value={form.review}
              onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
              placeholder="写下你的读后感..."
              rows={4}
              className="input"
              style={{ resize: 'none' }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary flex-1">
            取消
          </button>
          <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
            {submitting ? '添加中...' : '添加'}
          </button>
        </div>
      </form>
    </div>
  );
}
