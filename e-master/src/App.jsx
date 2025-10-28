// File: src/App.js

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'; // Đảm bảo import AppRoutes
import './index.css'; // Hoặc file CSS toàn cục khác nếu có

function App() {
  return (
    // BrowserRouter bao bọc toàn bộ ứng dụng để kích hoạt tính năng routing
    <BrowserRouter>
      {/* AppRoutes sẽ quyết định component nào được render dựa trên URL */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;