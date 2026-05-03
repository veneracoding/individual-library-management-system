// Reports page (Members and Loans are now separate files)
import React from 'react';
import { load, K, isOverdue } from '../utils';
import { PageHeader, Card, StatCard, Badge, Table, TR, TD, Empty } from '../components/UI';

export function Reports() {
  const books   = load(K.BOOKS);
  const members = load(K.MEMBERS);
  const loans   = load(K.LOANS);
  const active  = loans.filter(l => !l.returned);
  const overdue = active.filter(l => isOverdue(l.dueDate));
  const returned = loans.filter(l => l.returned);

  const bookCount = {};
  loans.forEach(l => { bookCount[l.bookId] = (bookCount[l.bookId] || 0) + 1; });
  const topBooks = Object.entries(bookCount).sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([id, cnt]) => ({ book: books.find(x => x.id === id), cnt }));

  const debtors = [...new Set(overdue.map(l => l.memberId))].map(mid => ({
    member: members.find(x => x.id === mid),
    cnt: overdue.filter(l => l.memberId === mid).length,
  }));

  return (
    <div className="page-enter">
      <PageHeader title="Hisobotlar" subtitle="Kutubxona statistikasi va to'liq tahlil" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
        <StatCard label="Jami berishlar" value={loans.length} color="blue" icon="📊" />
        <StatCard label="Qaytarilgan" value={returned.length} color="green" icon="✅" />
        <StatCard label="Hozirda berilgan" value={active.length} icon="🔄" />
        <StatCard label="Kechikkan" value={overdue.length} color="red" icon="⚠️" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: '1rem', color: 'var(--text)' }}>Eng ko'p o'qilgan</div>
          {topBooks.length ? (
            <Table headers={['Kitob', 'Muallif', 'Marta']}>
              {topBooks.map(({ book, cnt }, i) => (
                <TR key={i}>
                  <TD><span style={{ color: 'var(--text)', fontWeight: 600 }}>{['🥇','🥈','🥉'][i] || `${i+1}.`} {book?.title || '—'}</span></TD>
                  <TD>{book?.author || '—'}</TD>
                  <TD><Badge color="blue">{cnt}x</Badge></TD>
                </TR>
              ))}
            </Table>
          ) : <Empty icon="📚" message="Ma'lumot yo'q" />}
        </Card>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: '1rem', color: 'var(--text)' }}>Qarzdor a'zolar</div>
          {debtors.length ? (
            <Table headers={["A'zo", 'Kechikkan']}>
              {debtors.map(({ member, cnt }, i) => (
                <TR key={i}>
                  <TD><span style={{ color: 'var(--text)', fontWeight: 600 }}>{member?.name || 'Demo'}</span></TD>
                  <TD><Badge color="red">{cnt} kitob</Badge></TD>
                </TR>
              ))}
            </Table>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
              <div style={{ color: 'var(--success)', fontSize: 14, fontWeight: 600 }}>Barcha kitoblar muddatida!</div>
            </div>
          )}
        </Card>
      </div>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: '1rem', color: 'var(--text)' }}>Kitoblar to'liq statistikasi</div>
        <Table headers={['Kitob', 'Muallif', 'Janr', 'Jami', 'Mavjud', 'Berilgan', 'Holat']}>
          {books.map(b => (
            <TR key={b.id}>
              <TD><span style={{ color: 'var(--text)', fontWeight: 600 }}>{b.title}</span></TD>
              <TD>{b.author}</TD>
              <TD><Badge>{b.genre}</Badge></TD>
              <TD>{b.count}</TD>
              <TD>{b.available}</TD>
              <TD>{b.count - b.available}</TD>
              <TD><Badge color={b.available === 0 ? 'red' : b.available < b.count / 2 ? 'amber' : 'green'}>{b.available === 0 ? 'Tugagan' : b.available < b.count / 2 ? 'Kam' : 'Yetarli'}</Badge></TD>
            </TR>
          ))}
        </Table>
      </Card>
    </div>
  );
}
