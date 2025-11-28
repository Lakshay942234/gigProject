import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { RequireAuth } from './components/auth/RequireAuth';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { GigBoardPage } from './pages/dashboard/GigBoardPage';
import { ApplicationsPage } from './pages/dashboard/ApplicationsPage';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route element={<RequireAuth />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<div>Dashboard Home Placeholder</div>} />
                        <Route path="/dashboard/profile" element={<ProfilePage />} />
                        <Route path="/dashboard/gigs" element={<GigBoardPage />} />
                        <Route path="/dashboard/applications" element={<ApplicationsPage />} />
                    </Route>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
