import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Activities from './pages/Activities';
import Goals from './pages/Goals';
import Tracking from "./pages/Tracking";




export default function App() {
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = !!token;

  return (
    <Routes>
      <Route path="/" element={<Layout><Landing /></Layout>} />

      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Layout><Login /></Layout>
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Layout><Register /></Layout>
        }
      />

      <Route
        path="/home"
        element={
          isAuthenticated ? <Layout><Home /></Layout> : <Navigate to="/login" replace />
        }
      />

     

      <Route path="/activities" element={<Layout><Activities /></Layout>} />
      
     < Route path="/goals" element={<Layout><Goals /></Layout>} />
      < Route path="/Tracking" element={<Layout><Tracking/></Layout>} />
     


      {/* Optional catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
