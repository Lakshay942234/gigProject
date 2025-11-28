import { motion } from "framer-motion";

interface PageTransitionProps {
    children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};
