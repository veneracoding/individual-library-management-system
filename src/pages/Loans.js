import React, { useState } from 'react';
import { load, save, K, uid, today, addDays, isOverdue } from '../utils';
import { PageHeader, Card, Badge, Table, TR, TD, Btn, Modal, FormGroup, Select, Tabs, Empty, StatCard } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function Loans() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [loans, setLoans] = useState(() => load(K.LOANS));
  const [books]   = useState(() => load(K.BOOKS));
  const [members] = useState(() => load(K.MEMBERS));
  const [tab, setTab] = useState('active');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ bookId: '', memberId: '', days: 14 });

  const myLoans  = isAdmin ? loans : loans.filter(l => l.memberId === user?.id);
  const active   = myLoans.filter(l => !l.returned);
  const returned = myLoans.filter(l => l.returned);
  const overdue  = active.filter(l => isOverdue(l.dueDate));

  const handleLoan = () => {
    const allBooks = load(K.BOOKS);
    const bi = allBooks.findIndex(b => b.id === form.bookId);
    if (bi < 0 || allBooks[bi].available < 1) { alert('Kitob mavjud emas!'); return; }
    allBooks[bi].available--;
    save(K.BOOKS, allBooks);
    const newLoans = [...loans, {
      id: uid(), bookId: form.bookId, memberId: form.memberId,
      loanDate: today(), dueDate: addDays(today(), parseInt(form.days)),
      returned: false,
    }];
    save(K.LOANS, newLoans);
    setLoans(newLoans);
    setModal(false);
  };

  const handleReturn = (id) => {
    if (!window.confirm('Kitob qaytarilganini tasdiqlaysizmi?')) return;
    const allBooks = load(K.BOOKS);
    const loan = loans.find(l => l.id === id);
    if (loan) {
      const bi = allBooks.findIndex(b => b.id === loan.bookId);
      if (bi >= 0) {
        allBooks[bi].available = Math.min(allBooks[bi].count, allBooks[bi].available + 1);
        save(K.BOOKS, allBooks);
      }
    }
    const updated = loans.map(l => l.id === id ? { ...l, returned: true, returnDate: today() } : l);
    save(K.LOANS, updated);
    setLoans(updated);
  };

  const avBooks = books.filter(b => b.available > 0);

  return (
    <div className="page-enter">
      <PageHeader
        title="Kitob berish"
        subtitle="Kitob berish va qaytarish jarayoni"
        action={isAdmin && (
          <Btn variant="primary" onClick={() => {
            setForm({ bookId: avBooks[0]?.id || '', memberId: members[0]?.id || '', days: 14 });
            setModal(true);
          }}>+ Kitob berish</Btn>
        )}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
        <StatCard label="Berilgan" value={active.length} icon="🔄" color="blue" />
        <StatCard label="Kechikkan" value={overdue.length} icon="⚠️" color="red" />
        <StatCard label="Qaytarilgan" value={returned.length} icon="✅" color="green" />
      </div>

      <Card>
        <Tabs
          active={tab}
          onChange={setTab}
          tabs={[
            { id: 'active',   label: `📤 Berilgan (${active.length})` },
            { id: 'returned', label: `📥 Qaytarilgan (${returned.length})` },
          ]}
        />

        {tab === 'active' && (
          active.length ? (
            <Table headers={['Kitob', "A'zo", 'Berilgan', 'Muddat', 'Holat', ...(isAdmin ? ['Amal'] : [])]}>
              {active.map(l => {
                const b  = books.find(x => x.id === l.bookId);
                const m  = members.find(x => x.id === l.memberId);
                const od = isOverdue(l.dueDate);
                return (
                  <TR key={l.id} highlight={od}>
                    <TD><span style={{ color: 'var(--text)', fontWeight: 600 }}>{b?.title || '—'}</span></TD>
                    <TD>{m?.name || 'Demo'}</TD>
                    <TD style={{ fontVariantNumeric: 'tabular-nums' }}>{l.loanDate}</TD>
                    <TD style={{ fontVariantNumeric: 'tabular-nums' }}>{l.dueDate}</TD>
                    <TD><Badge color={od ? 'red' : 'blue'}>{od ? '⚠ Kechikdi' : '● Muddatda'}</Badge></TD>
                    {isAdmin && (
                      <TD>
                        <Btn size="sm" variant="success" onClick={() => handleReturn(l.id)}>✓ Qaytarildi</Btn>
                      </TD>
                    )}
                  </TR>
                );
              })}
            </Table>
          ) : <Empty icon="📤" message="Berilgan kitob yo'q" />
        )}

        {tab === 'returned' && (
          returned.length ? (
            <Table headers={['Kitob', "A'zo", 'Berilgan', 'Muddat', 'Qaytarilgan']}>
              {[...returned].reverse().map(l => {
                const b = books.find(x => x.id === l.bookId);
                const m = members.find(x => x.id === l.memberId);
                return (
                  <TR key={l.id}>
                    <TD><span style={{ color: 'var(--text)', fontWeight: 600 }}>{b?.title || '—'}</span></TD>
                    <TD>{m?.name || 'Demo'}</TD>
                    <TD style={{ fontVariantNumeric: 'tabular-nums' }}>{l.loanDate}</TD>
                    <TD style={{ fontVariantNumeric: 'tabular-nums' }}>{l.dueDate}</TD>
                    <TD><Badge color="green">✓ {l.returnDate || '—'}</Badge></TD>
                  </TR>
                );
              })}
            </Table>
          ) : <Empty icon="📥" message="Qaytarilgan kitob yo'q" />
        )}
      </Card>

      {modal && (
        <Modal title="Kitob berish" onClose={() => setModal(false)}>
          <FormGroup label="Kitob">
            <Select value={form.bookId} onChange={e => setForm(p => ({ ...p, bookId: e.target.value }))}>
              {avBooks.map(b => <option key={b.id} value={b.id}>{b.title} (mavjud: {b.available})</option>)}
            </Select>
          </FormGroup>
          <FormGroup label="A'zo">
            <Select value={form.memberId} onChange={e => setForm(p => ({ ...p, memberId: e.target.value }))}>
              {members.map(m => <option key={m.id} value={m.id}>{m.name} (@{m.username || m.id})</option>)}
            </Select>
          </FormGroup>
          <FormGroup label="Muddati">
            <Select value={form.days} onChange={e => setForm(p => ({ ...p, days: e.target.value }))}>
              {[7, 14, 21, 30].map(d => <option key={d} value={d}>{d} kun</option>)}
            </Select>
          </FormGroup>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            <Btn onClick={() => setModal(false)}>Bekor qilish</Btn>
            <Btn variant="primary" onClick={handleLoan}>📤 Berish</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
