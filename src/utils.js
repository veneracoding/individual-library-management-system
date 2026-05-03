export const K = {
  BOOKS: 'lib_books',
  MEMBERS: 'lib_members',
  LOANS: 'lib_loans',
  WAREHOUSE: 'lib_warehouse',
  REVIEWS: 'lib_reviews',
};

export const load = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
};
export const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
export const today = () => new Date().toISOString().slice(0, 10);
export const addDays = (dateStr, n) => {
  const d = new Date(dateStr); d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
export const isOverdue = (dueDate) => new Date(dueDate) < new Date(today());

export const initDemoData = () => {
  if (!load(K.BOOKS).length) {
    save(K.BOOKS, [
      { id: uid(), title: "O'tkan kunlar", author: "Abdulla Qodiriy", year: "1926", genre: "Roman", count: 5, available: 3, coverColor: "#7c3aed", description: "O'zbek adabiyotining durdonasi. XIX asrning oxiri va XX asrning boshlarida O'rta Osiyo hayotini tasvirlovchi roman. Otabek va Kumushning sevgi qissasi orqali davr voqealari jonlantirilgan.", pages: "384", publisher: "O'zbekiston", language: "O'zbek", image: "" },
      { id: uid(), title: "Kecha va Kunduz", author: "Cho'lpon", year: "1936", genre: "Roman", count: 3, available: 1, coverColor: "#0891b2", description: "Cho'lponning buyuk romani. Zulm va ozodlik, muhabbat va hasrat mavzulari o'zbek xalqining og'ir hayoti orqali aks ettirilgan. O'zbek adabiyotidagi eng ta'sirli asarlardan biri.", pages: "312", publisher: "Fan", language: "O'zbek", image: "" },
      { id: uid(), title: "Mehrobdan Chayon", author: "Abdulla Qodiriy", year: "1929", genre: "Roman", count: 4, available: 2, coverColor: "#b45309", description: "Abdulla Qodiriyning ikkinchi buyuk romani. Ikki oila o'rtasidagi ziddiyat va sevgi dramatik voqealar orqali ochib berilgan. Milliy adabiyotimizning eng asosiy asarlaridan.", pages: "296", publisher: "O'zbekiston", language: "O'zbek", image: "" },
      { id: uid(), title: "Python dasturlash", author: "Asliddin Xoliqov", year: "2022", genre: "Texnik", count: 6, available: 5, coverColor: "#0f766e", description: "Python dasturlash tilini o'rganmoqchi bo'lganlar uchun mukammal qo'llanma. Asoslardan boshlab ilg'or mavzulargacha qamrab olingan. Amaliy misollar va topshiriqlar bilan boyitilgan.", pages: "520", publisher: "IT Press", language: "O'zbek", image: "" },
      { id: uid(), title: "Matematika asoslari", author: "R.Raximov", year: "2020", genre: "Darslik", count: 4, available: 4, coverColor: "#1d4ed8", description: "Oliy matematika asoslarini tushunarli tilda bayon etgan darslik. Algebra, geometriya, analiz mavzulari chuqur yoritilgan. Talabalarga mo'ljallangan amaliy misol va mashqlar to'plami.", pages: "448", publisher: "TDU nashriyoti", language: "O'zbek", image: "" },
      { id: uid(), title: "Sherlock Holmes", author: "Arthur Conan Doyle", year: "1892", genre: "Detektiv", count: 3, available: 3, coverColor: "#7f1d1d", description: "Dunyoning eng mashhur detektivi Sherlock Holmsning sarguzashtlari. Mantiqiy tafakkur va kuzatuvchanlik yordamida hal etilgan murakkab jinoyat ishlari. Jaxon adabiyotining durdonasi.", pages: "307", publisher: "Sharq", language: "O'zbek (tarjima)", image: "" },
      { id: uid(), title: "1984", author: "George Orwell", year: "1949", genre: "Roman", count: 2, available: 1, coverColor: "#374151", description: "Totalitar jamiyat haqidagi antiutopik roman. Katta Aka nazorati ostidagi dystopik dunyo Winston Smithning ko'zlari orqali tasvirlangan. Siyosiy tizim va inson erkinligi haqida chuqur o'ylash uchun.", pages: "328", publisher: "Yangi asr avlodi", language: "O'zbek (tarjima)", image: "" },
      { id: uid(), title: "React dasturlash", author: "Dan Abramov", year: "2023", genre: "Texnik", count: 4, available: 3, coverColor: "#0e7490", description: "React kutubxonasini professional darajada o'rganish uchun to'liq qo'llanma. Hooks, Context, Redux, performance optimization va zamonaviy React patterns yoritilgan.", pages: "612", publisher: "Tech Books", language: "Ingliz", image: "" },
      { id: uid(), title: "Oltin baliq", author: "Saidali Siddiqov", year: "2018", genre: "Bolalar", count: 5, available: 4, coverColor: "#d97706", description: "Bolalar uchun mo'ljallangan qiziqarli ertaklar to'plami. Har bir ertak orqali bolalarga mehribonlik, do'stlik va halollik fazilatlari o'rgatiladi. Rang-barang rasmlar bilan bezatilgan.", pages: "128", publisher: "Yangi nashr", language: "O'zbek", image: "" },
      { id: uid(), title: "Karlson tomda", author: "Astrid Lindgren", year: "1955", genre: "Bolalar", count: 3, available: 3, coverColor: "#059669", description: "Dunyodagi eng sevimli bolalar kitoblaridan biri. Karlson va Malysh o'rtasidagi do'stlik sarguzashtlari kichik o'quvchilarni qahqahaga soladi. Dunyoning 50 dan ortiq tilida tarjima qilingan.", pages: "192", publisher: "Sharq", language: "O'zbek (tarjima)", image: "" },
    ]);
  }
  if (!load(K.WAREHOUSE).length) {
    const books = load(K.BOOKS);
    save(K.WAREHOUSE, [
      { id: uid(), bookId: books[0]?.id, action: 'kirim', quantity: 5, reason: 'Yangi keldi', date: '2025-01-10', note: 'Asosiy ombordan' },
      { id: uid(), bookId: books[1]?.id, action: 'kirim', quantity: 3, reason: 'Xarid qilindi', date: '2025-02-05', note: '' },
      { id: uid(), bookId: books[3]?.id, action: 'kirim', quantity: 6, reason: 'Xarid qilindi', date: '2025-02-20', note: '' },
      { id: uid(), bookId: books[0]?.id, action: 'chiqim', quantity: 1, reason: "Yo'qolgan", date: '2025-03-01', note: "Topilmadi" },
      { id: uid(), bookId: books[2]?.id, action: 'kirim', quantity: 4, reason: 'Yangi keldi', date: '2025-03-15', note: '' },
    ]);
  }
  if (!load(K.LOANS).length) {
    const books = load(K.BOOKS);
    const now = new Date();
    const loans = [];
    // generate 12 months activity
    for (let m = 0; m < 6; m++) {
      const cnt = Math.floor(Math.random() * 4) + 2;
      for (let i = 0; i < cnt; i++) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - m);
        d.setDate(Math.floor(Math.random() * 25) + 1);
        const lDate = d.toISOString().slice(0, 10);
        const bk = books[Math.floor(Math.random() * books.length)];
        loans.push({
          id: uid(), bookId: bk?.id,
          memberId: 'demo-member-' + (i % 3),
          loanDate: lDate, dueDate: addDays(lDate, 14),
          returned: m > 0 || Math.random() > 0.4,
          returnDate: m > 0 ? addDays(lDate, Math.floor(Math.random() * 12) + 2) : null,
        });
      }
    }
    save(K.LOANS, loans);
  }
};

// generate monthly chart data
export const getMonthlyStats = () => {
  const loans = load(K.LOANS);
  const months = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const key = d.toISOString().slice(0, 7);
    const label = d.toLocaleString('uz', { month: 'short' });
    months[key] = { name: label, berilgan: 0, qaytarilgan: 0 };
  }
  loans.forEach(l => {
    const mk = l.loanDate?.slice(0, 7);
    if (months[mk]) months[mk].berilgan++;
    if (l.returned && l.returnDate) {
      const rk = l.returnDate.slice(0, 7);
      if (months[rk]) months[rk].qaytarilgan++;
    }
  });
  return Object.values(months);
};

export const getGenreStats = () => {
  const books = load(K.BOOKS);
  const genres = {};
  books.forEach(b => { genres[b.genre] = (genres[b.genre] || 0) + b.count; });
  return Object.entries(genres).map(([name, value]) => ({ name, value }));
};

export const getDailyActivity = () => {
  const loans = load(K.LOANS);
  const days = {};
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleString('uz', { weekday: 'short' });
    days[key] = { name: label, harakatlar: 0 };
  }
  loans.forEach(l => {
    if (days[l.loanDate]) days[l.loanDate].harakatlar++;
  });
  return Object.values(days);
};
