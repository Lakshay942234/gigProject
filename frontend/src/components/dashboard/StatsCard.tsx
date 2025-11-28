import { AnimatedCard } from "../ui/motion-card";
import { cn } from "../../lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
    };
    className?: string;
}

export const StatsCard = ({ title, value, description, icon: Icon, trend, className }: StatsCardProps) => {
    return (
        <AnimatedCard className={cn("p-6", className)}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold mt-2">{value}</h3>
                    {description && (
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    )}
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-xs">
                    <span className={cn(
                        "font-medium",
                        trend.value >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                        {trend.value > 0 ? "+" : ""}{trend.value}%
                    </span>
                    <span className="text-muted-foreground ml-1">{trend.label}</span>
                </div>
            )}
        </AnimatedCard>
    );
};
