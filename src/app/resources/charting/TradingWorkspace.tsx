"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Eye, EyeOff, Palette, SlidersHorizontal } from "lucide-react";
import TradingViewEconomicCalendar from "../economic-calendar/TradingViewEconomicCalendar";
import RiskCalculator from "../risk-calculator/RiskCalculator";
import TradeJournal from "../trade-journal/TradeJournal";
import AlertPlanner from "../market-dashboard/AlertPlanner";
import NewsFlowClient from "../../news/NewsFlowClient";

type ToolKey = "watchlist" | "calendar" | "news" | "levels" | "flow" | "risk" | "journal" | "alerts" | "sessions";
type WorkspaceTheme = "dark" | "contrast" | "light";

const instruments = [
  { group: "Indices", symbols: ["NQ", "ES", "YM", "RTY", "SPX", "NASDAQ"] },
  { group: "Crypto", symbols: ["BTC", "ETH", "SOL", "XRP", "BNB", "AVAX"] },
  { group: "Stocks", symbols: ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "META"] },
  { group: "Metals", symbols: ["XAU/USD", "XAG/USD", "GC", "SI"] },
  { group: "Energy", symbols: ["WTI", "BRENT", "NG", "CL"] },
  { group: "Forex", symbols: ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CAD", "AUD/USD"] },
];

const symbolNotes: Record<string, { bias: string; levels: string[]; flow: string[] }> = {
  NQ: {
    bias: "Index momentum asset. Confirm direction with NASDAQ breadth and high-impact event timing.",
    levels: ["Prior session high", "VWAP", "Opening range", "Prior session low"],
    flow: ["Watch absorption at VWAP", "Track failed breakouts near prior high", "Note large prints after data releases"],
  },
  ES: {
    bias: "Broad index benchmark. Use it for clean macro confirmation before taking correlated trades.",
    levels: ["Weekly open", "Prior day high", "VWAP", "Prior day low"],
    flow: ["Compare NQ strength", "Mark volume acceptance above VWAP", "Watch NY open impulse"],
  },
  BTC: {
    bias: "Crypto liquidity leader. Respect weekend gaps, funding shifts, and risk-on/risk-off headlines.",
    levels: ["Asia range high", "Daily open", "VWAP", "Asia range low"],
    flow: ["Track liquidation sweeps", "Watch spot/perp divergence", "Note ETF and macro headline reaction"],
  },
  "XAU/USD": {
    bias: "Gold reacts strongly to real yields, dollar movement, inflation data, and geopolitical stress.",
    levels: ["Prior day high", "London high", "VWAP", "Prior day low"],
    flow: ["Compare DXY", "Watch rejection after yield spikes", "Mark news-driven volume bursts"],
  },
};

function selectedSymbolPlan(symbol: string) {
  return (
    symbolNotes[symbol] || {
      bias: `${symbol} is the active desk symbol. Use the same symbol across watchlist, levels, alerts, notes, risk, and journal.`,
      levels: ["Higher-timeframe supply", "Session high", "VWAP", "Session low"],
      flow: ["Define current auction", "Mark aggressive buying or selling", "Record invalidation before entry"],
    }
  );
}

const sessions = [
  { label: "Asia", window: "20:00 - 00:00 ET", note: "Range creation" },
  { label: "London", window: "02:00 - 05:00 ET", note: "Liquidity expansion" },
  { label: "NY Open", window: "08:30 - 11:00 ET", note: "Main execution window" },
  { label: "NY PM", window: "13:30 - 15:30 ET", note: "Continuation or reversal" },
];

const toolLabels: Record<ToolKey, string> = {
  watchlist: "Watchlist",
  calendar: "Calendar",
  news: "News Flow",
  levels: "Structure",
  flow: "Flow Notes",
  risk: "Risk Calculator",
  journal: "Trade Journal",
  alerts: "Alerts",
  sessions: "Sessions",
};

const layoutStorageKey = "ascend-trading-desk-layout";

