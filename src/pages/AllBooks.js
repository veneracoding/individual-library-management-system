import React, { useState } from 'react';
import { load, K } from '../utils';
import { useLang } from '../context/LangContext';
import { PageHeader, Card, StatCard, Badge, Table, TR, TD, SearchBar } from '../components/UI';

export default function AllBooks() {
  const { t } = useLang();
  const books = load(K.BOOKS);
  const loans = load(K.LOANS);
  const reviews = load(K.REVIEWS || 'lib_reviews');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('mostRead');

  const totalCopies = books.reduce((s, b) => s + b.count, 0);
  const totalAvailable = books.reduce((s, b) => s + b.available, 0);
  const totalBorrowed = totalCopies - totalAvailable;

  // Count loans per book
  const loanCount = {};
  loans.forEach(l => { loanCount[l.bookId] = (loanCount[l.bookId] || 0) + 1; });

  // Avg rating per book
  const avgRating = {};
  books.forEach(b => {
    const rv = reviews.filter(r => r.bookId === b.id);
    avgRating[b.id] = rv.length ? (rv.reduce((s, r) => s + r.rating, 0) / rv.length) : 0;
  });

  const enriched = books.map(b => ({
    ...b,
    timesLoaned: loanCount[b.id] || 0,
    rating: avgRating[b.id] || 0,
    reviewCount: reviews.filter(r => r.bookId === b.id).length,
  }));

  const filtered = enriched
    .filter(b => {
      const q = search.toLowerCase();
      return !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sort === 'mostRead') return b.timesLoaned - a.timesLoaned;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'available') return b.available - a.available;
      if (sort === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  // Top 3 most read
  const top3 = [...enriched].sort((a, b) => b.timesLoaned - a.timesLoaned).slice(0, 3);

  return (
    <div className="page-enter">
      <PageHeader
        title={t('allBooksTitle')}
        subtitle={`${books.length} xil nom · ${totalCopies} nusxa`}
      />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
        <StatCard label="Kitob turlari" value={books.length} icon="📚" color="blue" />
        <StatCard label={t('totalCopies')} value={totalCopies} icon="📦" />
        <StatCard label={t('available')} value={totalAvailable} icon="✅" color="green" />
        <StatCard label={t('borrowedNow')} value={totalBorrowed} icon="🔄" color="amber" />
      </div>

      {/* Top 3 podium */}
      <Card style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>
          🏆 {t('mostRead')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {top3.map((b, i) => (
            <div key={b.id} style={{
              background: 'var(--bg3)', borderRadius: 12, padding: '1rem',
              border: `1px solid ${i === 0 ? 'rgba(251,191,36,0.3)' : i === 1 ? 'rgba(148,163,184,0.3)' : 'rgba(180,83,9,0.3)'}`,
              display: 'flex', gap: 12, alignItems: 'center',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: i === 0 ? 'rgba(251,191,36,0.15)' : i === 1 ? 'rgba(148,163,184,0.15)' : 'rgba(180,83,9,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>{['🥇', '🥈', '🥉'][i]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{b.author}</div>
                <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>{b.timesLoaned} marta o'qilgan</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Full table */}
      <Card>
        <SearchBar value={search} onChange={e => setSearch(e.target.value)} placeholder="Kitob yoki muallif qidirish..." style={{ marginBottom: '1rem' }}>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            padding: '9px 28px 9px 10px', background: 'var(--bg3)',
            border: '1px solid var(--border)', borderRadius: 10,
            color: 'var(--text)', fontSize: 12, cursor: 'pointer',
            fontFamily: 'var(--font-body)', outline: 'none',
          }}>
            <option value="mostRead">Ko'p o'qilgan</option>
            <option value="rating">Reyting</option>
            <option value="available">Mavjud</option>
            <option value="title">Sarlavha</option>
          </select>
          <span style={{ fontSize: 12, color: 'var(--text3)', whiteSpace: 'nowrap' }}>{filtered.length} ta</span>
        </SearchBar>

        <Table headers={['#', 'Kitob', t('author'), t('genre'), 'O\'qilgan', 'Reyting', t('available'), t('total'), 'Holat']}>
          {filtered.map((b, i) => (
            <TR key={b.id}>
              <TD style={{ color: 'var(--text3)', width: 36 }}>{i + 1}</TD>
              <TD>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {b.image
                    ? <img src={b.image} alt="" style={{ width: 32, height: 44, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                    : <div style={{ width: 32, height: 44, borderRadius: 4, background: b.coverColor || '#5b8df6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📖</div>
                  }
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{b.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{b.year}</div>
                  </div>
                </div>
              </TD>
              <TD style={{ fontSize: 12 }}>{b.author}</TD>
              <TD><Badge>{b.genre}</Badge></TD>
              <TD>
                <span style={{ fontSize: 13, fontWeight: 600, color: b.timesLoaned > 5 ? 'var(--success)' : 'var(--text2)' }}>
                  {b.timesLoaned}x
                </span>
              </TD>
              <TD>
                {b.rating > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#fbbf24', fontSize: 12 }}>★</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{b.rating.toFixed(1)}</span>
                    <span style={{ fontSize: 10, color: 'var(--text3)' }}>({b.reviewCount})</span>
                  </div>
                ) : <span style={{ fontSize: 11, color: 'var(--text3)' }}>—</span>}
              </TD>
              <TD>
                <span style={{ fontWeight: 600, color: b.available > 0 ? 'var(--success)' : 'var(--danger)' }}>{b.available}</span>
              </TD>
              <TD style={{ color: 'var(--text2)' }}>{b.count}</TD>
              <TD>
                <Badge color={b.available === 0 ? 'red' : b.available < b.count / 2 ? 'amber' : 'green'}>
                  {b.available === 0 ? 'Tugagan' : b.available < b.count / 2 ? 'Kam' : 'Yetarli'}
                </Badge>
              </TD>
            </TR>
          ))}
        </Table>
      </Card>
    </div>
  );
}
