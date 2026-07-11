"use client";

import Script from "next/script";
import { useEffect, useId, useRef } from "react";

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

interface TurnstileFieldProps {
  siteKey: string;
  token: string;
  onTokenChange: (token: string) => void;
}

export function TurnstileField({
  siteKey,
  token,
  onTokenChange,
}: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const containerId = useId().replace(/:/g, "");

  useEffect(() => {
    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (nextToken) => onTokenChange(nextToken),
        "expired-callback": () => onTokenChange(""),
        "error-callback": () => onTokenChange(""),
        theme: "light",
      });
    };

    window.onTurnstileLoad = renderWidget;
    renderWidget();

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onTokenChange, siteKey]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad"
        strategy="afterInteractive"
      />
      <div
        id={containerId}
        ref={containerRef}
        className="flex min-h-[65px] justify-center"
      />
      <input type="hidden" name="turnstileToken" value={token} readOnly />
    </>
  );
}
