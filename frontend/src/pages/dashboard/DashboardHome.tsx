import { useAuthStore } from "../../store/auth.store";
import { AdvancedStatsCard } from "../../components/dashboard/AdvancedStatsCard";
import { EarningsChart } from "../../components/dashboard/EarningsChart";
import { LearningSection } from "../../components/dashboard/LearningSection";
import { ActivityFeed } from "../../components/dashboard/ActivityFeed";
import { DollarSign, Briefcase, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { NotificationButton } from "../../components/dashboard/NotificationButton";

export const DashboardHome = () => {
  const { user } = useAuthStore();

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
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your gigs today.
        </p>
        <div className="mt-4">
          <NotificationButton />
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <AdvancedStatsCard
          title="Total Earnings"
          value={2450}
          icon={DollarSign}
          description="This month"
          trend={{ value: 12, label: "vs last month" }}
          sparklineData={[1200, 1450, 1300, 1800, 1950, 1700, 2100, 2300, 2200, 2450]}
        />
        <AdvancedStatsCard
          title="Active Gigs"
          value={3}
          icon={Briefcase}
          description="2 pending applications"
          sparklineData={[1, 2, 2, 3, 3, 2, 3, 3, 4, 3]}
        />
        <AdvancedStatsCard
          title="Success Score"
          value="98%"
          icon={Star}
          description="Top Rated Plus"
          trend={{ value: 2, label: "this month" }}
          sparklineData={[92, 93, 94, 95, 96, 96, 97, 97, 98, 98]}
        />
        <AdvancedStatsCard
          title="Hours Worked"
          value="124h"
          icon={Clock}
          description="This month"
          sparklineData={[80, 95, 88, 100, 115, 105, 120, 125, 118, 124]}
        />
      </motion.div>

      <div className="grid gap-4 md:grid-cols-7">
        <motion.div variants={item} className="col-span-4">
          <EarningsChart />
        </motion.div>
        <motion.div variants={item} className="col-span-3">
          <ActivityFeed />
        </motion.div>
      </div>

      <motion.div variants={item}>
        <LearningSection />
      </motion.div>
    </motion.div>
  );
};
