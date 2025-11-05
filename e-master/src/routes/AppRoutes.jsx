import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from '../pages/Homepage/Homepage.jsx';
import Login from '../pages/Login/Login.jsx';
import Signup from '../pages/Sign up/Signup.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import AIChat from '../pages/AIChat/AIChat.jsx';
import InputTesting from '../pages/InputTesting/InputTesting.jsx';
import Roadmap from '../pages/Roadmap/Roadmap.jsx';
import MyCourse from '../pages/MyCourse/MyCourse.jsx';
import Landingpage from '../pages/LandingPage/LandingPage.jsx';
import Resources from '../pages/Resources/Resource.jsx';
import Schedule from "../pages/Schedule/Schedule.jsx";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/landing" element={<Landingpage />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/mycourse" element={<MyCourse />} />
      <Route path="/assistant" element={<AIChat />} />
      <Route path="/input-testing" element={<InputTesting />} />
      <Route path="/schedule" element={<Schedule />} />


    </Routes>
  );
}