"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "../../lib/supabaseBrowser";

type Direction = "Long" | "Short";

type Position = {
  id: string;
  openedAt: string;
  symbol: string;
  direction: Direction;
  entry: number;
  stop: number;
  size: number;
  fees: number;
  setup: string;
  notes: string;
};

type JournalTrade = {
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

type DemoPositionRow = {
  id: string;
  opened_at: string;
  symbol: string;
  direction: Direction;
  entry: number;
  stop: number;
  size: number;
  fees: number;
  setup: string;
  notes: string;
};

const accountKey = "ascend-demo-account";
const positionsKey = "ascend-demo-positions";
const journalKey = "ascend-trade-journal";

const defaultAccount = {
  startingBalance: 100000,
  balance: 100000,
};

const defaultOrder = {
  symbol: "QQQ",
  direction: "Long" as Direction,
  entry: "100",
  stop: "95",
  size: "10",
  fees: "0",
  setup: "Practice setup",
  notes: "",
};

function readStoredAccount() {
  try {
    const savedAccount = window.localStorage.getItem(accountKey);
    return savedAccount
      ? (JSON.parse(savedAccount) as typeof defaultAccount)
      : defaultAccount;
  } catch {
    return defaultAccount;
  }
}

function readStoredPositions() {
  try {
    const savedPositions = window.localStorage.getItem(positionsKey);
    return savedPositions ? (JSON.parse(savedPositions) as Position[]) : [];
  } catch {
    return [];
  }
}

function makeClosePriceMap(positions: Position[]) {
  return Object.fromEntries(
    positions.map((position) => [position.id, String(position.entry)])
  );
}

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
  return `${value.toFixed(2)}%`;
}

function positionProfit(position: Position, price: number) {
  const move =
    position.direction === "Long"
      ? price - position.entry
      : position.entry - price;

  return move * position.size - position.fees;
}

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now());
}

function rowToPosition(row: DemoPositionRow): Position {
  return {
    id: row.id,
    openedAt: row.opened_at,
    symbol: row.symbol,
    direction: row.direction,
    entry: Number(row.entry),
    stop: Number(row.stop),
    size: Number(row.size),
    fees: Number(row.fees),
    setup: row.setup,
    notes: row.notes,
  };
}

function positionToRow(position: Position, userId: string) {
  return {
    id: position.id,
    user_id: userId,
    opened_at: position.openedAt,
    symbol: position.symbol,
    direction: position.direction,
    entry: position.entry,
    stop: position.stop,
    size: position.size,
    fees: position.fees,
    setup: position.setup,
    notes: position.notes,
  };
}

function journalTradeToRow(trade: JournalTrade, userId: string) {
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
    source: "demo",
  };
}

