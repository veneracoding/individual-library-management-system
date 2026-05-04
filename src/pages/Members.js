import React, { useState } from 'react';
import { load, save, K } from '../utils';
import { PageHeader, Card, Table, TR, TD, Btn, Badge, Empty, SearchBar } from '../components/UI';

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

      <SearchBar
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Ism, username yoki telefon qidirish..."
      >
        <span style={{ fontSize: 12, color: 'var(--text3)', whiteSpace: 'nowrap' }}>
          {filtered.length} ta
        </span>
      </SearchBar>

      <Card>
        {filtered.length ? (
          <Table headers={['#', 'Ism', 'Username', 'Telefon', 'Email', 'Sana', 'Kitoblar', 'Amal']}>
            {filtered.map((m, i) => {
              const active = loans.filter(l => l.memberId === m.id && !l.returned).length;
              return (
                <TR key={m.id}>
                  <TD style={{ color: 'var(--text3)', width: 36 }}>{i + 1}</TD>
                  <TD>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, color: '#fff', fontWeight: 700, flexShrink: 0,
                      }}>{m.name?.charAt(0) || '?'}</div>
                      <span style={{ color: 'var(--text)', fontWeight: 600 }}>{m.name}</span>
                    </div>
                  </TD>
                  <TD><span style={{ color: 'var(--accent)', fontSize: 12 }}>@{m.username || '—'}</span></TD>
                  <TD>{m.phone || '—'}</TD>
                  <TD>{m.email || '—'}</TD>
                  <TD style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12 }}>{m.date}</TD>
                  <TD><Badge color={active > 0 ? 'blue' : 'default'}>{active} ta</Badge></TD>
                  <TD><Btn size="sm" variant="danger" onClick={() => handleDelete(m.id)}>O'chirish</Btn></TD>
                </TR>
              );
            })}
          </Table>
        ) : <Empty icon="👥" message="A'zo topilmadi" />}
      </Card>
    </div>
  );
}
