import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getMonthlyStats, getGenreStats, getDailyActivity, load, K, isOverdue } from '../utils';
import { PageHeader, Card, StatCard } from '../components/UI';

const COLORS = ['#5b8df6','#34d399','#fbbf24','#f87171','#a78bfa','#fb923c','#38bdf8'];

const TooltipStyle = {
  background: 'var(--bg2)', border: '1px solid var(--border2)',
  borderRadius: 10, fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

export default function Analytics() {
  const monthly = getMonthlyStats();
  const genres  = getGenreStats();
  const daily   = getDailyActivity();
  const loans   = load(K.LOANS);
  const books   = load(K.BOOKS);

  const active  = loans.filter(l => !l.returned);
  const overdue = active.filter(l => isOverdue(l.dueDate));
  const returnRate = loans.length ? Math.round((loans.filter(l => l.returned).length / loans.length) * 100) : 0;
  const totalBooks = books.reduce((s, b) => s + b.count, 0);
  const usedBooks  = books.reduce((s, b) => s + (b.count - b.available), 0);
  const utilRate   = totalBooks ? Math.round((usedBooks / totalBooks) * 100) : 0;

  return (
    <div className="page-enter">
      <PageHeader title="Tahlil va Statistika" subtitle="Kutubxona faoliyati ko'rsatkichlari" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
        <StatCard label="Jami berishlar" value={loans.length} icon="🔄" color="blue" sub="barcha vaqt uchun" />
        <StatCard label="Qaytarish darajasi" value={`${returnRate}%`} icon="✅" color="green" sub="muvaffaqiyatli" />
        <StatCard label="Foydalanish darajasi" value={`${utilRate}%`} icon="📊" color="amber" sub="kitoblar band" />
        <StatCard label="Kechikkanlar" value={overdue.length} icon="⚠️" color="red" sub="tezda qaytarish kerak" />
      </div>

      {/* Monthly berilgan/qaytarilgan */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: '1.25rem' }}>
            📈 Oylik faoliyat
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b8df6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#5b8df6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="berilgan" name="Berilgan" stroke="#5b8df6" strokeWidth={2} fill="url(#gBlue)" />
              <Area type="monotone" dataKey="qaytarilgan" name="Qaytarilgan" stroke="#34d399" strokeWidth={2} fill="url(#gGreen)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie: genre distribution */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: '1.25rem' }}>
            🍕 Janrlar bo'yicha taqsimot
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={genres} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
                {genres.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={TooltipStyle} formatter={(v, n) => [v + ' nusxa', n]} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Daily activity + kitob holati */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: '1.25rem' }}>
            📅 Haftalik faoliyat
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={daily} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TooltipStyle} />
              <Bar dataKey="harakatlar" name="Harakatlar" fill="#5b8df6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: '1.25rem' }}>
            📚 Kitoblar band/bo'sh
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={books.slice(0, 6).map(b => ({ name: b.title.slice(0, 12) + (b.title.length > 12 ? '…' : ''), band: b.count - b.available, bosh: b.available }))} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="band" name="Band" stackId="a" fill="#f87171" radius={[0,0,0,0]} />
              <Bar dataKey="bosh" name="Bo'sh" stackId="a" fill="#34d399" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
