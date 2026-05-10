"use client";

import { useEffect, useRef } from "react";

export default function TradingViewEconomicCalendar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.innerHTML = "";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    container.appendChild(widget);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      isTransparent: true,
      width: "100%",
      height: 720,
      locale: "en",
      importanceFilter: "-1,0,1",
      countryFilter: "us,eu,gb,ca,jp,cn,au,nz,ch",
    });

    container.appendChild(script);
  }, []);

  return <div ref={containerRef} className="economicCalendarWidget" />;
}
