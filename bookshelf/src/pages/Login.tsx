import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(email.trim(), password, name.trim());
        setError('');
        navigate('/');
      } else {
        await signIn(email.trim(), password);
        navigate('/');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '操作失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-80 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="app-logo" style={{ display: 'inline-flex' }}>
            <BookOpen size={32} />
            <span className="text-2xl">个人书架</span>
          </Link>
        </div>
        <div className="card card-lg p-8">
          <h1 className="text-2xl font-semibold text-center mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {isSignUp ? '创建账号' : '欢迎回来'}
          </h1>
          <p className="text-muted text-center mb-8">
            {isSignUp ? '注册以开始管理你的书架' : '登录以管理你的书架'}
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label className="label">姓名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入你的姓名"
                  className="input"
                  required={isSignUp}
                />
              </div>
            )}
            <div>
              <label className="label">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位"
                className="input"
                minLength={6}
                required
              />
            </div>
            {error && (
              <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
            )}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={submitting}
            >
              {submitting ? '处理中...' : isSignUp ? '注册' : '登录'}
            </button>
          </form>
          <p className="text-center text-sm text-muted mt-6">
            {isSignUp ? '已有账号？' : '还没有账号？'}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="link ml-1"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {isSignUp ? '去登录' : '去注册'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
