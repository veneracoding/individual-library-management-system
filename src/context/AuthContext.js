import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const ADMIN = { username: 'admin', password: 'admin123', name: 'Administrator', role: 'admin' };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lib_user')); } catch { return null; }
  });

  const login = (username, password) => {
    if (username === ADMIN.username && password === ADMIN.password) {
      const u = { username, name: ADMIN.name, role: 'admin' };
      setUser(u); localStorage.setItem('lib_user', JSON.stringify(u));
      return { ok: true };
    }
    const members = JSON.parse(localStorage.getItem('lib_members') || '[]');
    const member = members.find(m => m.username === username && m.password === password);
    if (member) {
      const u = { username, name: member.name, role: 'member', id: member.id };
      setUser(u); localStorage.setItem('lib_user', JSON.stringify(u));
      return { ok: true };
    }
    return { ok: false, error: "Foydalanuvchi nomi yoki parol noto'g'ri!" };
  };

  const register = (data) => {
    const members = JSON.parse(localStorage.getItem('lib_members') || '[]');
    if (members.find(m => m.username === data.username))
      return { ok: false, error: "Bu foydalanuvchi nomi band!" };
    const newMember = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      name: data.name, username: data.username, password: data.password,
      phone: data.phone, email: data.email,
      date: new Date().toISOString().slice(0, 10)
    };
    members.push(newMember);
    localStorage.setItem('lib_members', JSON.stringify(members));
    return { ok: true };
  };

  const logout = () => { setUser(null); localStorage.removeItem('lib_user'); };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
