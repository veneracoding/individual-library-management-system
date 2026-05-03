import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  uz: {
    // Nav
    dashboard: 'Bosh sahifa', catalog: 'Katalog', allBooks: 'Barcha kitoblar',
    books: 'Kitoblar', warehouse: 'Ombor', members: "A'zolar",
    loans: 'Kitob berish', analytics: 'Tahlil', reports: 'Hisobotlar',
    // Common
    search: 'Qidirish...', save: 'Saqlash', cancel: 'Bekor qilish',
    delete: 'O\'chirish', edit: 'Tahrirlash', add: 'Qo\'shish', close: 'Yopish',
    logout: 'Chiqish', profile: 'Profil',
    darkMode: 'Qorong\'u rejim', lightMode: 'Yorug\' rejim',
    // Books
    available: 'Mavjud', unavailable: 'Mavjud emas', total: 'Jami',
    author: 'Muallif', year: 'Yil', genre: 'Janr', all: 'Barchasi',
    bookName: 'Kitob nomi', copies: 'Nusxalar', pages: 'Sahifalar',
    publisher: 'Nashriyot', language: 'Til', description: 'Tavsif',
    // Catalog
    searchPlaceholder: 'Kitob nomi yoki muallif...', sortBy: 'Saralash',
    onlyAvailable: 'Faqat mavjud', results: 'ta natija',
    sortTitle: 'A–Z sarlavha', sortAuthor: 'Muallif', sortYear: 'Yangi–Eski', sortRating: 'Reyting',
    aboutBook: 'Kitob haqida', readersOpinion: 'Kitobxonlar fikri', noReviews: 'Hali izoh qoldirilmagan',
    rateBook: 'Baholang', yourOpinion: 'Sizning fikringiz', submitRating: 'Baholash',
    update: 'Yangilash', uploadImage: 'Rasm yuklash', removeImage: 'Rasmni o\'chirish',
    readOnline: 'Onlayn o\'qish', uploadPdf: 'PDF yuklash', removePdf: 'PDF o\'chirish',
    pdfReader: 'PDF Kitob o\'quvchi', noPdf: 'PDF fayl yuklanmagan',
    // Notifications
    notifications: 'Xabarnomalar', noNotifications: 'Xabarnoma yo\'q',
    overdueWarning: 'Muddati o\'tgan', dueSoon: 'Muddat yaqinlashmoqda',
    // All Books
    allBooksTitle: 'Barcha Kitoblar', mostRead: 'Ko\'p o\'qilgan', leastStock: 'Kam nusxa',
    totalCopies: 'Jami nusxa', borrowedNow: 'Hozir berilgan',
    // Genres
    roman: 'Roman', textbook: 'Darslik', tech: 'Texnik', poetry: "She'riyat",
    history: 'Tarix', detective: 'Detektiv', children: 'Bolalar', other: 'Boshqa',
    // Profile
    memberSince: "A'zo bo'lgan sana", totalLoans: 'Jami olgan kitoblar',
    currentLoans: 'Hozirda qo\'lida', returnedLoans: 'Qaytargan',
    overdueLoans: 'Kechikkan', editProfile: 'Profilni tahrirlash',
    phone: 'Telefon', email: 'Email', username: 'Foydalanuvchi nomi',
    changePassword: 'Parolni o\'zgartirish', oldPassword: 'Eski parol',
    newPassword: 'Yangi parol', confirmPassword: 'Tasdiqlash',
  },
  ru: {
    dashboard: 'Главная', catalog: 'Каталог', allBooks: 'Все книги',
    books: 'Книги', warehouse: 'Склад', members: 'Участники',
    loans: 'Выдача книг', analytics: 'Аналитика', reports: 'Отчёты',
    search: 'Поиск...', save: 'Сохранить', cancel: 'Отмена',
    delete: 'Удалить', edit: 'Изменить', add: 'Добавить', close: 'Закрыть',
    logout: 'Выйти', profile: 'Профиль',
    darkMode: 'Тёмный режим', lightMode: 'Светлый режим',
    available: 'Доступно', unavailable: 'Недоступно', total: 'Всего',
    author: 'Автор', year: 'Год', genre: 'Жанр', all: 'Все',
    bookName: 'Название книги', copies: 'Экземпляры', pages: 'Страницы',
    publisher: 'Издательство', language: 'Язык', description: 'Описание',
    searchPlaceholder: 'Название или автор...', sortBy: 'Сортировка',
    onlyAvailable: 'Только доступные', results: 'результатов',
    sortTitle: 'A–Z название', sortAuthor: 'Автор', sortYear: 'Новые–Старые', sortRating: 'Рейтинг',
    aboutBook: 'О книге', readersOpinion: 'Мнения читателей', noReviews: 'Нет отзывов',
    rateBook: 'Оцените', yourOpinion: 'Ваше мнение', submitRating: 'Оценить',
    update: 'Обновить', uploadImage: 'Загрузить обложку', removeImage: 'Удалить обложку',
    readOnline: 'Читать онлайн', uploadPdf: 'Загрузить PDF', removePdf: 'Удалить PDF',
    pdfReader: 'Читалка PDF', noPdf: 'PDF файл не загружен',
    notifications: 'Уведомления', noNotifications: 'Нет уведомлений',
    overdueWarning: 'Просрочено', dueSoon: 'Скоро истекает срок',
    allBooksTitle: 'Все Книги', mostRead: 'Популярные', leastStock: 'Мало экземпляров',
    totalCopies: 'Всего экземпляров', borrowedNow: 'Сейчас выдано',
    roman: 'Роман', textbook: 'Учебник', tech: 'Техническая', poetry: 'Поэзия',
    history: 'История', detective: 'Детектив', children: 'Детские', other: 'Другое',
    memberSince: 'Дата регистрации', totalLoans: 'Всего взято книг',
    currentLoans: 'На руках', returnedLoans: 'Возвращено',
    overdueLoans: 'Просрочено', editProfile: 'Редактировать профиль',
    phone: 'Телефон', email: 'Email', username: 'Логин',
    changePassword: 'Изменить пароль', oldPassword: 'Старый пароль',
    newPassword: 'Новый пароль', confirmPassword: 'Подтверждение',
  },
  en: {
    dashboard: 'Dashboard', catalog: 'Catalog', allBooks: 'All Books',
    books: 'Books', warehouse: 'Warehouse', members: 'Members',
    loans: 'Book Loans', analytics: 'Analytics', reports: 'Reports',
    search: 'Search...', save: 'Save', cancel: 'Cancel',
    delete: 'Delete', edit: 'Edit', add: 'Add', close: 'Close',
    logout: 'Log out', profile: 'Profile',
    darkMode: 'Dark mode', lightMode: 'Light mode',
    available: 'Available', unavailable: 'Unavailable', total: 'Total',
    author: 'Author', year: 'Year', genre: 'Genre', all: 'All',
    bookName: 'Book title', copies: 'Copies', pages: 'Pages',
    publisher: 'Publisher', language: 'Language', description: 'Description',
    searchPlaceholder: 'Title or author...', sortBy: 'Sort by',
    onlyAvailable: 'Available only', results: 'results',
    sortTitle: 'A–Z title', sortAuthor: 'Author', sortYear: 'Newest first', sortRating: 'Rating',
    aboutBook: 'About this book', readersOpinion: 'Reader reviews', noReviews: 'No reviews yet',
    rateBook: 'Rate', yourOpinion: 'Your opinion', submitRating: 'Submit rating',
    update: 'Update', uploadImage: 'Upload cover', removeImage: 'Remove cover',
    readOnline: 'Read online', uploadPdf: 'Upload PDF', removePdf: 'Remove PDF',
    pdfReader: 'PDF Reader', noPdf: 'No PDF file uploaded',
    notifications: 'Notifications', noNotifications: 'No notifications',
    overdueWarning: 'Overdue', dueSoon: 'Due soon',
    allBooksTitle: 'All Books', mostRead: 'Most read', leastStock: 'Low stock',
    totalCopies: 'Total copies', borrowedNow: 'Currently borrowed',
    roman: 'Novel', textbook: 'Textbook', tech: 'Technical', poetry: 'Poetry',
    history: 'History', detective: 'Detective', children: "Children's", other: 'Other',
    memberSince: 'Member since', totalLoans: 'Total loans',
    currentLoans: 'Current loans', returnedLoans: 'Returned',
    overdueLoans: 'Overdue', editProfile: 'Edit profile',
    phone: 'Phone', email: 'Email', username: 'Username',
    changePassword: 'Change password', oldPassword: 'Old password',
    newPassword: 'New password', confirmPassword: 'Confirm password',
  },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lib_lang') || 'uz');
  useEffect(() => { localStorage.setItem('lib_lang', lang); }, [lang]);
  const t = (key) => translations[lang]?.[key] || translations.uz[key] || key;
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
export { translations };
