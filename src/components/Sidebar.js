import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

const getNav = (t) => [
  { id: 'dashboard', label: t('dashboard'), icon: <HomeIcon /> },
  { id: 'catalog',   label: t('catalog'),   icon: <CatalogIcon /> },
  { id: 'allBooks',  label: t('allBooks'),  icon: <ListIcon /> },
  { id: 'loans',     label: t('loans'),     icon: <LoansIcon /> },
  { id: 'books',     label: t('books'),     icon: <BooksIcon />, adminOnly: true },
  { id: 'warehouse', label: t('warehouse'), icon: <WareIcon />,  adminOnly: true },
  { id: 'members',   label: t('members'),   icon: <UsersIcon />, adminOnly: true },
  { id: 'analytics', label: t('analytics'), icon: <ChartIcon />, adminOnly: true },
  { id: 'reports',   label: t('reports'),   icon: <ReportIcon />, adminOnly: true },
];

function HomeIcon()   { return <Ico d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />; }
function CatalogIcon(){ return <Ico d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />; }
function ListIcon()   { return <Ico d="M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01" />; }
function LoansIcon()  { return <Ico d="M16 3h5v5 M4 20L21 3 M21 16v5h-5 M15 15l6 6 M4 4l5 5" />; }
function BooksIcon()  { return <Ico d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />; }
function WareIcon()   { return <Ico d="M22 12h-4l-3 9L9 3l-3 9H2" />; }
function UsersIcon()  { return <Ico d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />; }
function ChartIcon()  { return <Ico d="M18 20V10 M12 20V4 M6 20v-6" />; }
function ReportIcon() { return <Ico d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />; }

function Ico({ d }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {d.split(' M').map((seg, i) => <path key={i} d={(i === 0 ? '' : 'M') + seg} />)}
    </svg>
  );
}

export default function Sidebar({ page, setPage }) {
  const { user } = useAuth();
  const { t } = useLang();
  const isAdmin = user?.role === 'admin';
  const [collapsed, setCollapsed] = useState(false);

  const items = getNav(t).filter(n => !n.adminOnly || isAdmin);

  const w = collapsed ? 60 : 220;

  return (
    <aside style={{
      width: w, minWidth: w, maxWidth: w,
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: collapsed ? '1rem 0.5rem' : '1rem 0.75rem',
      transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', marginBottom: '1rem', padding: collapsed ? 0 : '0 4px' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--accent-soft)', border: '1px solid rgba(91,141,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>Kutubxona</div>
              <div style={{ fontSize: 9, color: 'var(--text3)', fontWeight: 500 }}>Boshqaruv tizimi</div>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(c => !c)} style={{
          width: 28, height: 28, borderRadius: 7, background: 'var(--bg3)',
          border: '1px solid var(--border)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text3)', flexShrink: 0, transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg4)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text3)'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {collapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {items.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={() => setPage(item.id)}
              title={collapsed ? item.label : ''}
              style={{
                display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : 9,
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '9px' : '9px 11px',
                borderRadius: 9, border: 'none',
                background: active ? 'var(--accent-soft)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text2)',
                fontSize: 13, fontWeight: active ? 600 : 400,
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'all 0.15s', fontFamily: 'var(--font-body)',
                outline: active ? '1px solid rgba(91,141,246,0.2)' : 'none',
                whiteSpace: 'nowrap', overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text)'; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; }}}
            >
              <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
              {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
              {!collapsed && active && <span style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
