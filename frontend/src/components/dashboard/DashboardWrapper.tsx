import { useAuthStore } from "../../store/auth.store";
import { AdminDashboardHome } from "../../pages/dashboard/admin/AdminDashboardHome";
import { DashboardHome } from "../../pages/dashboard/DashboardHome";

export const DashboardWrapper = () => {
  const { user } = useAuthStore();

  if (user?.role === "ADMIN" || user?.role === "OPERATIONS") {
    return <AdminDashboardHome />;
  }

  return <DashboardHome />;
};