export default function DemoTrading() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [startingBalanceInput, setStartingBalanceInput] = useState("100000");
  const [account, setAccount] = useState(defaultAccount);
  const [positions, setPositions] = useState<Position[]>([]);
  const [order, setOrder] = useState(defaultOrder);
  const [closePrices, setClosePrices] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const restoreDemoState = window.setTimeout(() => {
      const storedAccount = readStoredAccount();
      const storedPositions = readStoredPositions();

      setAccount(storedAccount);
      setStartingBalanceInput(String(storedAccount.startingBalance));
      setPositions(storedPositions);
      setClosePrices(makeClosePriceMap(storedPositions));
      setStorageReady(true);
    }, 0);

    return () => window.clearTimeout(restoreDemoState);
  }, []);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    window.localStorage.setItem(accountKey, JSON.stringify(account));
  }, [account, storageReady]);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    window.localStorage.setItem(positionsKey, JSON.stringify(positions));
  }, [positions, storageReady]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;

    async function loadCloudDemo() {
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        return;
      }

      setUserId(user.id);

      const accountResult = await client
        .from("ascend_demo_accounts")
        .select("starting_balance, balance")
        .maybeSingle();
      const positionsResult = await client
        .from("ascend_demo_positions")
        .select(
          "id, opened_at, symbol, direction, entry, stop, size, fees, setup, notes"
        )
        .order("created_at", { ascending: false });

      if (accountResult.data) {
        const cloudAccount = {
          startingBalance: Number(accountResult.data.starting_balance),
          balance: Number(accountResult.data.balance),
        };

        setAccount(cloudAccount);
        setStartingBalanceInput(String(cloudAccount.startingBalance));
      }

      if (positionsResult.data) {
        const cloudPositions = (positionsResult.data as DemoPositionRow[]).map(
          rowToPosition
        );

        setPositions(cloudPositions);
        setClosePrices(
          Object.fromEntries(
            cloudPositions.map((position) => [position.id, String(position.entry)])
          )
        );
      }

      if (accountResult.error || positionsResult.error) {
        setStatus("Saved in this browser.");
      } else {
        setStatus("Demo account synced to your Ascend profile.");
      }
    }

    loadCloudDemo();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUserId("");
        return;
      }

      setUserId(session.user.id);
      loadCloudDemo();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const metrics = useMemo(() => {
    const openProfit = positions.reduce((total, position) => {
      const price = toNumber(closePrices[position.id] || String(position.entry));
      return total + positionProfit(position, price);
    }, 0);
    const realizedProfit = account.balance - account.startingBalance;
    const equity = account.balance + openProfit;
    const returnPercent =
      account.startingBalance > 0
        ? ((equity - account.startingBalance) / account.startingBalance) * 100
        : 0;

    return {
      openProfit,
      realizedProfit,
      equity,
      returnPercent,
    };
  }, [account, positions, closePrices]);

  function updateOrder(field: keyof typeof order, value: string) {
    setOrder((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function createDemoAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const startingBalance = Math.max(toNumber(startingBalanceInput), 0);

    setAccount({
      startingBalance,
      balance: startingBalance,
    });
    setPositions([]);
    setClosePrices({});
    setStatus("Demo account reset.");

    if (supabase && userId) {
      await supabase.from("ascend_demo_accounts").upsert({
        user_id: userId,
        starting_balance: startingBalance,
        balance: startingBalance,
        updated_at: new Date().toISOString(),
      });
      await supabase.from("ascend_demo_positions").delete().eq("user_id", userId);
      setStatus("Demo account reset and synced to your profile.");
    }
  }

  async function openPosition(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const position: Position = {
      id: makeId(),
      openedAt: new Date().toISOString().slice(0, 10),
      symbol: order.symbol.trim().toUpperCase() || "UNKNOWN",
      direction: order.direction,
      entry: toNumber(order.entry),
      stop: toNumber(order.stop),
      size: toNumber(order.size),
      fees: toNumber(order.fees),
      setup: order.setup.trim() || "Practice setup",
      notes: order.notes.trim(),
    };

    setPositions((current) => [position, ...current]);
    setClosePrices((current) => ({
      ...current,
      [position.id]: String(position.entry),
    }));
    setStatus(`${position.symbol} demo position opened.`);

    if (supabase && userId) {
      const { error } = await supabase
        .from("ascend_demo_positions")
        .insert(positionToRow(position, userId));

      setStatus(
        error
          ? `${position.symbol} demo position opened.`
          : `${position.symbol} demo position opened and synced.`
      );
    }
  }

  async function closePosition(position: Position) {
    const exit = toNumber(closePrices[position.id] || String(position.entry));
    const profit = positionProfit(position, exit);
    const journalTrade: JournalTrade = {
      id: makeId(),
      date: new Date().toISOString().slice(0, 10),
      symbol: position.symbol,
      direction: position.direction,
      entry: position.entry,
      exit,
      stop: position.stop,
      size: position.size,
      fees: position.fees,
      setup: `Demo - ${position.setup}`,
      notes: position.notes || "Closed from the demo trading simulator.",
    };
    const savedJournal = window.localStorage.getItem(journalKey);
    const journal = savedJournal
      ? (JSON.parse(savedJournal) as JournalTrade[])
      : [];

    window.localStorage.setItem(
      journalKey,
      JSON.stringify([journalTrade, ...journal])
    );
    setAccount((current) => ({
      ...current,
      balance: current.balance + profit,
    }));
    setPositions((current) =>
      current.filter((currentPosition) => currentPosition.id !== position.id)
    );
    setClosePrices((current) => {
      const next = { ...current };
      delete next[position.id];
      return next;
    });
    setStatus(
      `${position.symbol} closed for ${money(profit)} and sent to the journal.`
    );

    if (supabase && userId) {
      await supabase
        .from("ascend_demo_accounts")
        .upsert({
          user_id: userId,
          starting_balance: account.startingBalance,
          balance: account.balance + profit,
          updated_at: new Date().toISOString(),
        });
      await supabase.from("ascend_demo_positions").delete().eq("id", position.id);
      await supabase
        .from("ascend_user_trades")
        .insert(journalTradeToRow(journalTrade, userId));
      setStatus(
        `${position.symbol} closed for ${money(profit)} and synced to the journal.`
      );
    }
  }

  return (
    <div className="demoSimulator">
      <section className="journalStats" aria-label="Demo account metrics">
        <div>
          <span>Starting Balance</span>
          <strong>{money(account.startingBalance)}</strong>
        </div>

        <div>
          <span>Cash Balance</span>
          <strong>{money(account.balance)}</strong>
        </div>

        <div>
          <span>Open P/L</span>
          <strong className={metrics.openProfit >= 0 ? "profitText" : "lossText"}>
            {money(metrics.openProfit)}
          </strong>
        </div>

        <div>
          <span>Equity</span>
          <strong>{money(metrics.equity)}</strong>
        </div>

        <div>
          <span>Return</span>
          <strong>{percent(metrics.returnPercent)}</strong>
        </div>

        <div>
          <span>Open Trades</span>
          <strong>{positions.length}</strong>
        </div>
      </section>

      <section className="demoAccountSetup">
        <form onSubmit={createDemoAccount} className="journalForm compactForm">
          <label>
            Demo Starting Balance
            <input
              value={startingBalanceInput}
              onChange={(event) => setStartingBalanceInput(event.target.value)}
              inputMode="decimal"
            />
          </label>

          <button type="submit">Reset Demo Account</button>
        </form>

        {status && <p className="accountStatus">{status}</p>}
      </section>

      <section className="journalWorkspace">
        <form onSubmit={openPosition} className="journalForm">
          <label>
            Symbol
            <input
              value={order.symbol}
              onChange={(event) => updateOrder("symbol", event.target.value)}
            />
          </label>

          <label>
            Direction
            <select
              value={order.direction}
              onChange={(event) =>
                updateOrder("direction", event.target.value as Direction)
              }
            >
              <option>Long</option>
              <option>Short</option>
            </select>
          </label>

          <label>
            Entry
            <input
              value={order.entry}
              onChange={(event) => updateOrder("entry", event.target.value)}
              inputMode="decimal"
            />
          </label>

          <label>
            Stop
            <input
              value={order.stop}
              onChange={(event) => updateOrder("stop", event.target.value)}
              inputMode="decimal"
            />
          </label>

          <label>
            Size
            <input
              value={order.size}
              onChange={(event) => updateOrder("size", event.target.value)}
              inputMode="decimal"
            />
          </label>

          <label>
            Fees
            <input
              value={order.fees}
              onChange={(event) => updateOrder("fees", event.target.value)}
              inputMode="decimal"
            />
          </label>

          <label>
            Setup
            <input
              value={order.setup}
              onChange={(event) => updateOrder("setup", event.target.value)}
            />
          </label>

          <label className="journalNotesField">
            Notes
            <textarea
              value={order.notes}
              onChange={(event) => updateOrder("notes", event.target.value)}
              placeholder="What are you practicing?"
            />
          </label>

          <button type="submit">Open Demo Trade</button>
        </form>

        <div className="journalTableWrap">
          <div className="journalTableHeader">
            <h3>Open Positions</h3>
          </div>

          <div className="journalTable">
            {positions.length === 0 ? (
              <p className="emptyJournal">
                No open demo positions. Open a practice trade to start building
                execution reps.
              </p>
            ) : (
              positions.map((position) => {
                const exit = toNumber(
                  closePrices[position.id] || String(position.entry)
                );
                const profit = positionProfit(position, exit);

                return (
                  <article key={position.id} className="demoPosition">
                    <div>
                      <strong>{position.symbol}</strong>
                      <span>
                        {position.direction} - Entry {position.entry}
                      </span>
                    </div>

                    <label>
                      Simulated Close Price
                      <input
                        value={closePrices[position.id] || ""}
                        onChange={(event) =>
                          setClosePrices((current) => ({
                            ...current,
                            [position.id]: event.target.value,
                          }))
                        }
                        inputMode="decimal"
                      />
                    </label>

                    <div>
                      <span>Open P/L</span>
                      <strong className={profit >= 0 ? "profitText" : "lossText"}>
                        {money(profit)}
                      </strong>
                    </div>

                    <button type="button" onClick={() => closePosition(position)}>
                      Close To Journal
                    </button>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
