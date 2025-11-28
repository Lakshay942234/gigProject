import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/auth.store";

// Declare the global function from the SDK
declare global {
  interface Window {
    km_show_iframe: (
      client: string,
      apiKey: string,
      initialQuery: string,
      container: HTMLElement,
      context: any,
      opts: any
    ) => any;
  }
}

export const KnowmaxWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<any>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!containerRef.current || !user) return;

    // Configuration
    const API_KEY = "24643a75-4953-4af7-9646-4e7dba6c9dc4";
    const CLIENT = "ksoft";

    const context = {
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
    };

    const opts = {
      recommendationQuery: "learning modules",
    };

    try {
      // Clear container before initializing to handle re-mounts and prevent duplicates
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      // Initialize the iFrame
      if (window.km_show_iframe) {
        iframeRef.current = window.km_show_iframe(
          CLIENT,
          API_KEY,
          "Phygital", // Empty initial search query as we want recommendations
          containerRef.current,
          context,
          opts
        );
      } else {
        console.error("Knowmax SDK not loaded");
      }
    } catch (error) {
      console.error("Failed to initialize Knowmax SDK:", error);
    }

    // Cleanup
    return () => {
      const iframeToClose = iframeRef.current;
      if (iframeToClose) {
        iframeToClose
          .close()
          .then(() => {
            // Only clear if the current ref is still the one we closed
            // This prevents wiping the new instance during StrictMode re-mounts
            if (containerRef.current && iframeRef.current === iframeToClose) {
              containerRef.current.innerHTML = "";
            }
          })
          .catch((err: any) =>
            console.error("Error closing Knowmax iframe:", err)
          );
      }
    };
  }, [user]); // Re-initialize if user changes

  return (
    <div
      ref={containerRef}
      id="km-box"
      className="w-full h-[600px] border rounded-lg shadow-sm bg-white"
    />
  );
};
