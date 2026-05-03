import React, { useState, useRef } from 'react';
import { load, save, K, uid } from '../utils';
import { PageHeader, Card, Badge, Table, TR, TD, Btn, Modal, FormGroup, Input, Select, Textarea, Empty } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const GENRES = ['Roman', 'Darslik', 'Texnik', "She'riyat", 'Tarix', 'Detektiv', 'Boshqa'];
const COLORS = ['#7c3aed','#0891b2','#b45309','#0f766e','#1d4ed8','#7f1d1d','#374151','#0e7490','#065f46','#92400e'];
const empty = { title: '', author: '', year: '', genre: 'Roman', count: 1, coverColor: '#5b8df6', description: '', pages: '', publisher: '', language: "O'zbek", image: '' };

export default function Books() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [books, setBooks] = useState(() => load(K.BOOKS));
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('Barchasi');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const fileRef = useRef();

  const filtered = books.filter(b => {
    const q = search.toLowerCase();
    return (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
      && (genreFilter === 'Barchasi' || b.genre === genreFilter);
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Rasm 2MB dan kichik bo'lishi kerak!"); return; }
    const reader = new FileReader();
    reader.onload = ev => setForm(p => ({ ...p, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.author.trim()) return alert("Kitob nomi va muallif majburiy!");
    const count = parseInt(form.count) || 1;
    let updated;
    if (modal === 'add') {
      updated = [...books, { id: uid(), ...form, count, available: count }];
    } else {
      updated = books.map(b => {
        if (b.id !== modal) return b;
        const diff = count - b.count;
        return { ...b, ...form, count, available: Math.max(0, b.available + diff) };
      });
    }
    save(K.BOOKS, updated); setBooks(updated); setModal(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu kitobni o'chirmoqchimisiz?")) return;
    save(K.BOOKS, books.filter(b => b.id !== id));
    setBooks(books.filter(b => b.id !== id));
  };

  const openEdit = (b) => {
    setForm({ title: b.title, author: b.author, year: b.year || '', genre: b.genre, count: b.count, coverColor: b.coverColor || '#5b8df6', description: b.description || '', pages: b.pages || '', publisher: b.publisher || '', language: b.language || "O'zbek", image: b.image || '' });
    setModal(b.id);
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Kitoblar"
        subtitle={`Jami ${books.length} xil, ${books.reduce((s, b) => s + b.count, 0)} nusxa`}
        action={isAdmin && <Btn variant="primary" onClick={() => { setForm(empty); setModal('add'); }}>+ Kitob qo'shish</Btn>}
      />
      <Card>
        <div style={{ display: 'flex', gap: 10, marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Input style={{ flex: 1, minWidth: 200 }} placeholder="Kitob yoki muallif qidirish..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <Select style={{ width: 160 }} value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
            <option>Barchasi</option>
            {GENRES.map(g => <option key={g}>{g}</option>)}
          </Select>
        </div>
        {filtered.length ? (
          <Table headers={['#', 'Muqova', 'Kitob nomi', 'Muallif', 'Yil', 'Janr', 'Mavjud', 'Jami', ...(isAdmin ? ['Amallar'] : [])]}>
            {filtered.map((b, i) => (
              <TR key={b.id}>
                <TD style={{ color: 'var(--text3)', width: 36 }}>{i + 1}</TD>
                <TD style={{ width: 52 }}>
                  {b.image
                    ? <img src={b.image} alt="" style={{ width: 36, height: 50, objectFit: 'cover', borderRadius: 5 }} />
                    : <div style={{ width: 36, height: 50, borderRadius: 5, background: b.coverColor || '#5b8df6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📖</div>
                  }
                </TD>
                <TD><span style={{ color: 'var(--text)', fontWeight: 600 }}>{b.title}</span></TD>
                <TD>{b.author}</TD>
                <TD>{b.year || '—'}</TD>
                <TD><Badge>{b.genre}</Badge></TD>
                <TD><Badge color={b.available === 0 ? 'red' : b.available < 2 ? 'amber' : 'green'}>{b.available}</Badge></TD>
                <TD>{b.count}</TD>
                {isAdmin && (
                  <TD>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Btn size="sm" onClick={() => openEdit(b)}>Tahrirlash</Btn>
                      <Btn size="sm" variant="danger" onClick={() => handleDelete(b.id)}>O'chirish</Btn>
                    </div>
                  </TD>
                )}
              </TR>
            ))}
          </Table>
        ) : <Empty icon="📖" message="Kitob topilmadi" />}
      </Card>

      {modal && (
        <Modal title={modal === 'add' ? "Yangi kitob qo'shish" : "Kitobni tahrirlash"} onClose={() => setModal(null)} width={580}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FormGroup label="Kitob nomi *" span={2}><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Kitob nomi" /></FormGroup>
            <FormGroup label="Muallif *" span={2}><Input value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} placeholder="Muallif ismi" /></FormGroup>
            <FormGroup label="Nashr yili"><Input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} type="number" placeholder="2024" /></FormGroup>
            <FormGroup label="Janr"><Select value={form.genre} onChange={e => setForm(p => ({ ...p, genre: e.target.value }))}>{GENRES.map(g => <option key={g}>{g}</option>)}</Select></FormGroup>
            <FormGroup label="Sahifalar soni"><Input value={form.pages} onChange={e => setForm(p => ({ ...p, pages: e.target.value }))} placeholder="320" type="number" /></FormGroup>
            <FormGroup label="Nusxa soni *"><Input value={form.count} onChange={e => setForm(p => ({ ...p, count: e.target.value }))} type="number" min="1" /></FormGroup>
            <FormGroup label="Nashriyot"><Input value={form.publisher} onChange={e => setForm(p => ({ ...p, publisher: e.target.value }))} placeholder="Nashriyot nomi" /></FormGroup>
            <FormGroup label="Til"><Input value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))} placeholder="O'zbek" /></FormGroup>
            <FormGroup label="Muqova rangi" span={2}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm(p => ({ ...p, coverColor: c }))} style={{
                    width: 28, height: 28, borderRadius: 6, background: c, border: 'none', cursor: 'pointer',
                    outline: form.coverColor === c ? '2px solid var(--text)' : 'none',
                    outlineOffset: 2, transition: 'all 0.15s',
                  }} />
                ))}
                <input type="color" value={form.coverColor} onChange={e => setForm(p => ({ ...p, coverColor: e.target.value }))}
                  style={{ width: 28, height: 28, padding: 0, border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }} />
              </div>
            </FormGroup>
            <FormGroup label="Muqova rasmi" span={2}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                {form.image
                  ? <img src={form.image} alt="" style={{ width: 50, height: 70, objectFit: 'cover', borderRadius: 6 }} />
                  : <div style={{ width: 50, height: 70, borderRadius: 6, background: form.coverColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📖</div>
                }
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Btn size="sm" onClick={() => fileRef.current.click()}>Rasm yuklash</Btn>
                  {form.image && <Btn size="sm" variant="danger" onClick={() => setForm(p => ({ ...p, image: '' }))}>Rasmni olib tashlash</Btn>}
                </div>
              </div>
            </FormGroup>
            <FormGroup label="Tavsif" span={2}>
              <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Kitob haqida qisqacha..." rows={3} />
            </FormGroup>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            <Btn onClick={() => setModal(null)}>Bekor qilish</Btn>
            <Btn variant="primary" onClick={handleSave}>Saqlash</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
