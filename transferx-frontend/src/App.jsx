import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Auth
import AuthPage from './pages/auth/AuthPage';
const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));

// User pages
import Dashboard from './pages/user/Dashboard';
const UserProfile = lazy(() => import('./pages/user/UserProfile'));

// Player pages
const PlayerProfile = lazy(() => import('./pages/player/PlayerProfile'));

// Common pages
const PlayersPage = lazy(() => import('./pages/common/PlayersPage'));
const ClubsPage = lazy(() => import('./pages/common/ClubsPage'));
const ClubDetail = lazy(() => import('./pages/common/ClubDetail'));
const TransfersPage = lazy(() => import('./pages/common/TransfersPage'));
const AgentsPage = lazy(() => import('./pages/common/AgentsPage'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPlayers = lazy(() => import('./pages/admin/AdminPlayers'));
const AdminTransfers = lazy(() => import('./pages/admin/AdminTransfers'));
const AdminContracts = lazy(() => import('./pages/admin/AdminContracts'));
const AdminAgents = lazy(() => import('./pages/admin/AdminAgents'));

// Misc
import NotFound from './pages/misc/NotFound';
import Unauthorized from './pages/misc/Unauthorized';

const PageLoadingFallback = () => <LoadingSpinner fullPage />;

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
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* ── Public ─────────────────────────────────────────── */}
              <Route path="/login" element={<AuthPage defaultTab="login" />} />
              <Route path="/register" element={<AuthPage defaultTab="register" />} />
              <Route path="/admin/login" element={<Suspense fallback={<PageLoadingFallback />}><AdminLogin /></Suspense>} />

              {/* ── Public: all users can access ────────────────────── */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/players" element={<Suspense fallback={<PageLoadingFallback />}><PlayersPage /></Suspense>} />
              <Route path="/players/:id" element={<Suspense fallback={<PageLoadingFallback />}><PlayerProfile /></Suspense>} />
              <Route path="/clubs" element={<Suspense fallback={<PageLoadingFallback />}><ClubsPage /></Suspense>} />
              <Route path="/clubs/:id" element={<Suspense fallback={<PageLoadingFallback />}><ClubDetail /></Suspense>} />
              <Route path="/transfers" element={<Suspense fallback={<PageLoadingFallback />}><TransfersPage /></Suspense>} />
              <Route path="/transfers/:id" element={<PagePlaceholder title="Transfer Detail" />} />
              <Route path="/agents" element={<Suspense fallback={<PageLoadingFallback />}><AgentsPage /></Suspense>} />
              <Route path="/agents/:id" element={<PagePlaceholder title="Agent Detail" />} />
              <Route path="/users/:userId" element={<Suspense fallback={<PageLoadingFallback />}><UserProfile /></Suspense>} />

              {/* ── Admin routes (ADMIN only) ──────────────────────────── */}
              <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
                <Route path="/admin" element={<Suspense fallback={<PageLoadingFallback />}><AdminDashboard /></Suspense>} />
                <Route path="/admin/dashboard" element={<Suspense fallback={<PageLoadingFallback />}><AdminDashboard /></Suspense>} />
                <Route path="/admin/players" element={<Suspense fallback={<PageLoadingFallback />}><AdminPlayers /></Suspense>} />
                <Route path="/admin/transfers" element={<Suspense fallback={<PageLoadingFallback />}><AdminTransfers /></Suspense>} />
                <Route path="/admin/contracts" element={<Suspense fallback={<PageLoadingFallback />}><AdminContracts /></Suspense>} />
                <Route path="/admin/agents" element={<Suspense fallback={<PageLoadingFallback />}><AdminAgents /></Suspense>} />
                <Route path="/admin/clubs" element={<PagePlaceholder title="Manage Clubs" />} />
                <Route path="/admin/leagues" element={<PagePlaceholder title="Manage Leagues" />} />
              </Route>

              {/* ── Fallbacks ───────────────────────────────────────── */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
