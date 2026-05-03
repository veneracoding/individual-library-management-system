import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AuthPage({ onLogin }) {
  const { login, register } = useAuth();
  const { theme, toggle } = useTheme();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', username: '', password: '', confirm: '', phone: '', email: '' });

  const s = {
    page: {
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', position: 'relative', overflow: 'hidden',
      transition: 'background var(--transition)',
    },
    orb1: { position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,141,246,0.07) 0%, transparent 65%)', top: -200, left: -150, pointerEvents: 'none' },
    orb2: { position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 65%)', bottom: -100, right: -80, pointerEvents: 'none' },
    grid: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none', opacity: 0.5 },
    card: {
      background: 'var(--bg2)', border: '1px solid var(--border2)',
      borderRadius: 24, padding: '2.25rem 2.5rem',
      width: '100%', maxWidth: 420,
      position: 'relative', zIndex: 1,
      boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
      transition: 'background var(--transition)',
    },
    themeBtn: {
      position: 'fixed', top: 20, right: 20,
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
      fontSize: 13, color: 'var(--text2)', zIndex: 10,
      display: 'flex', alignItems: 'center', gap: 7,
      fontFamily: 'var(--font-body)', transition: 'all 0.15s',
      boxShadow: 'var(--shadow-sm)',
    },
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setError('');
    if (!loginForm.username || !loginForm.password) { setError("Barcha maydonlarni to'ldiring!"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 450));
    const res = login(loginForm.username, loginForm.password);
    setLoading(false);
    if (res.ok) onLogin(); else setError(res.error);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setError('');
    const { name, username, password, confirm, phone } = regForm;
    if (!name || !username || !password || !phone) { setError("Majburiy maydonlarni to'ldiring!"); return; }
    if (password !== confirm) { setError("Parollar mos emas!"); return; }
    if (password.length < 6) { setError("Parol kamida 6 belgi bo'lishi kerak!"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 450));
    const res = register(regForm);
    setLoading(false);
    if (res.ok) { setSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi kirishingiz mumkin."); setTab('login'); }
    else setError(res.error);
  };

  const inp = (placeholder, value, onChange, type = 'text', autoFocus) => (
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange}
      autoFocus={autoFocus}
      style={{
        width: '100%', padding: '11px 14px',
        background: 'var(--bg3)', border: '1px solid var(--border)',
        borderRadius: 10, color: 'var(--text)', fontSize: 13,
        outline: 'none', marginBottom: '0.875rem',
        fontFamily: 'var(--font-body)', transition: 'all 0.15s',
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)'; }}
      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
    />
  );

  return (
    <div style={s.page}>
      <div style={s.orb1} /><div style={s.orb2} /><div style={s.grid} />

      <button onClick={toggle} style={s.themeBtn}>
        <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
        {theme === 'dark' ? "Yorug' rejim" : "Qorong'u rejim"}
      </button>

      <div className="scale-in" style={s.card}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'var(--accent-soft)',
            border: '1px solid rgba(91,141,246,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 1rem',
            boxShadow: 'var(--accent-glow)',
          }}>📚</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' }}>Kutubxona</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3, letterSpacing: '0.5px' }}>BOSHQARUV TIZIMI</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 12, padding: 4, marginBottom: '1.75rem', border: '1px solid var(--border)' }}>
          {[['login', 'Kirish'], ['register', "Ro'yxatdan o'tish"]].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setError(''); setSuccess(''); }} style={{
              flex: 1, padding: '8px 10px', border: 'none', borderRadius: 9,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: tab === key ? 'var(--bg2)' : 'transparent',
              color: tab === key ? 'var(--text)' : 'var(--text3)',
              boxShadow: tab === key ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s', fontFamily: 'var(--font-body)',
            }}>{label}</button>
          ))}
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, color: 'var(--danger)', fontSize: 12, padding: '10px 13px', marginBottom: '1rem' }}>
            ⚠ {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'var(--success-bg)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 10, color: 'var(--success)', fontSize: 12, padding: '10px 13px', marginBottom: '1rem' }}>
            ✓ {success}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            {inp('Foydalanuvchi nomi', loginForm.username, e => setLoginForm(p => ({ ...p, username: e.target.value })), 'text', true)}
            {inp('Parol', loginForm.password, e => setLoginForm(p => ({ ...p, password: e.target.value })), 'password')}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px',
              background: loading ? 'var(--bg4)' : 'var(--accent)',
              color: '#fff', border: 'none', borderRadius: 11,
              fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)', transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(91,141,246,0.4)',
            }}>
              {loading ? '⏳ Kirilmoqda...' : 'Kirish →'}
            </button>

            <div style={{ marginTop: '1.25rem', padding: '12px 14px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text3)', lineHeight: 1.8 }}>
              <span style={{ fontWeight: 600, color: 'var(--text2)' }}>Demo:</span>{' '}
              Admin: <code style={{ background: 'var(--bg4)', padding: '1px 5px', borderRadius: 4, color: 'var(--accent)' }}>admin</code> /{' '}
              <code style={{ background: 'var(--bg4)', padding: '1px 5px', borderRadius: 4, color: 'var(--accent)' }}>admin123</code>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            {inp("To'liq ism *", regForm.name, e => setRegForm(p => ({ ...p, name: e.target.value })))}
            {inp('Foydalanuvchi nomi *', regForm.username, e => setRegForm(p => ({ ...p, username: e.target.value })))}
            {inp('Telefon *', regForm.phone, e => setRegForm(p => ({ ...p, phone: e.target.value })))}
            {inp('Email', regForm.email, e => setRegForm(p => ({ ...p, email: e.target.value })), 'email')}
            {inp('Parol * (kamida 6 belgi)', regForm.password, e => setRegForm(p => ({ ...p, password: e.target.value })), 'password')}
            {inp('Parolni tasdiqlash *', regForm.confirm, e => setRegForm(p => ({ ...p, confirm: e.target.value })), 'password')}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px',
              background: loading ? 'var(--bg4)' : 'var(--accent)',
              color: '#fff', border: 'none', borderRadius: 11,
              fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)', transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(91,141,246,0.4)',
            }}>
              {loading ? '⏳ Saqlanmoqda...' : "Ro'yxatdan o'tish →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