const minimalLayout: Record<ToolKey, boolean> = {
  watchlist: true,
  calendar: false,
  news: false,
  levels: false,
  flow: false,
  risk: true,
  journal: false,
  alerts: false,
  sessions: false,
};

const planningLayout: Record<ToolKey, boolean> = {
  watchlist: true,
  calendar: true,
  news: true,
  levels: true,
  flow: false,
  risk: true,
  journal: false,
  alerts: true,
  sessions: true,
};

const reviewLayout: Record<ToolKey, boolean> = {
  watchlist: false,
  calendar: false,
  news: true,
  levels: false,
  flow: false,
  risk: true,
  journal: true,
  alerts: false,
  sessions: false,
};

function ToolShell({
  id,
  title,
  visible,
  wide = false,
  onToggle,
  children,
}: {
  id: ToolKey;
  title: string;
  visible: boolean;
  wide?: boolean;
  onToggle: (id: ToolKey) => void;
  children: React.ReactNode;
}) {
  return (
    <section className={`${visible ? "workspacePanel" : "workspacePanel isCollapsed"}${wide ? " isWide" : ""}`}>
      <button type="button" className="workspacePanelToggle" onClick={() => onToggle(id)}>
        <span>{title}</span>
        {visible ? <ChevronDown size={18} /> : <EyeOff size={18} />}
      </button>
      {visible && <div className="workspacePanelBody">{children}</div>}
    </section>
  );
}

