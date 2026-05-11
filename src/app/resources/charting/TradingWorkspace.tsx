"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Eye, EyeOff, Palette, SlidersHorizontal } from "lucide-react";
import TradingViewEconomicCalendar from "../economic-calendar/TradingViewEconomicCalendar";
import RiskCalculator from "../risk-calculator/RiskCalculator";
import TradeJournal from "../trade-journal/TradeJournal";
import AlertPlanner from "../market-dashboard/AlertPlanner";

type ToolKey = "watchlist" | "calendar" | "levels" | "flow" | "risk" | "journal" | "alerts" | "sessions";
type WorkspaceTheme = "dark" | "contrast" | "light";

const instruments = [
  { group: "Indices", symbols: ["NQ", "ES", "YM", "RTY", "SPX", "NASDAQ"] },
  { group: "Crypto", symbols: ["BTC", "ETH", "SOL", "XRP", "BNB", "AVAX"] },
  { group: "Stocks", symbols: ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "META"] },
  { group: "Metals", symbols: ["XAU/USD", "XAG/USD", "GC", "SI"] },
  { group: "Energy", symbols: ["WTI", "BRENT", "NG", "CL"] },
  { group: "Forex", symbols: ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CAD", "AUD/USD"] },
];

const structureLevels = [
  { label: "HTF Supply", value: "18,820 - 18,860", note: "Reaction zone above current price" },
  { label: "London High", value: "18,791.25", note: "Buy-side liquidity" },
  { label: "VWAP", value: "18,718.50", note: "Intraday fair value anchor" },
  { label: "NY Low", value: "18,603.75", note: "Protected sell-side liquidity" },
];

const orderFlowReads = [
  { label: "Volume Profile", value: "Value building near VWAP", status: "Useful" },
  { label: "Delta", value: "Buyers defending pullbacks", status: "Watch" },
  { label: "Tape", value: "Large prints near highs fading", status: "Caution" },
];

const sessions = [
  { label: "Asia", window: "20:00 - 00:00 ET", note: "Range creation" },
  { label: "London", window: "02:00 - 05:00 ET", note: "Liquidity expansion" },
  { label: "NY Open", window: "08:30 - 11:00 ET", note: "Main execution window" },
  { label: "NY PM", window: "13:30 - 15:30 ET", note: "Continuation or reversal" },
];

const toolLabels: Record<ToolKey, string> = {
  watchlist: "Watchlist",
  calendar: "Calendar",
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

  return (
    <section className={`tradingWorkspace ${theme}`} aria-label="One page trading workspace">
      <div className="workspaceControls">
        <div>
          <p className="eyebrow">Workspace Controls</p>
          <h2>Build the desk around the trade.</h2>
          <p>{activeCount} tools visible. Your layout and contrast choice stay saved on this device.</p>
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
                    <span key={symbol}>{symbol}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </ToolShell>

        <ToolShell id="levels" title="Structure Levels" visible={visibleTools.levels} onToggle={toggleTool}>
          <div className="structureLevelList">
            {structureLevels.map((level) => (
              <article key={level.label}>
                <span>{level.label}</span>
                <strong>{level.value}</strong>
                <p>{level.note}</p>
              </article>
            ))}
          </div>
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

        <ToolShell id="alerts" title="Alert Planner" visible={visibleTools.alerts} onToggle={toggleTool}>
          <AlertPlanner />
        </ToolShell>

        <ToolShell id="flow" title="Order Flow Notes" visible={visibleTools.flow} onToggle={toggleTool}>
          <div className="flowNoteList">
            {orderFlowReads.map((read) => (
              <article key={read.label}>
                <span>{read.status}</span>
                <strong>{read.label}</strong>
                <p>{read.value}</p>
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
