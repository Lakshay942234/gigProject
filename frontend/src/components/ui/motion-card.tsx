import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

export const AnimatedCard = ({ className, children, ...props }: HTMLMotionProps<"div">) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn("rounded-lg border bg-card text-card-foreground shadow-sm glass-card hover:shadow-lg transition-all duration-300", className)}
            {...props}
        >
            {children}
        </motion.div>
    );
};
