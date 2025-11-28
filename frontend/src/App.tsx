import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { RequireAuth } from "./components/auth/RequireAuth";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProfilePage } from "./pages/dashboard/ProfilePage";
import { GigBoardPage } from "./pages/dashboard/GigBoardPage";
import { ApplicationsPage } from "./pages/dashboard/ApplicationsPage";

import { KnowmaxWidget } from "./components/KnowmaxWidget";

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
            <Route
              path="/dashboard"
              element={
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard
                  </h1>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h2 className="text-lg font-medium mb-4">
                        Welcome Back!
                      </h2>
                      <p className="text-gray-600">
                        Select an option from the sidebar to get started.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h2 className="text-lg font-medium mb-4">
                        Learning Center
                      </h2>
                      <KnowmaxWidget />
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/gigs" element={<GigBoardPage />} />
            <Route
              path="/dashboard/applications"
              element={<ApplicationsPage />}
            />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
