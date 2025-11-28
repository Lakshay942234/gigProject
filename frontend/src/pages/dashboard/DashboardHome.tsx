import { useAuthStore } from "../../store/auth.store";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { EarningsChart } from "../../components/dashboard/EarningsChart";
import { DollarSign, Briefcase, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

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
      </motion.div>

      <motion.div
        variants={item}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          title="Total Earnings"
          value="$2,450"
          icon={DollarSign}
          description="+$350 from last week"
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatsCard
          title="Active Gigs"
          value="3"
          icon={Briefcase}
          description="2 pending applications"
        />
        <StatsCard
          title="Success Score"
          value="98%"
          icon={Star}
          description="Top Rated Plus status"
          trend={{ value: 2, label: "vs last month" }}
        />
        <StatsCard
          title="Hours Worked"
          value="124h"
          icon={Clock}
          description="This month"
        />
      </motion.div>

      <div className="grid gap-4 md:grid-cols-7">
        <motion.div variants={item} className="col-span-4">
          <EarningsChart />
        </motion.div>
        <motion.div variants={item} className="col-span-3">
          <div className="glass-card rounded-xl p-6 h-full border border-white/20">
            <h3 className="font-semibold mb-4">Recommended for You</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Customer Support Specialist
                    </p>
                    <p className="text-xs text-muted-foreground">
                      $15 - $22/hr • Remote
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
