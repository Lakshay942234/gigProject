import api from "../../lib/axios";
import { Bell, Loader2 } from "lucide-react";
import { useState } from "react";
import { usePushNotifications } from "../../lib/usePushNotifications";

export const NotificationButton = () => {
  const { subscription, subscribeToPush } = usePushNotifications();
  const [loading, setLoading] = useState(false);

  const sendTestNotification = async () => {
    try {
      setLoading(true);
      await api.post("/notifications/test", {});
      console.log("Test notification scheduled");
    } catch (error) {
      console.error("Failed to send test notification", error);
    } finally {
      setLoading(false);
    }
  };

  if (subscription) {
    return (
      <div className="flex items-center space-x-4 text-green-500">
        <div className="flex items-center text-sm">
          <Bell className="w-4 h-4 mr-2" />
          Notifications Enabled
        </div>
        <button
          onClick={sendTestNotification}
          disabled={loading}
          className="px-3 py-1 text-xs font-medium bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
          {loading ? "Sending..." : "Test (5s)"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={subscribeToPush}
      className="flex items-center px-4 py-2 text-sm font-medium bg-primary rounded-md hover:bg-primary/90 transition-colors"
    >
      <Bell className="w-4 h-4 mr-2" />
      Enable Notifications
    </button>
  );
};
