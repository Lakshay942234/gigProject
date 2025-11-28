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
import { UserManagementPage } from "./pages/dashboard/admin/UserManagementPage";
import { AnalyticsDashboardPage } from "./pages/dashboard/admin/AnalyticsDashboardPage";
import { PayoutsPage } from "./pages/dashboard/admin/PayoutsPage";
import { CreateGigPage } from "./pages/dashboard/admin/CreateGigPage";

import { DashboardWrapper } from "./components/dashboard/DashboardWrapper";

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
            {/* Role-based Dashboard Home */}
            <Route path="/dashboard" element={<DashboardWrapper />} />

            {/* Common Routes */}
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/gigs" element={<GigBoardPage />} />
            <Route
              path="/dashboard/applications"
              element={<ApplicationsPage />}
            />
          </Route>

          {/* Admin Routes */}
          <Route
            element={<RequireAuth allowedRoles={["ADMIN", "OPERATIONS"]} />}
          >
            <Route element={<DashboardLayout />}>
              <Route
                path="/dashboard/admin/users"
                element={<UserManagementPage />}
              />
              <Route
                path="/dashboard/admin/analytics"
                element={<AnalyticsDashboardPage />}
              />
              <Route
                path="/dashboard/admin/payouts"
                element={<PayoutsPage />}
              />
              <Route
                path="/dashboard/admin/gigs/create"
                element={<CreateGigPage />}
              />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
