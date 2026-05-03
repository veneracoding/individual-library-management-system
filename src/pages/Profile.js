import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { load, save, K, isOverdue } from '../utils';
import { Card, StatCard, Badge, Table, TR, TD, Btn, Modal, FormGroup, Input } from '../components/UI';

export default function Profile() {
  const { user } = useAuth();
  const { t } = useLang();
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: '', email: '' });
  const [pw, setPw] = useState({ old: '', new1: '', new2: '' });
  const [msg, setMsg] = useState('');

  const loans = load(K.LOANS).filter(l => l.memberId === (user?.id || user?.username));
  const books = load(K.BOOKS);
  const active = loans.filter(l => !l.returned);
  const returned = loans.filter(l => l.returned);
  const overdue = active.filter(l => isOverdue(l.dueDate));
  const reviews = load(K.REVIEWS || 'lib_reviews').filter(r => r.userId === (user?.id || user?.username));

  const members = load(K.MEMBERS);
  const myMember = members.find(m => m.username === user?.username);

  const saveProfile = () => {
    const all = load(K.MEMBERS);
    const idx = all.findIndex(m => m.username === user?.username);
    if (idx >= 0) {
      if (form.name.trim()) all[idx].name = form.name;
      if (form.phone.trim()) all[idx].phone = form.phone;
      if (form.email.trim()) all[idx].email = form.email;
      save(K.MEMBERS, all);
    }
    setMsg('Profil yangilandi!');
    setEditOpen(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const changePw = () => {
    if (!pw.old || !pw.new1 || !pw.new2) { setMsg('Barcha maydonlarni to\'ldiring!'); return; }
    if (pw.new1 !== pw.new2) { setMsg('Yangi parollar mos emas!'); return; }
    if (pw.new1.length < 6) { setMsg('Parol kamida 6 belgi!'); return; }
    const all = load(K.MEMBERS);
    const idx = all.findIndex(m => m.username === user?.username);
    if (idx < 0 || all[idx].password !== pw.old) { setMsg('Eski parol noto\'g\'ri!'); return; }
    all[idx].password = pw.new1;
    save(K.MEMBERS, all);
    setMsg('Parol muvaffaqiyatli o\'zgartirildi!');
    setPwOpen(false);
    setPw({ old: '', new1: '', new2: '' });
    setTimeout(() => setMsg(''), 3000);
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="page-enter">
      {msg && (
        <div style={{
          background: 'var(--success-bg)', border: '1px solid rgba(52,211,153,0.25)',
          borderRadius: 10, color: 'var(--success)', fontSize: 13,
          padding: '10px 16px', marginBottom: '1.25rem',
        }}>✓ {msg}</div>
      )}

      {/* Profile header */}
      <Card style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18,
            background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, color: '#fff', fontWeight: 700,
            boxShadow: '0 8px 24px rgba(91,141,246,0.35)', flexShrink: 0,
          }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span>@{user?.username}</span>
              {myMember?.phone && <span>📞 {myMember.phone}</span>}
              {myMember?.email && <span>✉ {myMember.email}</span>}
              {myMember?.date && <span>📅 {t('memberSince')}: {myMember.date}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn size="sm" onClick={() => { setForm({ name: user?.name || '', phone: myMember?.phone || '', email: myMember?.email || '' }); setEditOpen(true); }}>
              ✏️ {t('editProfile')}
            </Btn>
            <Btn size="sm" variant="ghost" onClick={() => setPwOpen(true)}>
              🔑 {t('changePassword')}
            </Btn>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.25rem' }}>
        <StatCard label={t('totalLoans')} value={loans.length} icon="📚" color="blue" />
        <StatCard label={t('currentLoans')} value={active.length} icon="🔄" />
        <StatCard label={t('returnedLoans')} value={returned.length} icon="✅" color="green" />
        <StatCard label={t('overdueLoans')} value={overdue.length} icon="⚠️" color="red" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Active loans */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>
            📤 {t('currentLoans')} ({active.length})
          </div>
          {active.length ? (
            <Table headers={[t('bookName'), t('year'), 'Holat']}>
              {active.map(l => {
                const b = books.find(x => x.id === l.bookId);
                const od = isOverdue(l.dueDate);
                return (
                  <TR key={l.id} highlight={od}>
                    <TD><span style={{ color: 'var(--text)', fontWeight: 500, fontSize: 12 }}>{b?.title || '—'}</span></TD>
                    <TD style={{ fontSize: 11 }}>{l.dueDate}</TD>
                    <TD><Badge color={od ? 'red' : 'blue'}>{od ? '⚠ Kechikdi' : '● OK'}</Badge></TD>
                  </TR>
                );
              })}
            </Table>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text3)', fontSize: 13 }}>Hozirda kitob yo'q</div>
          )}
        </Card>

        {/* My reviews */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>
            ⭐ Mening baholarim ({reviews.length})
          </div>
          {reviews.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reviews.map(r => {
                const b = books.find(x => x.id === r.bookId);
                return (
                  <div key={r.id} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{b?.title || '—'}</span>
                      <span style={{ color: '#fbbf24', fontSize: 12 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    {r.comment && <p style={{ fontSize: 11, color: 'var(--text3)', margin: 0 }}>{r.comment}</p>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text3)', fontSize: 13 }}>Hali baholamadingiz</div>
          )}
        </Card>
      </div>

      {/* Edit profile modal */}
      {editOpen && (
        <Modal title={t('editProfile')} onClose={() => setEditOpen(false)}>
          <FormGroup label={t('memberSince').replace('sana', 'ismi')}><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={t('memberSince')} /></FormGroup>
          <FormGroup label={t('phone')}><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+998 90 123 45 67" /></FormGroup>
          <FormGroup label={t('email')}><Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} type="email" placeholder="email@mail.uz" /></FormGroup>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <Btn onClick={() => setEditOpen(false)}>{t('cancel')}</Btn>
            <Btn variant="primary" onClick={saveProfile}>{t('save')}</Btn>
          </div>
        </Modal>
      )}

      {/* Change password modal */}
      {pwOpen && (
        <Modal title={t('changePassword')} onClose={() => setPwOpen(false)}>
          <FormGroup label={t('oldPassword')}><Input type="password" value={pw.old} onChange={e => setPw(p => ({ ...p, old: e.target.value }))} /></FormGroup>
          <FormGroup label={t('newPassword')}><Input type="password" value={pw.new1} onChange={e => setPw(p => ({ ...p, new1: e.target.value }))} /></FormGroup>
          <FormGroup label={t('confirmPassword')}><Input type="password" value={pw.new2} onChange={e => setPw(p => ({ ...p, new2: e.target.value }))} /></FormGroup>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <Btn onClick={() => setPwOpen(false)}>{t('cancel')}</Btn>
            <Btn variant="primary" onClick={changePw}>{t('save')}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
