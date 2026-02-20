import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import AuthPage from './pages/auth/AuthPage';
import AdminLogin from './pages/auth/AdminLogin';

// User pages
import Dashboard from './pages/user/Dashboard';

// Misc
import NotFound from './pages/misc/NotFound';
import Unauthorized from './pages/misc/Unauthorized';

// Temporary placeholder component
function PagePlaceholder({ title }) {
  return (
    <div style={{ 
      padding: '60px 24px', 
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--green-primary)' }}>
        {title}
      </h1>
      <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
        This page is under construction.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public ─────────────────────────────────────────── */}
          <Route path="/login" element={<AuthPage defaultTab="login" />} />
          <Route path="/register" element={<AuthPage defaultTab="register" />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ── Protected: regular users ────────────────────────── */}
          <Route element={<ProtectedRoute requiredRole="user" />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/players" element={<PagePlaceholder title="Players" />} />
            <Route path="/players/:id" element={<PagePlaceholder title="Player Detail" />} />
            <Route path="/clubs" element={<PagePlaceholder title="Clubs" />} />
            <Route path="/clubs/:id" element={<PagePlaceholder title="Club Detail" />} />
            <Route path="/transfers" element={<PagePlaceholder title="Transfers" />} />
            <Route path="/transfers/:id" element={<PagePlaceholder title="Transfer Detail" />} />
            <Route path="/agents" element={<PagePlaceholder title="Agents" />} />
            <Route path="/agents/:id" element={<PagePlaceholder title="Agent Detail" />} />
          </Route>

          {/* ── Protected: admin only ───────────────────────────── */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin/dashboard" element={<PagePlaceholder title="Admin Dashboard" />} />
            <Route path="/admin/players" element={<PagePlaceholder title="Manage Players" />} />
            <Route path="/admin/clubs" element={<PagePlaceholder title="Manage Clubs" />} />
            <Route path="/admin/leagues" element={<PagePlaceholder title="Manage Leagues" />} />
            <Route path="/admin/agents" element={<PagePlaceholder title="Manage Agents" />} />
            <Route path="/admin/transfers" element={<PagePlaceholder title="Manage Transfers" />} />
            <Route path="/admin/contracts" element={<PagePlaceholder title="Manage Contracts" />} />
            <Route path="/admin/transfer-history" element={<PagePlaceholder title="Transfer History" />} />
          </Route>

          {/* ── Fallbacks ───────────────────────────────────────── */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
