"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "../../lib/supabaseBrowser";

type Direction = "Long" | "Short";

type Trade = {
  id: string;
  date: string;
  symbol: string;
  direction: Direction;
  entry: number;
  exit: number;
  stop: number;
  size: number;
  fees: number;
  setup: string;
  notes: string;
};

type TradeRow = {
  id: string;
  trade_date: string;
  symbol: string;
  direction: Direction;
  entry: number;
  exit: number;
  stop: number;
  size: number;
  fees: number;
  setup: string;
  notes: string;
};

const emptyTrade = {
  date: new Date().toISOString().slice(0, 10),
  symbol: "QQQ",
  direction: "Long" as Direction,
  entry: "100",
  exit: "105",
  stop: "97",
  size: "10",
  fees: "0",
  setup: "Breakout",
  notes: "",
};

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function percent(value: number) {
  return `${value.toFixed(1)}%`;
}

function tradeProfit(trade: Trade) {
  const move =
    trade.direction === "Long"
      ? trade.exit - trade.entry
      : trade.entry - trade.exit;

  return move * trade.size - trade.fees;
}

function tradeRisk(trade: Trade) {
  return Math.abs(trade.entry - trade.stop) * trade.size;
}

function rowToTrade(row: TradeRow): Trade {
  return {
    id: row.id,
    date: row.trade_date,
    symbol: row.symbol,
    direction: row.direction,
    entry: Number(row.entry),
    exit: Number(row.exit),
    stop: Number(row.stop),
    size: Number(row.size),
    fees: Number(row.fees),
    setup: row.setup,
    notes: row.notes,
  };
}

function tradeToRow(trade: Trade, userId: string, source = "manual") {
  return {
    id: trade.id,
    user_id: userId,
    trade_date: trade.date,
    symbol: trade.symbol,
    direction: trade.direction,
    entry: trade.entry,
    exit: trade.exit,
    stop: trade.stop,
    size: trade.size,
    fees: trade.fees,
    setup: trade.setup,
    notes: trade.notes,
    source,
  };
}

