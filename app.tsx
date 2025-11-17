
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import PlayerPage from './pages/PlayerPage';
import AdminPage from './pages/AdminPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PlayerPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
