"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

type TurnstileContextValue = {
  token: string;
  setToken: (token: string) => void;
  isReady: boolean;
  siteKey: string | undefined;
  registerOnReady: (callback: () => void) => () => void;
};

const TurnstileContext = createContext<TurnstileContextValue | null>(null);

export function useTurnstile() {
  const context = useContext(TurnstileContext);

  if (!context) {
    throw new Error("useTurnstile must be used within TurnstileProvider");
  }

  return context;
}

export function TurnstileProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState("");
  const [isReady, setIsReady] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const readyCallbacksRef = useRef<Set<() => void>>(new Set());

  const registerOnReady = useCallback(
    (callback: () => void) => {
      readyCallbacksRef.current.add(callback);

      if (isReady && window.turnstile) {
        callback();
      }

      return () => {
        readyCallbacksRef.current.delete(callback);
      };
    },
    [isReady],
  );

  useEffect(() => {
    const onLoad = () => {
      setIsReady(true);
      readyCallbacksRef.current.forEach((callback) => callback());
    };

    window.onTurnstileLoad = onLoad;

    if (window.turnstile) {
      onLoad();
    }
  }, []);

  return (
    <TurnstileContext.Provider
      value={{ token, setToken, isReady, siteKey, registerOnReady }}
    >
      {siteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad"
          strategy="afterInteractive"
        />
      ) : null}
      {children}
    </TurnstileContext.Provider>
  );
}
