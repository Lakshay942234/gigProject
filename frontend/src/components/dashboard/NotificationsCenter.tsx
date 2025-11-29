import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    category: "application" | "message" | "earning" | "system";
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        title: "Application Status Update",
        message: "Your application for Customer Support Lead has been accepted!",
        time: "5m ago",
        read: false,
        category: "application"
    },
    {
        id: "2",
        title: "New Message",
        message: "You have a new message from Tech Solutions Inc.",
        time: "1h ago",
        read: false,
        category: "message"
    },
    {
        id: "3",
        title: "Payment Received",
        message: "$850 has been deposited to your account",
        time: "3h ago",
        read: true,
        category: "earning"
    },
    {
        id: "4",
        title: "Profile Viewed",
        message: "Your profile was viewed by 3 companies today",
        time: "5h ago",
        read: true,
        category: "system"
    }
];

export const NotificationsCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                        {unreadCount}
                    </Badge>
                )}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-80 md:w-96 z-50 glass-card border border-white/20 rounded-xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-white/10">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg">Notifications</h3>
                                    <div className="flex items-center gap-2">
                                        {notifications.length > 0 && (
                                            <>
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    Mark all read
                                                </button>
                                                <button
                                                    onClick={clearAll}
                                                    className="text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-sm">No notifications</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/10">
                                        {notifications.map((notification) => (
                                            <motion.div
                                                key={notification.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${!notification.read ? "bg-primary/5" : ""
                                                    }`}
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-medium">
                                                                {notification.title}
                                                            </p>
                                                            {!notification.read && (
                                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                    {notification.read && (
                                                        <Check className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="p-3 border-t border-white/10 bg-white/5 dark:bg-black/5">
                                    <button className="w-full text-sm text-primary hover:underline flex items-center justify-center gap-2">
                                        <Settings className="h-4 w-4" />
                                        Notification Preferences
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
