import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MapView from './components/MapView';
import SheltersPage from './pages/SheltersPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import NavBar from './components/NavBar';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      {user && <NavBar role={user.role} onLogout={() => setUser(null)} />}

      <Routes>
        {/* Login route is public */}
        <Route path="/" element={<LoginPage setUser={setUser} />} />

        {/* If user is not logged in, redirect all protected routes */}
        {!user ? (
          <>
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<DashboardPage user={user} />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/shelters" element={<SheltersPage />} />
            <Route path="/alerts" element={<AlertsPage user={user} />} />
            <Route path="/reports" element={<ReportsPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
