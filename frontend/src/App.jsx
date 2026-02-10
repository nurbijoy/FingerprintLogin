import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import RegisterUser from './pages/RegisterUser';
import VerifyFingerprint from './pages/VerifyFingerprint';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/verify" element={<VerifyFingerprint />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
