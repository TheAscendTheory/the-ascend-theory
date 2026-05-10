"use client";

import { useEffect, useRef } from "react";

export default function TradingViewAdvancedChart() {
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
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "NASDAQ:QQQ",
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      hide_side_toolbar: false,
      withdateranges: true,
      details: true,
      hotlist: true,
      support_host: "https://www.tradingview.com",
      watchlist: [
        "NASDAQ:QQQ",
        "AMEX:SPY",
        "NASDAQ:NVDA",
        "NASDAQ:TSLA",
        "NASDAQ:AAPL",
        "NASDAQ:MSFT",
        "COINBASE:BTCUSD",
        "COINBASE:ETHUSD",
        "TVC:DXY",
        "TVC:US10Y",
        "TVC:GOLD",
        "TVC:USOIL",
      ],
      studies: [
        "Volume@tv-basicstudies",
        "RSI@tv-basicstudies",
        "MASimple@tv-basicstudies",
      ],
    });

    container.appendChild(script);
  }, []);

  return <div ref={containerRef} className="advancedChartWidget" />;
}
