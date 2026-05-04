import React from 'react';

/* ── Modal ── */
export function Modal({ title, onClose, children, width = 520 }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }}>
      <div className="scale-in" style={{
        background: 'var(--bg2)', border: '1px solid var(--border2)',
        borderRadius: 'var(--radius-xl)', padding: '2rem',
        width: '100%', maxWidth: width, boxShadow: 'var(--shadow)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: 17, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>{title}</span>
          <button onClick={onClose} style={{
            background: 'var(--bg3)', border: '1px solid var(--border)',
            color: 'var(--text3)', fontSize: 16, cursor: 'pointer',
            width: 32, height: 32, borderRadius: 8, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text3)'; }}
          >✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── FormGroup ── */
export function FormGroup({ label, children, span }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, gridColumn: span ? `span ${span}` : undefined }}>
      <label style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}

export const inputStyle = {
  padding: '9px 13px', background: 'var(--bg3)',
  border: '1px solid var(--border)', borderRadius: 'var(--radius)',
  color: 'var(--text)', fontSize: 13, outline: 'none', width: '100%',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

export function Input(props) {
  return (
    <input style={inputStyle} {...props}
      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)'; }}
      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
    />
  );
}

export function Select({ children, ...props }) {
  const theme = document.documentElement.getAttribute("data-theme") || "dark";
  return (
    <select style={{ ...inputStyle, cursor: "pointer", colorScheme: theme }} {...props}
      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)'; }}
      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
    >{children}</select>
  );
}

export function Textarea(props) {
  return (
    <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 70 }} {...props}
      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)'; }}
      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
    />
  );
}

/* ── Button ── */
export function Btn({ variant = 'default', size = 'md', children, style: ex, ...props }) {
  const base = {
    border: 'none', borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-body)', fontWeight: 500,
    cursor: 'pointer', transition: 'all 0.15s',
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: size === 'sm' ? '5px 11px' : size === 'lg' ? '11px 22px' : '9px 16px',
    fontSize: size === 'sm' ? 12 : size === 'lg' ? 15 : 13,
    letterSpacing: '0.1px',
  };
  const variants = {
    default: { background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' },
    primary: { background: 'var(--accent)', color: '#fff', boxShadow: '0 2px 8px rgba(91,141,246,0.35)' },
    success: { background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid rgba(52,211,153,0.25)' },
    danger:  { background: 'var(--danger-bg)',  color: 'var(--danger)',  border: '1px solid rgba(248,113,113,0.25)' },
    warning: { background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid rgba(251,191,36,0.25)' },
    ghost:   { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)' },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...ex }} {...props}
      onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >{children}</button>
  );
}

/* ── Badge ── */
export function Badge({ color = 'default', children }) {
  const colors = {
    default: { bg: 'var(--bg4)', col: 'var(--text2)' },
    green:   { bg: 'var(--success-bg)', col: 'var(--success)' },
    red:     { bg: 'var(--danger-bg)',  col: 'var(--danger)' },
    amber:   { bg: 'var(--warning-bg)', col: 'var(--warning)' },
    blue:    { bg: 'var(--info-bg)',    col: 'var(--accent)' },
  };
  const c = colors[color] || colors.default;
  return (
    <span style={{
      background: c.bg, color: c.col,
      display: 'inline-block', padding: '2px 9px',
      borderRadius: 6, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.2px',
    }}>{children}</span>
  );
}

/* ── Card ── */
export function Card({ children, style, hover }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '1.25rem',
        transition: 'all var(--transition)',
        boxShadow: hov ? 'var(--shadow)' : 'var(--shadow-sm)',
        transform: hov ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >{children}</div>
  );
}

/* ── StatCard ── */
export function StatCard({ label, value, sub, color = 'default', icon }) {
  const cols = { default: 'var(--text)', blue: 'var(--accent)', green: 'var(--success)', red: 'var(--danger)', amber: 'var(--warning)' };
  const bgs  = { default: 'var(--bg4)',  blue: 'var(--info-bg)', green: 'var(--success-bg)', red: 'var(--danger-bg)', amber: 'var(--warning-bg)' };
  return (
    <Card hover style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: cols[color], fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>{value}</div>
          {sub && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>{sub}</div>}
        </div>
        {icon && (
          <div style={{ width: 42, height: 42, borderRadius: 12, background: bgs[color], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            {icon}
          </div>
        )}
      </div>
      {/* subtle corner glow */}
      <div style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: bgs[color], opacity: 0.6, pointerEvents: 'none' }} />
    </Card>
  );
}

/* ── PageHeader ── */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', letterSpacing: '-0.4px' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 3 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ── Table ── */
export function Table({ headers, children }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                textAlign: 'left', padding: '8px 14px',
                borderBottom: '1px solid var(--border)',
                fontSize: 10, fontWeight: 700, color: 'var(--text3)',
                letterSpacing: '0.8px', textTransform: 'uppercase',
                background: 'var(--bg3)',
                ...(i === 0 ? { borderRadius: '8px 0 0 0' } : {}),
                ...(i === headers.length - 1 ? { borderRadius: '0 8px 0 0' } : {}),
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function TR({ children, highlight }) {
  const [hov, setHov] = React.useState(false);
  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: highlight ? 'var(--danger-bg)' : hov ? 'var(--bg3)' : 'transparent',
        transition: 'background 0.12s',
      }}
    >{children}</tr>
  );
}

export function TD({ children, style }) {
  return (
    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', color: 'var(--text2)', verticalAlign: 'middle', ...style }}>
      {children}
    </td>
  );
}

/* ── Empty state ── */
export function Empty({ icon = '📭', message = "Ma'lumot topilmadi" }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ color: 'var(--text3)', fontSize: 13 }}>{message}</div>
    </div>
  );
}

/* ── Tabs ── */
export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border)', marginBottom: '1.25rem' }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding: '8px 18px', border: 'none', background: 'none',
          cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)',
          color: active === t.id ? 'var(--accent)' : 'var(--text3)',
          fontWeight: active === t.id ? 600 : 400,
          borderBottom: `2px solid ${active === t.id ? 'var(--accent)' : 'transparent'}`,
          marginBottom: -1, transition: 'all 0.15s',
        }}>{t.label}</button>
      ))}
    </div>
  );
}

/* ── SearchBar — Catalog style ── */
export function SearchBar({ value, onChange, placeholder = 'Qidirish...', children, style }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '0.75rem 1rem',
      display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
      marginBottom: '1rem', transition: 'border-color 0.15s',
      ...style,
    }}>
      {/* Search input with icon */}
      <div style={{ flex: 1, minWidth: 180, position: 'relative', display: 'flex', alignItems: 'center' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ position: 'absolute', left: 11, color: 'var(--text3)', pointerEvents: 'none', flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: '100%', padding: '9px 12px 9px 34px',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 10, color: 'var(--text)', fontSize: 13,
            outline: 'none', fontFamily: 'var(--font-body)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'var(--accent)';
            e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)';
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
      {/* Extra controls (select, buttons) passed as children */}
      {children}
    </div>
  );
}
