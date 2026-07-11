"use client";

import { useEffect, useRef, useState } from "react";

import { useTurnstile } from "@/components/turnstile-provider";
import { cn } from "@/lib/utils";

export function TurnstileField() {
  const { token, setToken, siteKey, registerOnReady } = useTurnstile();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);

  useEffect(() => {
    if (!siteKey) {
      return;
    }

    const container = containerRef.current;
    const observer = new MutationObserver(() => {
      if (container?.firstElementChild) {
        setIsWidgetVisible(true);
      }
    });

    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }

    const renderWidget = () => {
      if (!container || !window.turnstile || widgetIdRef.current) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: siteKey,
        callback: (nextToken) => setToken(nextToken),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
        theme: "light",
      });
    };

    const unregister = registerOnReady(renderWidget);
    renderWidget();

    return () => {
      unregister();
      observer.disconnect();

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [registerOnReady, setToken, siteKey]);

  return (
    <>
      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
          isWidgetVisible ? "max-h-20 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div ref={containerRef} className="flex min-h-[65px] justify-center" />
      </div>
      <input type="hidden" name="turnstileToken" value={token} readOnly />
    </>
  );
}
