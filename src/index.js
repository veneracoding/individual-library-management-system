import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Apply saved theme before render
const saved = localStorage.getItem('lib_theme') || 'dark';
document.documentElement.setAttribute('data-theme', saved);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
