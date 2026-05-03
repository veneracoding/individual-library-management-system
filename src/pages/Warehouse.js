import React, { useState } from 'react';
import { load, save, K, uid, today } from '../utils';
import { PageHeader, Card, Badge, Table, TR, TD, Btn, Modal, FormGroup, Input, Select, Textarea, StatCard, Empty } from '../components/UI';

const ACTIONS = ['kirim', 'chiqim'];
const REASONS_KIRIM  = ['Yangi keldi', 'Xarid qilindi', 'Sovg\'a qilindi', 'Qaytarildi'];
const REASONS_CHIQIM = ["Yo'qolgan", 'Eskirgan', 'Shikastlangan', 'Boshqa joyga berildi'];

export default function Warehouse() {
  const [records, setRecords] = useState(() => load(K.WAREHOUSE));
  const [books]               = useState(() => load(K.BOOKS));
  const [modal, setModal]     = useState(false);
  const [filter, setFilter]   = useState('barchasi');
  const [form, setForm]       = useState({ bookId: '', action: 'kirim', quantity: 1, reason: REASONS_KIRIM[0], date: today(), note: '' });

  const totalKirim  = records.filter(r => r.action === 'kirim').reduce((s, r) => s + (r.quantity || 0), 0);
  const totalChiqim = records.filter(r => r.action === 'chiqim').reduce((s, r) => s + (r.quantity || 0), 0);

  const filtered = filter === 'barchasi' ? records : records.filter(r => r.action === filter);
  const sortedRecords = [...filtered].reverse();

  const handleSave = () => {
    if (!form.bookId) { alert('Kitobni tanlang!'); return; }
    const qty = parseInt(form.quantity) || 1;
    if (qty < 1) { alert("Miqdor 1 dan kichik bo'lmasin!"); return; }

    // Update book count
    const allBooks = load(K.BOOKS);
    const bi = allBooks.findIndex(b => b.id === form.bookId);
    if (bi >= 0) {
      if (form.action === 'kirim') {
        allBooks[bi].count += qty;
        allBooks[bi].available += qty;
      } else {
        if (allBooks[bi].available < qty) { alert("Mavjud nusxadan ko'p chiqarib bo'lmaydi!"); return; }
        allBooks[bi].count -= qty;
        allBooks[bi].available -= qty;
      }
      save(K.BOOKS, allBooks);
    }

    const newRec = { id: uid(), bookId: form.bookId, action: form.action, quantity: qty, reason: form.reason, date: form.date, note: form.note };
    const updated = [...records, newRec];
    save(K.WAREHOUSE, updated);
    setRecords(updated);
    setModal(false);
  };

  const reasons = form.action === 'kirim' ? REASONS_KIRIM : REASONS_CHIQIM;

  return (
    <div className="page-enter">
      <PageHeader
        title="Ombor boshqaruvi"
        subtitle="Kitoblar kirim va chiqimini nazorat qiling"
        action={<Btn variant="primary" onClick={() => { setForm({ bookId: books[0]?.id || '', action: 'kirim', quantity: 1, reason: REASONS_KIRIM[0], date: today(), note: '' }); setModal(true); }}>+ Kirim / Chiqim</Btn>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
        <StatCard label="Jami kirim" value={totalKirim} icon="📥" color="green" sub="barcha vaqt" />
        <StatCard label="Jami chiqim" value={totalChiqim} icon="📤" color="red" sub="barcha vaqt" />
        <StatCard label="Balans" value={totalKirim - totalChiqim} icon="📊" color="blue" sub="hozirgi holat" />
      </div>

      <Card>
        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
          {['barchasi', 'kirim', 'chiqim'].map(f => (
            <Btn key={f} size="sm" variant={filter === f ? 'primary' : 'ghost'} onClick={() => setFilter(f)}>
              {f === 'barchasi' ? '📋 Barchasi' : f === 'kirim' ? '📥 Kirim' : '📤 Chiqim'}
            </Btn>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text3)', alignSelf: 'center' }}>{sortedRecords.length} ta yozuv</span>
        </div>

        {sortedRecords.length ? (
          <Table headers={['#', 'Kitob', 'Harakat', 'Miqdor', 'Sabab', 'Sana', 'Izoh']}>
            {sortedRecords.map((r, i) => {
              const book = books.find(b => b.id === r.bookId);
              return (
                <TR key={r.id}>
                  <TD style={{ color: 'var(--text3)', width: 36 }}>{i + 1}</TD>
                  <TD><span style={{ color: 'var(--text)', fontWeight: 500 }}>{book?.title || '—'}</span><br /><span style={{ fontSize: 11, color: 'var(--text3)' }}>{book?.author}</span></TD>
                  <TD>
                    <Badge color={r.action === 'kirim' ? 'green' : 'red'}>
                      {r.action === 'kirim' ? '📥 Kirim' : '📤 Chiqim'}
                    </Badge>
                  </TD>
                  <TD><span style={{ fontWeight: 700, color: r.action === 'kirim' ? 'var(--success)' : 'var(--danger)', fontSize: 15 }}>{r.action === 'kirim' ? '+' : '-'}{r.quantity}</span></TD>
                  <TD>{r.reason}</TD>
                  <TD style={{ fontVariantNumeric: 'tabular-nums' }}>{r.date}</TD>
                  <TD style={{ color: 'var(--text3)', fontStyle: r.note ? 'normal' : 'italic' }}>{r.note || '—'}</TD>
                </TR>
              );
            })}
          </Table>
        ) : <Empty icon="📦" message="Ombor yozuvlari topilmadi" />}
      </Card>

      {modal && (
        <Modal title="Ombor yozuvi qo'shish" onClose={() => setModal(false)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormGroup label="Kitob *" span={2}>
              <Select value={form.bookId} onChange={e => setForm(p => ({ ...p, bookId: e.target.value }))}>
                {books.map(b => <option key={b.id} value={b.id}>{b.title} (mavjud: {b.available})</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Harakat turi *">
              <Select value={form.action} onChange={e => setForm(p => ({ ...p, action: e.target.value, reason: e.target.value === 'kirim' ? REASONS_KIRIM[0] : REASONS_CHIQIM[0] }))}>
                <option value="kirim">📥 Kirim</option>
                <option value="chiqim">📤 Chiqim</option>
              </Select>
            </FormGroup>
            <FormGroup label="Miqdor *">
              <Input type="number" min="1" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Sabab *">
              <Select value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}>
                {reasons.map(r => <option key={r}>{r}</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Sana">
              <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Izoh (ixtiyoriy)" span={2}>
              <Textarea value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Qo'shimcha ma'lumot..." />
            </FormGroup>
          </div>

          <div style={{
            display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1.25rem',
            paddingTop: '1.25rem', borderTop: '1px solid var(--border)',
          }}>
            <Btn onClick={() => setModal(false)}>Bekor qilish</Btn>
            <Btn variant={form.action === 'kirim' ? 'success' : 'danger'} onClick={handleSave}>
              {form.action === 'kirim' ? '📥 Kirim qilish' : '📤 Chiqim qilish'}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
