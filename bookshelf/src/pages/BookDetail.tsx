import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Trash2, Edit2 } from 'lucide-react';
import { getBookById, updateBook, deleteBook } from '../lib/supabase-books';
import type { Book, ReadingStatus } from '../types';

const statusLabels: Record<string, string> = {
  want: '想读',
  reading: '在读',
  read: '已读',
};

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    status: 'want' as ReadingStatus,
    rating: 0,
    progress: 0,
    review: '',
  });

  useEffect(() => {
    if (!id) return;
    getBookById(id)
      .then((b) => {
        setBook(b);
        if (b) {
          setForm({
            status: b.status,
            rating: b.rating || 0,
            progress: b.progress || 0,
            review: b.review || '',
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!book || !id) return;
    setSaving(true);
    try {
      const updated = await updateBook(id, {
        ...book,
        ...form,
        progress: form.status === 'reading' ? form.progress : form.status === 'read' ? 100 : form.progress,
      });
      setBook(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('确定要删除这本书吗？')) return;
    try {
      await deleteBook(id);
      navigate('/');
    } catch {
      alert('删除失败');
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '64px 0' }}>
        <p className="text-muted">加载中...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center" style={{ padding: '64px 0' }}>
        <p className="text-muted">未找到该书</p>
        <button
          onClick={() => navigate('/')}
          className="link mt-4"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted mb-8"
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
      >
        <ArrowLeft size={16} />
        返回
      </button>

      <div className="card card-lg" style={{ overflow: 'hidden' }}>
        <div className="flex book-detail-layout">
          <div style={{ flexShrink: 0, width: 256 }}>
            <div className="book-cover">
              {book.cover ? (
                <img src={book.cover} alt={book.title} />
              ) : (
                <div className="book-cover-placeholder" style={{ fontSize: 48 }}>{book.title.charAt(0)}</div>
              )}
            </div>
          </div>
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{book.title}</h1>
            <p className="text-muted mt-1">{book.author}</p>
            {book.publisher && <p className="text-sm text-muted mt-1">{book.publisher}</p>}

            <div className="flex flex-wrap gap-2 mt-6">
              <span className="badge badge-blue">{statusLabels[book.status]}</span>
              {book.rating !== undefined && book.rating > 0 && (
                <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>
                  <Star size={14} fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  {book.rating}
                </span>
              )}
            </div>

            {editing ? (
              <div className="mt-8 space-y-6">
                <div>
                  <label className="label">状态</label>
                  <div className="btn-group">
                    {(['want', 'reading', 'read'] as ReadingStatus[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, status: s }))}
                        className={`btn-status btn-sm ${form.status === s ? 'active' : ''}`}
                      >
                        {statusLabels[s]}
                      </button>
                    ))}
                  </div>
                </div>
                {form.status === 'reading' && (
                  <div>
                    <label className="label">进度 (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.progress}
                      onChange={(e) => setForm((f) => ({ ...f, progress: parseInt(e.target.value) || 0 }))}
                      className="input"
                      style={{ width: 128 }}
                    />
                  </div>
                )}
                <div>
                  <label className="label">评分</label>
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
                    rows={4}
                    className="input"
                    style={{ resize: 'none' }}
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEditing(false)} className="btn btn-secondary">
                    取消
                  </button>
                  <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
                    {saving ? '保存中...' : '保存'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {book.progress !== undefined && book.status === 'reading' && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>阅读进度</span>
                      <span>{book.progress}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 8 }}>
                      <div className="progress-fill" style={{ width: `${book.progress}%` }} />
                    </div>
                  </div>
                )}
                {book.review && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-muted mb-2">书评</h3>
                    <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{book.review}</p>
                  </div>
                )}
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setEditing(true)}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    编辑
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn flex items-center gap-2"
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                    删除
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
