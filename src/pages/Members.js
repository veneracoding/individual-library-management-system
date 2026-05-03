import React, { useState } from 'react';
import { load, save, K } from '../utils';
import { PageHeader, Card, Table, TR, TD, Btn, Input, Badge, Empty } from '../components/UI';

export default function Members() {
  const [members, setMembers] = useState(() => load(K.MEMBERS));
  const [search, setSearch] = useState('');
  const loans = load(K.LOANS);

  const filtered = search
    ? members.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.phone?.includes(search) ||
        m.username?.includes(search)
      )
    : members;

  const handleDelete = (id) => {
    if (!window.confirm("Bu a'zoni o'chirmoqchimisiz?")) return;
    const updated = members.filter(m => m.id !== id);
    save(K.MEMBERS, updated);
    setMembers(updated);
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="A'zolar"
        subtitle={`Jami ${members.length} nafar ro'yxatdan o'tgan`}
      />
      <Card>
        <div style={{ marginBottom: '1rem' }}>
          <Input
            placeholder="🔍 Ism, username yoki telefon qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {filtered.length ? (
          <Table headers={['#', 'Ism', 'Username', 'Telefon', 'Email', 'Sana', 'Kitoblar', 'Amal']}>
            {filtered.map((m, i) => {
              const active = loans.filter(l => l.memberId === m.id && !l.returned).length;
              return (
                <TR key={m.id}>
                  <TD style={{ color: 'var(--text3)', width: 36 }}>{i + 1}</TD>
                  <TD><span style={{ color: 'var(--text)', fontWeight: 600 }}>{m.name}</span></TD>
                  <TD><span style={{ color: 'var(--accent)', fontSize: 12 }}>@{m.username || '—'}</span></TD>
                  <TD>{m.phone || '—'}</TD>
                  <TD>{m.email || '—'}</TD>
                  <TD style={{ fontVariantNumeric: 'tabular-nums' }}>{m.date}</TD>
                  <TD><Badge color={active > 0 ? 'blue' : 'default'}>{active} ta</Badge></TD>
                  <TD><Btn size="sm" variant="danger" onClick={() => handleDelete(m.id)}>🗑</Btn></TD>
                </TR>
              );
            })}
          </Table>
        ) : <Empty icon="👥" message="A'zo topilmadi" />}
      </Card>
    </div>
  );
}
