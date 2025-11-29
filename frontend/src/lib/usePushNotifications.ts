import { useState, useEffect } from "react";
import api from "./axios";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const usePushNotifications = () => {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered", registration);

      // Check if already subscribed
      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setSubscription(existingSubscription);
      }
    } catch (error) {
      console.error("Service Worker registration failed", error);
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Request permission explicitly
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Permission not granted for notifications");
        return;
      }

      // Get VAPID key from backend
      const response = await api.get("/notifications/vapid-public-key");
      const { publicKey } = response.data;
      console.log("VAPID Public Key:", publicKey);

      if (!publicKey) {
        throw new Error("VAPID Public Key is missing");
      }

      const convertedVapidKey = urlBase64ToUint8Array(publicKey);

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      console.log("User is subscribed:", newSubscription);
      setSubscription(newSubscription);

      // Send subscription to backend
      await api.post("/notifications/subscribe", newSubscription);
      alert("Successfully subscribed to notifications!");
    } catch (error) {
      console.error("Failed to subscribe the user: ", error);
      alert("Failed to subscribe to notifications. Check console for details.");
    }
  };

  return {
    subscription,
    subscribeToPush,
  };
};