export default function TradeJournal() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [form, setForm] = useState(emptyTrade);
  const [userId, setUserId] = useState("");
  const [syncStatus, setSyncStatus] = useState("Saved in this browser.");

  useEffect(() => {
    const savedTrades = window.localStorage.getItem("ascend-trade-journal");

    if (savedTrades) {
      setTrades(JSON.parse(savedTrades) as Trade[]);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    async function loadCloudTrades() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("ascend_user_trades")
        .select(
          "id, trade_date, symbol, direction, entry, exit, stop, size, fees, setup, notes"
        )
        .order("trade_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        setSyncStatus("Cloud sync is ready, but the journal table is not available yet.");
        return;
      }

      setTrades((data as TradeRow[]).map(rowToTrade));
      setSyncStatus("Synced to your Ascend profile.");
    }

    loadCloudTrades();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUserId("");
        setSyncStatus("Saved in this browser.");
        return;
      }

      setUserId(session.user.id);
      loadCloudTrades();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    window.localStorage.setItem("ascend-trade-journal", JSON.stringify(trades));
  }, [trades]);

  const stats = useMemo(() => {
    const profits = trades.map(tradeProfit);
    const wins = profits.filter((profit) => profit > 0);
    const losses = profits.filter((profit) => profit < 0);
    const grossProfit = wins.reduce((total, profit) => total + profit, 0);
    const grossLoss = losses.reduce((total, profit) => total + profit, 0);
    const netProfit = profits.reduce((total, profit) => total + profit, 0);
    const totalRisk = trades.reduce((total, trade) => total + tradeRisk(trade), 0);
    const profitFactor =
      grossLoss < 0 ? grossProfit / Math.abs(grossLoss) : grossProfit > 0 ? Infinity : 0;
    const averageR = totalRisk > 0 ? netProfit / totalRisk : 0;

    return {
      total: trades.length,
      wins: wins.length,
      losses: losses.length,
      winRate: trades.length ? (wins.length / trades.length) * 100 : 0,
      netProfit,
      grossProfit,
      grossLoss,
      profitFactor,
      averageR,
      profitability: trades.length ? (netProfit > 0 ? "Profitable" : "Not profitable yet") : "No trades logged",
    };
  }, [trades]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function addTrade(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trade: Trade = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()),
      date: form.date,
      symbol: form.symbol.trim().toUpperCase() || "UNKNOWN",
      direction: form.direction,
      entry: toNumber(form.entry),
      exit: toNumber(form.exit),
      stop: toNumber(form.stop),
      size: toNumber(form.size),
      fees: toNumber(form.fees),
      setup: form.setup.trim() || "Unlabeled",
      notes: form.notes.trim(),
    };

    setTrades((current) => [trade, ...current]);

    if (supabase && userId) {
      const { error } = await supabase
        .from("ascend_user_trades")
        .insert(tradeToRow(trade, userId));

      setSyncStatus(
        error ? "Saved locally. Cloud sync needs the journal table." : "Synced to your Ascend profile."
      );
    }

    setForm({
      ...emptyTrade,
      date: new Date().toISOString().slice(0, 10),
    });
  }

  async function removeTrade(id: string) {
    setTrades((current) => current.filter((trade) => trade.id !== id));

    if (supabase && userId) {
      await supabase.from("ascend_user_trades").delete().eq("id", id);
      setSyncStatus("Synced to your Ascend profile.");
    }
  }

  async function clearJournal() {
    setTrades([]);

    if (supabase && userId) {
      await supabase.from("ascend_user_trades").delete().eq("user_id", userId);
      setSyncStatus("Synced to your Ascend profile.");
    }
  }

  return (
    <div className="tradeJournal">
      <section className="journalStats" aria-label="Journal performance stats">
        <div>
          <span>Total Trades</span>
          <strong>{stats.total}</strong>
        </div>

        <div>
          <span>Win Rate</span>
          <strong>{percent(stats.winRate)}</strong>
        </div>

        <div>
          <span>Net P/L</span>
          <strong>{money(stats.netProfit)}</strong>
        </div>

        <div>
          <span>Profit Factor</span>
          <strong>
            {stats.profitFactor === Infinity
              ? "Perfect"
              : stats.profitFactor.toFixed(2)}
          </strong>
        </div>

        <div>
          <span>Average R</span>
          <strong>{stats.averageR.toFixed(2)}R</strong>
        </div>

        <div>
          <span>Profitability</span>
          <strong>{stats.profitability}</strong>
        </div>
      </section>

      <section className="journalWorkspace">
        <form onSubmit={addTrade} className="journalForm">
          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(event) => updateField("date", event.target.value)}
            />
          </label>

          <label>
            Symbol
            <input
              value={form.symbol}
              onChange={(event) => updateField("symbol", event.target.value)}
            />
          </label>

          <label>
            Direction
            <select
              value={form.direction}
              onChange={(event) =>
                updateField("direction", event.target.value as Direction)
              }
            >
              <option>Long</option>
              <option>Short</option>
            </select>
          </label>

          <label>
            Entry
            <input
              value={form.entry}
              inputMode="decimal"
              onChange={(event) => updateField("entry", event.target.value)}
            />
          </label>

          <label>
            Exit
            <input
              value={form.exit}
              inputMode="decimal"
              onChange={(event) => updateField("exit", event.target.value)}
            />
          </label>

          <label>
            Stop
            <input
              value={form.stop}
              inputMode="decimal"
              onChange={(event) => updateField("stop", event.target.value)}
            />
          </label>

          <label>
            Size
            <input
              value={form.size}
              inputMode="decimal"
              onChange={(event) => updateField("size", event.target.value)}
            />
          </label>

          <label>
            Fees
            <input
              value={form.fees}
              inputMode="decimal"
              onChange={(event) => updateField("fees", event.target.value)}
            />
          </label>

          <label>
            Setup
            <input
              value={form.setup}
              onChange={(event) => updateField("setup", event.target.value)}
            />
          </label>

          <label className="journalNotesField">
            Notes
            <textarea
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="What was the thesis? What did you learn?"
            />
          </label>

          <button type="submit">Log Trade</button>
        </form>

        <div className="journalTableWrap">
          <div className="journalTableHeader">
            <h3>Trade Log</h3>
            <button type="button" onClick={clearJournal}>
              Clear
            </button>
          </div>

          <div className="journalTable">
            {trades.length === 0 ? (
              <p className="emptyJournal">
                No trades logged yet. Add one trade to start tracking your win
                rate, profit factor, and profitability.
              </p>
            ) : (
              trades.map((trade) => {
                const profit = tradeProfit(trade);
                const risk = tradeRisk(trade);
                const rMultiple = risk > 0 ? profit / risk : 0;

                return (
                  <article key={trade.id} className="journalTrade">
                    <div>
                      <strong>{trade.symbol}</strong>
                      <span>
                        {trade.direction} - {trade.date}
                      </span>
                    </div>

                    <div>
                      <span>P/L</span>
                      <strong className={profit >= 0 ? "profitText" : "lossText"}>
                        {money(profit)}
                      </strong>
                    </div>

                    <div>
                      <span>R Multiple</span>
                      <strong>{rMultiple.toFixed(2)}R</strong>
                    </div>

                    <div>
                      <span>Setup</span>
                      <strong>{trade.setup}</strong>
                    </div>

                    <button type="button" onClick={() => removeTrade(trade.id)}>
                      Remove
                    </button>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <p className="accountStatus">{syncStatus}</p>
    </div>
  );
}
