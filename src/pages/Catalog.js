import React, { useState, useRef } from 'react';
import { load, save, K, uid, today } from '../utils';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { Btn, Badge } from '../components/UI';

const GENRE_KEYS = ['Roman', 'Darslik', 'Texnik', "She'riyat", 'Tarix', 'Detektiv', 'Bolalar', 'Boshqa'];

/* ── Stars ── */
function Stars({ value, max = 5, onChange, size = 18 }) {
  const [hov, setHov] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i}
          onClick={() => onChange && onChange(i + 1)}
          onMouseEnter={() => onChange && setHov(i + 1)}
          onMouseLeave={() => onChange && setHov(0)}
          style={{
            fontSize: size, cursor: onChange ? 'pointer' : 'default', lineHeight: 1,
            color: (hov || value) > i ? '#fbbf24' : 'var(--bg5)',
            transition: 'color 0.1s, transform 0.1s',
            transform: onChange && hov > i ? 'scale(1.2)' : 'scale(1)',
            display: 'inline-block',
          }}>★</span>
      ))}
    </div>
  );
}

/* ── Book Cover ── */
function BookCover({ book, size = 'md' }) {
  const sizes = { sm: { w: 72, h: 100 }, md: { w: 130, h: 185 }, lg: { w: 180, h: 255 } };
  const { w, h } = sizes[size];
  if (book.image) {
    return (
      <img src={book.image} alt={book.title}
        style={{ width: w, height: h, objectFit: 'cover', borderRadius: size === 'sm' ? 6 : 10, display: 'block', flexShrink: 0 }}
      />
    );
  }
  return (
    <div style={{
      width: w, height: h, borderRadius: size === 'sm' ? 6 : 10, flexShrink: 0,
      background: `linear-gradient(150deg, ${book.coverColor || '#5b8df6'} 0%, ${book.coverColor || '#5b8df6'}99 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 12, position: 'relative', overflow: 'hidden',
      boxShadow: `0 8px 24px ${book.coverColor || '#5b8df6'}33`,
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 7, background: 'rgba(0,0,0,0.25)' }} />
      <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(255,255,255,0.12) 0%,transparent 55%)' }} />
      <svg width={size === 'sm' ? 22 : 28} height={size === 'sm' ? 22 : 28}
        viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)"
        style={{ marginBottom: 8, position: 'relative' }}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
      <span style={{
        fontSize: size === 'sm' ? 10 : 12, fontWeight: 700, color: '#fff',
        textAlign: 'center', lineHeight: 1.3, position: 'relative',
        textShadow: '0 1px 3px rgba(0,0,0,0.4)',
        overflow: 'hidden', maxHeight: size === 'sm' ? 44 : 72,
      }}>{book.title}</span>
      {size !== 'sm' && (
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 5, position: 'relative', textAlign: 'center' }}>
          {book.author}
        </span>
      )}
    </div>
  );
}

/* ── PDF Reader overlay ── */
function PdfReader({ url, title, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 52, background: 'var(--bg2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: 12, flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: 'var(--danger-bg)', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--danger)', borderRadius: 8, padding: '5px 14px', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
          ✕ Yopish
        </button>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{title}</span>
        <a href={url} download style={{ marginLeft: 'auto', background: 'var(--accent)', color: '#fff', borderRadius: 8, padding: '5px 14px', cursor: 'pointer', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
          ⬇ Yuklab olish
        </a>
      </div>
      <iframe src={url} style={{ flex: 1, border: 'none', background: '#525659' }} title={title} />
    </div>
  );
}

/* ── Book Detail Modal ── */
function BookDetailModal({ book: initialBook, onClose, onUpdate, isAdmin }) {
  const { user } = useAuth();
  const { t } = useLang();
  const [book, setBook] = useState(initialBook);
  const [showPdf, setShowPdf] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [editReview, setEditReview] = useState(false);
  const imgRef = useRef();
  const pdfRef = useRef();

  const reviews = load(K.REVIEWS).filter(r => r.bookId === book.id);
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const userId = user?.id || user?.username;
  const myReview = reviews.find(r => r.userId === userId);

  // Pre-fill if already reviewed
  React.useEffect(() => {
    if (myReview) { setNewRating(myReview.rating); setNewComment(myReview.comment || ''); }
  }, []);

  const updateBook = (changes) => {
    const books = load(K.BOOKS);
    const i = books.findIndex(b => b.id === book.id);
    if (i >= 0) {
      books[i] = { ...books[i], ...changes };
      save(K.BOOKS, books);
      setBook(books[i]);
      onUpdate(books[i]);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert("Rasm 3MB dan kichik bo'lsin!"); return; }
    const r = new FileReader();
    r.onload = ev => updateBook({ image: ev.target.result });
    r.readAsDataURL(file);
  };

  const handlePdf = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 20 * 1024 * 1024) { alert("PDF 20MB dan kichik bo'lsin!"); return; }
    const r = new FileReader();
    r.onload = ev => updateBook({ pdfUrl: ev.target.result });
    r.readAsDataURL(file);
  };

  const submitReview = () => {
    if (!newRating) { alert("Baholang!"); return; }
    const all = load(K.REVIEWS);
    const idx = all.findIndex(r => r.bookId === book.id && r.userId === userId);
    const entry = { id: uid(), bookId: book.id, userId, userName: user?.name, rating: newRating, comment: newComment, date: today() };
    if (idx >= 0) all[idx] = entry; else all.push(entry);
    save(K.REVIEWS, all);
    setEditReview(false);
    setTimeout(() => window.location.reload(), 80);
  };

  const deleteReview = (id) => {
    if (!window.confirm("O'chirmoqchimisiz?")) return;
    save(K.REVIEWS, load(K.REVIEWS).filter(r => r.id !== id));
    setTimeout(() => window.location.reload(), 80);
  };

  return (
    <>
      {showPdf && book.pdfUrl && (
        <PdfReader url={book.pdfUrl} title={book.title} onClose={() => setShowPdf(false)} />
      )}

      {/* Overlay */}
      <div
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem',
        }}
      >
        {/* Modal box */}
        <div className="scale-in" style={{
          background: 'var(--bg2)', border: '1px solid var(--border2)',
          borderRadius: 20, width: '100%', maxWidth: 800,
          maxHeight: '92vh', overflowY: 'auto',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}>

          {/* ── TOP SECTION: cover LEFT, everything else RIGHT ── */}
          <div style={{ display: 'flex', gap: 0, padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>

            {/* LEFT column: cover image only */}
            <div style={{ flexShrink: 0, marginRight: '1.5rem' }}>
              <BookCover book={book} size="lg" />
            </div>

            {/* RIGHT column: title, meta, actions */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

              {/* Title + close button row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ flex: 1, paddingRight: 10 }}>
                  <h2 style={{
                    fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
                    color: 'var(--text)', letterSpacing: '-0.3px', marginBottom: 3, lineHeight: 1.25,
                  }}>{book.title}</h2>
                  <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                    by <span style={{ fontWeight: 600 }}>{book.author}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    flexShrink: 0, width: 30, height: 30, borderRadius: 8,
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    color: 'var(--text3)', cursor: 'pointer', fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text3)'; }}
                >✕</button>
              </div>

              {/* Rating summary */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                {avgRating ? (
                  <>
                    <Stars value={parseFloat(avgRating)} size={14} />
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#fbbf24' }}>{avgRating}</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>({reviews.length} ta baholash)</span>
                  </>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>Hali baholanmagan</span>
                )}
              </div>

              {/* Meta info 2-col grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 12 }}>
                {[
                  ['📅', t('year'),      book.year || '—'],
                  ['📚', t('genre'),     book.genre],
                  ['📄', t('pages'),     book.pages ? `${book.pages} bet` : '—'],
                  ['🏠', t('publisher'), book.publisher || '—'],
                  ['🌐', t('language'),  book.language || '—'],
                  ['📦', t('available'), `${book.available} / ${book.count}`],
                ].map(([icon, label, val]) => (
                  <div key={label} style={{
                    background: 'var(--bg3)', borderRadius: 8,
                    padding: '7px 10px', border: '1px solid var(--border)',
                  }}>
                    <div style={{ fontSize: 9, color: 'var(--text3)', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 2 }}>
                      {icon} {label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Status badges */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                <Badge color={book.available > 0 ? 'green' : 'red'}>
                  {book.available > 0 ? `✓ ${book.available} ta mavjud` : '✗ Mavjud emas'}
                </Badge>
                {book.pdfUrl && <Badge color="blue">📄 Onlayn o'qish mavjud</Badge>}
              </div>

              {/* Action buttons — all in one row */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {/* Read online for everyone */}
                {book.pdfUrl && (
                  <Btn size="sm" variant="primary" onClick={() => setShowPdf(true)}>
                    📖 {t('readOnline')}
                  </Btn>
                )}

                {/* Admin-only controls */}
                {isAdmin && (
                  <>
                    <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
                    <input ref={pdfRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handlePdf} />

                    <Btn size="sm" onClick={() => imgRef.current.click()}>
                      🖼 {t('uploadImage')}
                    </Btn>
                    {book.image && (
                      <Btn size="sm" variant="danger" onClick={() => updateBook({ image: '' })}>
                        ✕ {t('removeImage')}
                      </Btn>
                    )}
                    <Btn size="sm" variant="success" onClick={() => pdfRef.current.click()}>
                      📄 {t('uploadPdf')}
                    </Btn>
                    {book.pdfUrl && (
                      <Btn size="sm" variant="danger" onClick={() => updateBook({ pdfUrl: '' })}>
                        ✕ {t('removePdf')}
                      </Btn>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── DESCRIPTION ── */}
          {book.description && (
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>
                {t('aboutBook')}
              </div>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8, margin: 0 }}>{book.description}</p>
            </div>
          )}

          {/* ── REVIEWS ── */}
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                💬 {t('readersOpinion')} ({reviews.length})
              </div>
              {myReview && !editReview && (
                <Btn size="sm" onClick={() => setEditReview(true)}>✏️ Tahrirlash</Btn>
              )}
            </div>

            {/* Add / Edit review form */}
            {(!myReview || editReview) && (
              <div style={{
                background: 'var(--bg3)', borderRadius: 12,
                padding: '1rem 1.25rem', marginBottom: '1rem',
                border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
                  {myReview ? 'Izohni yangilash' : t('yourOpinion')}
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 5 }}>{t('rateBook')}:</div>
                  <Stars value={newRating} onChange={setNewRating} size={24} />
                </div>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Kitob haqida fikringizni yozing... (ixtiyoriy)"
                  rows={3}
                  style={{
                    width: '100%', padding: '9px 12px',
                    background: 'var(--bg2)', border: '1px solid var(--border)',
                    borderRadius: 9, color: 'var(--text)', fontSize: 13,
                    resize: 'vertical', fontFamily: 'var(--font-body)',
                    outline: 'none', marginBottom: 10,
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  {editReview && (
                    <Btn size="sm" onClick={() => setEditReview(false)}>{t('cancel')}</Btn>
                  )}
                  <Btn size="sm" variant="primary" onClick={submitReview}>
                    {myReview ? `✓ ${t('update')}` : `⭐ ${t('submitRating')}`}
                  </Btn>
                </div>
              </div>
            )}

            {/* Review list */}
            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...reviews].reverse().map(r => (
                  <div key={r.id} style={{
                    background: 'var(--bg3)', borderRadius: 10,
                    padding: '10px 14px', border: '1px solid var(--border)',
                    borderLeft: `3px solid ${r.rating >= 4 ? 'var(--success)' : r.rating >= 3 ? 'var(--warning)' : 'var(--danger)'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'var(--accent-soft)', color: 'var(--accent)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700,
                        }}>{r.userName?.charAt(0) || '?'}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{r.userName || 'Anonim'}</div>
                          <div style={{ fontSize: 10, color: 'var(--text3)' }}>{r.date}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Stars value={r.rating} size={13} />
                        {(isAdmin || r.userId === userId) && (
                          <button
                            onClick={() => deleteReview(r.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 14, padding: 2 }}
                          >🗑</button>
                        )}
                      </div>
                    </div>
                    {r.comment && (
                      <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65, margin: 0 }}>{r.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)', fontSize: 13 }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>💬</div>
                {t('noReviews')}. Birinchi bo'ling!
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

/* ── Book Card ── */
function BookCard({ book, onClick }) {
  const reviews = load(K.REVIEWS).filter(r => r.bookId === book.id);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.25)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {/* Cover area */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1.25rem 1rem 0.75rem', background: 'var(--bg3)', position: 'relative' }}>
        <BookCover book={book} size="md" />
        {book.pdfUrl && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: 'var(--accent)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 5 }}>PDF</div>
        )}
        {book.available === 0 && (
          <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 9, fontWeight: 600, padding: '3px 9px', borderRadius: 5, whiteSpace: 'nowrap' }}>Mavjud emas</div>
        )}
      </div>
      {/* Info area */}
      <div style={{ padding: '0.75rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{book.title}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{book.author}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <Stars value={avg} size={11} />
          {reviews.length > 0 && <span style={{ fontSize: 10, color: 'var(--text3)' }}>({reviews.length})</span>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
          <Badge color={book.available > 0 ? 'green' : 'red'}>
            {book.available > 0 ? `${book.available} mavjud` : 'Tugagan'}
          </Badge>
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>{book.year}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Catalog Page ── */
export default function Catalog() {
  const { user } = useAuth();
  const { t } = useLang();
  const isAdmin = user?.role === 'admin';
  const [books, setBooks] = useState(() => load(K.BOOKS));
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('Barchasi');
  const [sortBy, setSortBy] = useState('title');
  const [avOnly, setAvOnly] = useState(false);

  const reviews = load(K.REVIEWS);
  const avgRatings = {};
  books.forEach(b => {
    const rv = reviews.filter(r => r.bookId === b.id);
    avgRatings[b.id] = rv.length ? rv.reduce((s, r) => s + r.rating, 0) / rv.length : 0;
  });

  const filtered = books
    .filter(b => {
      const q = search.toLowerCase();
      return (
        (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) &&
        (genre === 'Barchasi' || b.genre === genre) &&
        (!avOnly || b.available > 0)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'title')  return a.title.localeCompare(b.title);
      if (sortBy === 'author') return a.author.localeCompare(b.author);
      if (sortBy === 'year')   return (b.year || 0) - (a.year || 0);
      if (sortBy === 'rating') return (avgRatings[b.id] || 0) - (avgRatings[a.id] || 0);
      return 0;
    });

  const genreCounts = {};
  books.forEach(b => { genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1; });

  return (
    <div className="page-enter">

      {/* ── Search bar (single clean row) ── */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 14, padding: '0.75rem 1rem',
        marginBottom: '1rem',
        display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
      }}>
        {/* Search input with icon */}
        <div style={{ flex: 1, minWidth: 160, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ position: 'absolute', left: 10, color: 'var(--text3)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '8px 10px 8px 32px',
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 9, color: 'var(--text)', fontSize: 13,
              outline: 'none', fontFamily: 'var(--font-body)',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Sort select */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            padding: '8px 10px', background: 'var(--bg3)',
            border: '1px solid var(--border)', borderRadius: 9,
            color: 'var(--text)', fontSize: 12, cursor: 'pointer',
            fontFamily: 'var(--font-body)', outline: 'none',
          }}
        >
          <option value="title">{t('sortTitle')}</option>
          <option value="author">{t('sortAuthor')}</option>
          <option value="year">{t('sortYear')}</option>
          <option value="rating">{t('sortRating')}</option>
        </select>

        {/* Available only toggle */}
        <button
          onClick={() => setAvOnly(v => !v)}
          style={{
            padding: '8px 12px', borderRadius: 9, cursor: 'pointer',
            fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-body)',
            transition: 'all 0.15s', whiteSpace: 'nowrap',
            background: avOnly ? 'var(--success-bg)' : 'var(--bg3)',
            color: avOnly ? 'var(--success)' : 'var(--text3)',
            border: avOnly ? '1px solid rgba(52,211,153,0.3)' : '1px solid var(--border)',
          }}
        >
          {avOnly ? '✓' : '○'} {t('onlyAvailable')}
        </button>

        <span style={{ fontSize: 12, color: 'var(--text3)', whiteSpace: 'nowrap' }}>
          {filtered.length} {t('results')}
        </span>
      </div>

      {/* ── Genre chip filters ── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setGenre('Barchasi')}
          style={{
            padding: '5px 14px', borderRadius: 20, cursor: 'pointer',
            fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-body)',
            transition: 'all 0.15s',
            background: genre === 'Barchasi' ? 'var(--accent)' : 'var(--bg2)',
            color: genre === 'Barchasi' ? '#fff' : 'var(--text3)',
            border: genre === 'Barchasi' ? '1px solid transparent' : '1px solid var(--border)',
          }}
        >{t('all')} ({books.length})</button>

        {GENRE_KEYS.filter(g => genreCounts[g] > 0).map(g => (
          <button
            key={g}
            onClick={() => setGenre(prev => prev === g ? 'Barchasi' : g)}
            style={{
              padding: '5px 14px', borderRadius: 20, cursor: 'pointer',
              fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-body)',
              transition: 'all 0.15s',
              background: genre === g ? 'var(--accent)' : 'var(--bg2)',
              color: genre === g ? '#fff' : 'var(--text3)',
              border: genre === g ? '1px solid transparent' : '1px solid var(--border)',
            }}
          >{g} ({genreCounts[g]})</button>
        ))}
      </div>

      {/* ── Book cards grid ── */}
      {filtered.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
          gap: '1rem',
        }}>
          {filtered.map(book => (
            <BookCard key={book.id} book={book} onClick={() => setSelected(book)} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text3)' }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            style={{ marginBottom: 14, opacity: 0.35 }}>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Kitob topilmadi</div>
          <div style={{ fontSize: 13 }}>Qidiruvni o'zgartiring yoki filtrni tozalang</div>
        </div>
      )}

      {/* ── Book detail modal ── */}
      {selected && (
        <BookDetailModal
          book={selected}
          onClose={() => setSelected(null)}
          onUpdate={b => {
            setBooks(prev => prev.map(x => x.id === b.id ? b : x));
            setSelected(b);
          }}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
