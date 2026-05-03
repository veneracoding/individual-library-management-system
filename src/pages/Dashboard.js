import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { load, K, isOverdue, getMonthlyStats } from '../utils';
import { PageHeader, StatCard, Card, Badge, Table, TR, TD } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const TooltipStyle = {
  background: 'var(--bg2)', border: '1px solid var(--border2)',
  borderRadius: 10, fontSize: 12,
};

export default function Dashboard() {
  const { user } = useAuth();
  const books   = load(K.BOOKS);
  const members = load(K.MEMBERS);
  const loans   = load(K.LOANS);
  const monthly = getMonthlyStats();

  const active  = loans.filter(l => !l.returned);
  const overdue = active.filter(l => isOverdue(l.dueDate));
  const totalBooks = books.reduce((s, b) => s + b.count, 0);
  const myLoans = user?.role === 'member' ? loans.filter(l => l.memberId === user.id) : loans;
  const recent  = [...loans].reverse().slice(0, 6);

  return (
    <div className="page-enter">
      <PageHeader
        title={`Xush kelibsiz, ${user?.name?.split(' ')[0]}! 👋`}
        subtitle={new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      />

      {user?.role === 'admin' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
          <StatCard label="Jami kitoblar" value={totalBooks} sub={`${books.length} xil nom`} color="blue" icon="📚" />
          <StatCard label="A'zolar" value={members.length} sub="ro'yxatdan o'tgan" color="green" icon="👥" />
          <StatCard label="Berilgan" value={active.length} sub="hozirda" icon="🔄" />
          <StatCard label="Kechikkan" value={overdue.length} sub="qaytarilmagan" color="red" icon="⚠️" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
          <StatCard label="Qo'limdagi kitoblar" value={myLoans.filter(l => !l.returned).length} color="blue" icon="📖" />
          <StatCard label="Qaytarganlar" value={myLoans.filter(l => l.returned).length} color="green" icon="✅" />
          <StatCard label="Kechikkan" value={myLoans.filter(l => !l.returned && isOverdue(l.dueDate)).length} color="red" icon="⚠️" />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Mini chart */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>📈 Oylik faoliyat</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="dbBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b8df6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#5b8df6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TooltipStyle} />
              <Area type="monotone" dataKey="berilgan" name="Berilgan" stroke="#5b8df6" strokeWidth={2} fill="url(#dbBlue)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Books availability */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>📚 Kitoblar holati</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {books.slice(0, 5).map(b => {
              const pct = b.count > 0 ? Math.round(((b.count - b.available) / b.count) * 100) : 0;
              return (
                <div key={b.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>{b.count - b.available}/{b.count}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 4, background: 'var(--bg4)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 4, background: pct > 80 ? 'var(--danger)' : pct > 50 ? 'var(--warning)' : 'var(--accent)', transition: 'width 0.5s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>🕐 So'nggi harakatlar</div>
        <Table headers={['Kitob', "A'zo", 'Berilgan sana', 'Muddat', 'Holat']}>
          {recent.length ? recent.map(l => {
            const b = books.find(x => x.id === l.bookId);
            const m = members.find(x => x.id === l.memberId);
            const od = !l.returned && isOverdue(l.dueDate);
            return (
              <TR key={l.id} highlight={od}>
                <TD><span style={{ color: 'var(--text)', fontWeight: 500 }}>{b?.title || '—'}</span></TD>
                <TD>{m?.name || 'Demo'}</TD>
                <TD style={{ fontVariantNumeric: 'tabular-nums' }}>{l.loanDate}</TD>
                <TD style={{ fontVariantNumeric: 'tabular-nums' }}>{l.dueDate}</TD>
                <TD><Badge color={l.returned ? 'green' : od ? 'red' : 'blue'}>{l.returned ? '✓ Qaytarildi' : od ? '⚠ Kechikdi' : '● Berilgan'}</Badge></TD>
              </TR>
            );
          }) : null}
        </Table>
      </Card>
    </div>
  );
}
