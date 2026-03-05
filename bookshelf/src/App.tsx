import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Shelf from './pages/Shelf';
import AddBook from './pages/AddBook';
import Search from './pages/Search';
import Stats from './pages/Stats';
import BookDetail from './pages/BookDetail';
import Debug from './pages/Debug';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '40vh' }}>
        <p className="text-muted">加载中...</p>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/debug" element={<Debug />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/shelf"
        element={
          <Layout>
            <ProtectedRoute>
              <Shelf />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/add"
        element={
          <Layout>
            <ProtectedRoute>
              <AddBook />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/search"
        element={
          <Layout>
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/stats"
        element={
          <Layout>
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/book/:id"
        element={
          <Layout>
            <ProtectedRoute>
              <BookDetail />
            </ProtectedRoute>
          </Layout>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
