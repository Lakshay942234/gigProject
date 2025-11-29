import { motion } from "framer-motion";
import {
    CheckCircle2,
    DollarSign,
    Briefcase,
    Award,
    TrendingUp,
    Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Activity {
    id: string;
    type: "application" | "payment" | "achievement" | "gig_match";
    title: string;
    description: string;
    time: string;
    icon: any;
    iconBg: string;
    iconColor: string;
}

const mockActivities: Activity[] = [
    {
        id: "1",
        type: "application",
        title: "Application Accepted",
        description: "Your application for Customer Support Lead was accepted",
        time: "2 hours ago",
        icon: CheckCircle2,
        iconBg: "bg-green-100 dark:bg-green-900/20",
        iconColor: "text-green-600 dark:text-green-400"
    },
    {
        id: "2",
        type: "payment",
        title: "Payment Received",
        description: "$850 for Data Entry Project - March Week 2",
        time: "5 hours ago",
        icon: DollarSign,
        iconBg: "bg-blue-100 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
        id: "3",
        type: "gig_match",
        title: "New Gig Match",
        description: "Technical Support Specialist - Matches your skills",
        time: "1 day ago",
        icon: Briefcase,
        iconBg: "bg-purple-100 dark:bg-purple-900/20",
        iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
        id: "4",
        type: "achievement",
        title: "Achievement Unlocked",
        description: "Top Rated Plus - 98% success rate milestone",
        time: "2 days ago",
        icon: Award,
        iconBg: "bg-amber-100 dark:bg-amber-900/20",
        iconColor: "text-amber-600 dark:text-amber-400"
    },
    {
        id: "5",
        type: "application",
        title: "Application Under Review",
        description: "Sales Representative position is being reviewed",
        time: "3 days ago",
        icon: Clock,
        iconBg: "bg-gray-100 dark:bg-gray-800",
        iconColor: "text-gray-600 dark:text-gray-400"
    }
];

export const ActivityFeed = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <Card className="glass-card border-white/20">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Recent Activity
                    </CardTitle>
                    <button className="text-xs text-primary hover:underline">
                        View All
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-3"
                >
                    {mockActivities.map((activity) => {
                        const Icon = activity.icon;
                        return (
                            <motion.div
                                key={activity.id}
                                variants={item}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                <div className={`${activity.iconBg} p-2 rounded-lg transition-transform group-hover:scale-110`}>
                                    <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium leading-tight">
                                        {activity.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                        {activity.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {activity.time}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </CardContent>
        </Card>
    );
};
