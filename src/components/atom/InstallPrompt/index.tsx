"use client";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

import { useState, useEffect } from "react";

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setIsIOS(
      //eslint-disable-next-line
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Listen for the beforeinstallprompt event on Android (Chrome)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the default install prompt
      e.preventDefault();
      setInstallPromptEvent(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  // If already in standalone mode (installed), don't show the prompt
  if (isStandalone) {
    return null;
  }

  // Handle the click on the install button (Android)
  const handleInstallClick = () => {
    if (installPromptEvent) {
      installPromptEvent.prompt(); // Show the install prompt
      installPromptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setInstallPromptEvent(null); // Reset the install prompt after the user has responded
      });
    }
  };

  return (
    <div>
      <h3>Install App</h3>
      <button onClick={handleInstallClick} disabled={!installPromptEvent}>
        Add to Home Screen
      </button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            ⎋
          </span>
          and then Add to Home Screen
          <span role="img" aria-label="plus icon">
            +
          </span>
          .
        </p>
      )}
    </div>
  );
}