export default function TradingWorkspace() {
  const [visibleTools, setVisibleTools] = useState<Record<ToolKey, boolean>>(planningLayout);
  const [theme, setTheme] = useState<WorkspaceTheme>("dark");
  const [selectedSymbol, setSelectedSymbol] = useState("NQ");

  const activeCount = useMemo(
    () => Object.values(visibleTools).filter(Boolean).length,
    [visibleTools]
  );

  useEffect(() => {
    const restoreLayout = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(layoutStorageKey);
        if (!saved) return;

        const parsed = JSON.parse(saved) as {
          visibleTools?: Partial<Record<ToolKey, boolean>>;
          theme?: WorkspaceTheme;
        };

        setVisibleTools((current) => ({ ...current, ...parsed.visibleTools }));
        if (parsed.theme === "dark" || parsed.theme === "contrast" || parsed.theme === "light") {
          setTheme(parsed.theme);
        }
      } catch {
        return;
      }
    }, 0);

    return () => window.clearTimeout(restoreLayout);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(layoutStorageKey, JSON.stringify({ visibleTools, theme }));
  }, [theme, visibleTools]);

  useEffect(() => {
    window.localStorage.setItem("ascend-trading-desk-symbol", selectedSymbol);
    window.dispatchEvent(new CustomEvent("ascend-symbol-change", { detail: selectedSymbol }));
  }, [selectedSymbol]);

  function toggleTool(tool: ToolKey) {
    setVisibleTools((current) => ({
      ...current,
      [tool]: !current[tool],
    }));
  }

  function setMinimal() {
    setVisibleTools(minimalLayout);
  }

  function setPlanning() {
    setVisibleTools(planningLayout);
  }

  function setReview() {
    setVisibleTools(reviewLayout);
  }

  const symbolPlan = selectedSymbolPlan(selectedSymbol);

  return (
    <section className={`tradingWorkspace ${theme}`} aria-label="One page trading workspace">
      <div className="workspaceControls">
        <div>
          <p className="eyebrow">Active Desk: {selectedSymbol}</p>
          <h2>One symbol, one plan.</h2>
          <p>{symbolPlan.bias}</p>
        </div>

        <div className="workspaceControlActions">
          <button type="button" onClick={setMinimal}>
            <Eye size={16} />
            Minimal
          </button>
          <button type="button" onClick={setPlanning}>
            <SlidersHorizontal size={16} />
            Planning
          </button>
          <button type="button" onClick={setReview}>
            <SlidersHorizontal size={16} />
            Review
          </button>
          <label>
            <Palette size={16} />
            <select value={theme} onChange={(event) => setTheme(event.target.value as WorkspaceTheme)}>
              <option value="dark">Dark</option>
              <option value="contrast">High Contrast</option>
              <option value="light">Light</option>
            </select>
          </label>
        </div>
      </div>

      <div className="activeSymbolBar" aria-label="Active trading desk symbol">
        <span>Selected symbol</span>
        <strong>{selectedSymbol}</strong>
        <p>{activeCount} tools visible. Layout and contrast stay saved on this device.</p>
      </div>

      <div className="workspaceToolChips">
        {(Object.keys(toolLabels) as ToolKey[]).map((tool) => (
          <button
            key={tool}
            type="button"
            className={visibleTools[tool] ? "isActive" : ""}
            aria-pressed={visibleTools[tool]}
            onClick={() => toggleTool(tool)}
          >
            {visibleTools[tool] ? <Eye size={14} /> : <EyeOff size={14} />}
            {toolLabels[tool]}
          </button>
        ))}
      </div>

      <div className="workspacePanelGrid">
        <ToolShell id="watchlist" title="Asset Watchlist" visible={visibleTools.watchlist} onToggle={toggleTool}>
          <div className="assetWatchlist">
            {instruments.map((group) => (
              <article key={group.group}>
                <strong>{group.group}</strong>
                <div>
                  {group.symbols.map((symbol) => (
                    <button
                      key={symbol}
                      type="button"
                      className={symbol === selectedSymbol ? "isSelected" : ""}
                      onClick={() => setSelectedSymbol(symbol)}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </ToolShell>

        <ToolShell id="levels" title={`${selectedSymbol} Structure Levels`} visible={visibleTools.levels} onToggle={toggleTool}>
          <div className="structureLevelList">
            {symbolPlan.levels.map((level, index) => (
              <article key={level}>
                <span>{selectedSymbol} Level {index + 1}</span>
                <strong>{level}</strong>
                <p>Use this as a manual planning marker until the chart confirms reaction, acceptance, or invalidation.</p>
              </article>
            ))}
          </div>
        </ToolShell>

        <ToolShell id="news" title={`${selectedSymbol} Market News Flow`} visible={visibleTools.news} onToggle={toggleTool} wide>
          <NewsFlowClient compact />
        </ToolShell>

        <ToolShell id="risk" title="Risk Calculator" visible={visibleTools.risk} onToggle={toggleTool}>
          <RiskCalculator />
        </ToolShell>

        <ToolShell id="sessions" title="Session Timing" visible={visibleTools.sessions} onToggle={toggleTool}>
          <div className="sessionToolList">
            {sessions.map((session) => (
              <article key={session.label}>
                <span>{session.label}</span>
                <strong>{session.window}</strong>
                <p>{session.note}</p>
              </article>
            ))}
          </div>
        </ToolShell>

        <ToolShell id="alerts" title={`${selectedSymbol} Alert Planner`} visible={visibleTools.alerts} onToggle={toggleTool}>
          <AlertPlanner key={selectedSymbol} initialSymbol={selectedSymbol} />
        </ToolShell>

        <ToolShell id="flow" title={`${selectedSymbol} Order Flow Notes`} visible={visibleTools.flow} onToggle={toggleTool}>
          <div className="flowNoteList">
            {symbolPlan.flow.map((read, index) => (
              <article key={read}>
                <span>{selectedSymbol} Read {index + 1}</span>
                <strong>{read}</strong>
                <p>Write what price is proving now, not what you hope it proves later.</p>
              </article>
            ))}
          </div>
        </ToolShell>

        <ToolShell id="calendar" title="Economic Calendar" visible={visibleTools.calendar} onToggle={toggleTool} wide>
          <TradingViewEconomicCalendar compact />
        </ToolShell>

        <ToolShell id="journal" title="Trade Journal" visible={visibleTools.journal} onToggle={toggleTool}>
          <TradeJournal />
        </ToolShell>
      </div>
    </section>
  );
}
