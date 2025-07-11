// src/AppRoutes.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AppContent from './AppContent';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactUs';
import About from './pages/About';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<AppContent />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<ContactForm />} />
    <Route path="/contacts" element={<ContactList />} />
    <Route path="/contact/:id" element={<ContactForm />} />
    <Route
      path="*"
      element={
        <div style={{ padding: 20 }}>
          <h2>404 - Page Not Found</h2>
        </div>
      }
    />
  </Routes>
);

export default AppRoutes;
