// File: src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Đảm bảo đường dẫn import đúng
import Homepage from '../pages/Homepage/Homepage';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Trang chủ mặc định (đường dẫn /) sẽ hiển thị Homepage */}
      <Route path="/" element={<Homepage />} />
      
      {/* Đường dẫn /homepage cũng hiển thị Homepage */}
      <Route path="/homepage" element={<Homepage />} />

      {/* THÊM MỚI: Đường dẫn /dashboard sẽ hiển thị Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRoutes;