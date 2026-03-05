import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Plus, Search, BarChart3, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', icon: BookOpen, label: '首页' },
  { path: '/shelf', icon: BookOpen, label: '书架' },
  { path: '/add', icon: Plus, label: '添加' },
  { path: '/search', icon: Search, label: '搜索' },
  { path: '/stats', icon: BarChart3, label: '统计' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <div className="app-layout">
      <nav className="app-nav">
        <div className="app-nav-inner">
          <Link to="/" className="app-logo">
            <BookOpen size={24} />
            个人书架
          </Link>

          <div className="app-nav-links">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`app-nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <User size={16} />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-muted link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  退出
                </button>
              </>
            ) : (
              <Link to="/login" className="link text-sm">
                登录
              </Link>
            )}
          </div>
        </div>

        <div className="app-nav-mobile">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`app-nav-link ${location.pathname === path ? 'active' : ''}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
