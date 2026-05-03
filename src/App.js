import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LangProvider } from './context/LangContext';
import { initDemoData } from './utils';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Catalog from './pages/Catalog';
import AllBooks from './pages/AllBooks';
import Warehouse from './pages/Warehouse';
import Analytics from './pages/Analytics';
import Members from './pages/Members';
import Loans from './pages/Loans';
import Profile from './pages/Profile';
import { Reports } from './pages/Pages';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

initDemoData();

function AppInner() {
  const { user } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [authed, setAuthed] = useState(!!user);

  if (!authed || !user) return <AuthPage onLogin={() => setAuthed(true)} />;

  const pageMap = {
    dashboard: <Dashboard />,
    catalog:   <Catalog />,
    allBooks:  <AllBooks />,
    books:     <Books />,
    warehouse: <Warehouse />,
    members:   <Members />,
    loans:     <Loans />,
    analytics: <Analytics />,
    reports:   <Reports />,
    profile:   <Profile />,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)', transition: 'background var(--transition)' }}>
      <Sidebar page={page} setPage={setPage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Topbar page={page} setPage={setPage} />
        <main style={{
          flex: 1, padding: '1.5rem 1.75rem',
          overflowY: 'auto', overflowX: 'hidden',
          background: 'var(--bg)',
        }}>
          {pageMap[page] || <Dashboard />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
          <AppInner />
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
