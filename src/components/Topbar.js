import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
import { load, K, isOverdue } from '../utils';

function NotificationBell({ setPage }) {
  const { t } = useLang();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const loans = load(K.LOANS).filter(l =>
    !l.returned && (user?.role === 'admin' || l.memberId === (user?.id || user?.username))
  );
  const books = load(K.BOOKS);
  const members = load(K.MEMBERS);

  const today = new Date();
  const soon = new Date(); soon.setDate(soon.getDate() + 3);

  const overdue = loans.filter(l => new Date(l.dueDate) < today);
  const dueSoon = loans.filter(l => {
    const d = new Date(l.dueDate);
    return d >= today && d <= soon;
  });

  const notifications = [
    ...overdue.map(l => {
      const b = books.find(x => x.id === l.bookId);
      const m = members.find(x => x.id === l.memberId);
      const days = Math.floor((today - new Date(l.dueDate)) / 86400000);
      return { id: l.id, type: 'overdue', title: b?.title || '—', member: m?.name || user?.name, days, color: 'var(--danger)', bg: 'var(--danger-bg)', icon: '⚠' };
    }),
    ...dueSoon.map(l => {
      const b = books.find(x => x.id === l.bookId);
      const m = members.find(x => x.id === l.memberId);
      const days = Math.ceil((new Date(l.dueDate) - today) / 86400000);
      return { id: l.id + '_soon', type: 'soon', title: b?.title || '—', member: m?.name || user?.name, days, color: 'var(--warning)', bg: 'var(--warning-bg)', icon: '🔔' };
    }),
  ];

  const count = notifications.length;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: 38, height: 38, borderRadius: 10,
        background: open ? 'var(--bg3)' : 'transparent',
        border: '1px solid ' + (open ? 'var(--border2)' : 'transparent'),
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', position: 'relative', transition: 'all 0.15s',
        color: 'var(--text2)',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {count > 0 && (
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--danger)',
            boxShadow: '0 0 0 2px var(--bg)',
            animation: 'pulse 2s infinite',
          }} />
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 46, right: 0,
          width: 320, background: 'var(--bg2)',
          border: '1px solid var(--border2)', borderRadius: 14,
          boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
          zIndex: 500, overflow: 'hidden',
          animation: 'fadeIn 0.15s ease',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{t('notifications')}</span>
            {count > 0 && <span style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 600 }}>{count} ta</span>}
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔕</div>
                {t('noNotifications')}
              </div>
            ) : notifications.map(n => (
              <div key={n.id} style={{
                padding: '10px 16px', borderBottom: '1px solid var(--border)',
                background: n.bg, borderLeft: `3px solid ${n.color}`,
                cursor: 'pointer', transition: 'opacity 0.15s',
              }}
                onClick={() => { setPage('loans'); setOpen(false); }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
                      {n.type === 'overdue'
                        ? `${n.days} kun kechikdi`
                        : `${n.days} kun qoldi`}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text2)' }}>{n.title}</div>
                    {n.member && <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{n.member}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LangSelector() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const langs = [{ code: 'uz', label: "O'zbek", flag: '🇺🇿' }, { code: 'ru', label: 'Русский', flag: '🇷🇺' }, { code: 'en', label: 'English', flag: '🇬🇧' }];
  const current = langs.find(l => l.code === lang);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        height: 38, padding: '0 12px', borderRadius: 10,
        background: open ? 'var(--bg3)' : 'transparent',
        border: '1px solid ' + (open ? 'var(--border2)' : 'transparent'),
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        color: 'var(--text2)', fontSize: 13, fontFamily: 'var(--font-body)',
        transition: 'all 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}}
      >
        <span>{current?.flag}</span>
        <span style={{ fontWeight: 500 }}>{current?.code?.toUpperCase()}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 46, right: 0,
          background: 'var(--bg2)', border: '1px solid var(--border2)',
          borderRadius: 12, overflow: 'hidden', zIndex: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.15s ease', minWidth: 140,
        }}>
          {langs.map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 14px', border: 'none',
              background: lang === l.code ? 'var(--accent-soft)' : 'transparent',
              color: lang === l.code ? 'var(--accent)' : 'var(--text2)',
              cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)',
              fontWeight: lang === l.code ? 600 : 400,
              transition: 'background 0.12s',
              textAlign: 'left',
            }}
              onMouseEnter={e => { if (lang !== l.code) e.currentTarget.style.background = 'var(--bg3)'; }}
              onMouseLeave={e => { if (lang !== l.code) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 18 }}>{l.flag}</span>
              {l.label}
              {lang === l.code && <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileMenu({ setPage }) {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        height: 38, padding: '0 12px 0 6px', borderRadius: 10,
        background: open ? 'var(--bg3)' : 'transparent',
        border: '1px solid ' + (open ? 'var(--border2)' : 'transparent'),
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        transition: 'all 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, color: '#fff', fontWeight: 700, letterSpacing: '0.5px',
        }}>{initials}</div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{user?.name?.split(' ')[0]}</div>
          <div style={{ fontSize: 10, color: 'var(--text3)' }}>{user?.role === 'admin' ? 'Admin' : "A'zo"}</div>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--text3)', marginLeft: 2 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 46, right: 0,
          background: 'var(--bg2)', border: '1px solid var(--border2)',
          borderRadius: 14, overflow: 'hidden', zIndex: 500,
          boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.15s ease', minWidth: 200,
        }}>
          {/* User info */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, color: '#fff', fontWeight: 700,
              }}>{initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>@{user?.username}</div>
              </div>
            </div>
          </div>
          {/* Menu items */}
          {[
            { icon: '👤', label: t('profile'), action: () => { setPage('profile'); setOpen(false); } },
            { icon: '🚪', label: t('logout'), action: logout, danger: true },
          ].map((item, i) => (
            <button key={i} onClick={item.action} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 16px', border: 'none',
              background: 'transparent',
              color: item.danger ? 'var(--danger)' : 'var(--text2)',
              cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)',
              transition: 'background 0.12s', textAlign: 'left',
            }}
              onMouseEnter={e => e.currentTarget.style.background = item.danger ? 'var(--danger-bg)' : 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useLang();
  return (
    <button onClick={toggle} title={theme === 'dark' ? t('lightMode') : t('darkMode')} style={{
      width: 38, height: 38, borderRadius: 10,
      background: 'transparent', border: '1px solid transparent',
      cursor: 'pointer', display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: 'var(--text2)',
      transition: 'all 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
    >
      {theme === 'dark' ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

export default function Topbar({ page, setPage }) {
  const { t } = useLang();

  const pageTitles = {
    dashboard: t('dashboard'), catalog: t('catalog'), allBooks: t('allBooks'),
    books: t('books'), warehouse: t('warehouse'), members: t('members'),
    loans: t('loans'), analytics: t('analytics'), reports: t('reports'),
    profile: t('profile'),
  };

  return (
    <header style={{
      height: 58, background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 1.5rem 0 1.25rem',
      gap: 12, flexShrink: 0,
      transition: 'background var(--transition)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Page title */}
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
          {pageTitles[page] || ''}
        </span>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <ThemeToggle />
        <LangSelector />
        <div style={{ width: 1, height: 22, background: 'var(--border)', margin: '0 4px' }} />
        <NotificationBell setPage={setPage} />
        <ProfileMenu setPage={setPage} />
      </div>
    </header>
  );
}
