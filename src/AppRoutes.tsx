// src/AppRoutes.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AppContent from './AppContent';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactUs';
import NotFoundPage from './components/NotFoundPage';
import About from './pages/About';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<AppContent />} />
    <Route path="/about" element={<About />} />
    <Route path="/contacts" element={<ContactList />} />
    <Route path="/contacts/new" element={<ContactForm />} />
    <Route path="/contacts/:id" element={<ContactForm />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
