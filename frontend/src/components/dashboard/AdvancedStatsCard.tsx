import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useEffect } from "react";
import { cn } from "../../lib/utils";

interface AdvancedStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  sparklineData?: number[];
  className?: string;
}

export const AdvancedStatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  sparklineData = [20, 45, 28, 80, 99, 43, 50, 75, 60, 85],
  className,
}: AdvancedStatsCardProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (typeof value === "string") return value;
    return Math.round(latest).toLocaleString();
  });

  useEffect(() => {
    if (typeof value === "number") {
      const animation = animate(count, value, { duration: 1.5 });
      return animation.stop;
    }
  }, [value]);

  const maxValue = Math.max(...sparklineData);
  const normalizedData = sparklineData.map((v) => (v / maxValue) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card
        className={cn("glass-card border-white/20 overflow-hidden", className)}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <motion.p className="text-3xl font-bold tracking-tight">
                {typeof value === "number" ? rounded : value}
              </motion.p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Sparkline */}
          <div className="mt-4 h-8 flex items-end gap-0.5">
            {normalizedData.map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="flex-1 bg-primary/30 rounded-sm hover:bg-primary/50 transition-colors"
              />
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between text-xs">
            {description && (
              <span className="text-muted-foreground">{description}</span>
            )}
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 font-medium",
                  trend.value > 0 ? "text-green-600" : "text-red-600"
                )}
              >
                <span>
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
