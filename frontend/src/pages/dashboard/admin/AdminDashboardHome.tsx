import { StatsCard } from "../../../components/dashboard/StatsCard";
import { Users, Briefcase, IndianRupee, Activity } from "lucide-react";
import { motion } from "framer-motion";

export const AdminDashboardHome = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Overview of platform activity and performance.
        </p>
      </motion.div>

      <motion.div
        variants={item}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          title="Total Users"
          value="1,234"
          icon={Users}
          description="+12% from last month"
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatsCard
          title="Active Gigs"
          value="45"
          icon={Briefcase}
          description="5 new this week"
        />
        <StatsCard
          title="Total Payouts"
          value="₹12,450"
          icon={IndianRupee}
          description="Pending processing"
        />
        <StatsCard
          title="System Health"
          value="99.9%"
          icon={Activity}
          description="All systems operational"
          trend={{ value: 0.1, label: "uptime" }}
        />
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={item} className="glass-card p-6 rounded-xl">
          <h3 className="font-semibold mb-4">Recent User Registrations</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              No recent registrations.
            </p>
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-card p-6 rounded-xl">
          <h3 className="font-semibold mb-4">Pending Gig Approvals</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              No pending approvals.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
