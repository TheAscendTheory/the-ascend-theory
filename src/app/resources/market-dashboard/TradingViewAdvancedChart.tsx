"use client";

import { useEffect, useRef } from "react";

const symbolMap: Record<string, string> = {
  NQ: "CME_MINI:NQ1!",
  ES: "CME_MINI:ES1!",
  YM: "CBOT_MINI:YM1!",
  RTY: "CME_MINI:RTY1!",
  SPX: "SP:SPX",
  NASDAQ: "NASDAQ:IXIC",
  BTC: "COINBASE:BTCUSD",
  ETH: "COINBASE:ETHUSD",
  SOL: "COINBASE:SOLUSD",
  XRP: "COINBASE:XRPUSD",
  AAPL: "NASDAQ:AAPL",
  TSLA: "NASDAQ:TSLA",
  NVDA: "NASDAQ:NVDA",
  MSFT: "NASDAQ:MSFT",
  AMZN: "NASDAQ:AMZN",
  META: "NASDAQ:META",
  "XAU/USD": "OANDA:XAUUSD",
  "XAG/USD": "OANDA:XAGUSD",
  WTI: "TVC:USOIL",
  BRENT: "TVC:UKOIL",
  "EUR/USD": "FX:EURUSD",
  "GBP/USD": "FX:GBPUSD",
  "USD/JPY": "FX:USDJPY",
  "USD/CAD": "FX:USDCAD",
  "AUD/USD": "FX:AUDUSD",
};

export default function TradingViewAdvancedChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function renderChart(activeSymbol = "NQ") {
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
      symbol: symbolMap[activeSymbol] || activeSymbol,
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
    }

    renderChart(window.localStorage.getItem("ascend-trading-desk-symbol") || "NQ");

    function handleSymbolChange(event: Event) {
      renderChart(String((event as CustomEvent<string>).detail || "NQ"));
    }

    window.addEventListener("ascend-symbol-change", handleSymbolChange);

    return () => window.removeEventListener("ascend-symbol-change", handleSymbolChange);
  }, []);

  return <div ref={containerRef} className="advancedChartWidget" />;
}
