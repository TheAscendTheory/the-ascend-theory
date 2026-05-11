"use client";

import { useMemo, useState } from "react";

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function AlertPlanner({ initialSymbol = "NQ" }: { initialSymbol?: string }) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [currentPrice, setCurrentPrice] = useState("430");
  const [alertPrice, setAlertPrice] = useState("440");
  const [reason, setReason] = useState("Breakout confirmation");

  const distance = useMemo(() => {
    const current = toNumber(currentPrice);
    const alert = toNumber(alertPrice);
    const difference = alert - current;
    const percent = current > 0 ? (difference / current) * 100 : 0;

    return {
      dollars: difference,
      percent,
    };
  }, [currentPrice, alertPrice]);

  return (
    <div className="alertPlanner">
      <div className="alertPlannerInputs">
        <label>
          Symbol
          <input
            value={symbol}
            onChange={(event) => setSymbol(event.target.value.toUpperCase())}
          />
        </label>

        <label>
          Current Price
          <input
            value={currentPrice}
            onChange={(event) => setCurrentPrice(event.target.value)}
            inputMode="decimal"
          />
        </label>

        <label>
          Alert Price
          <input
            value={alertPrice}
            onChange={(event) => setAlertPrice(event.target.value)}
            inputMode="decimal"
          />
        </label>

        <label>
          Reason
          <input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>
      </div>

      <div className="alertPlannerOutput">
        <p className="eyebrow">{symbol || "Symbol"} alert setup</p>
        <h3>{symbol || "Symbol"} Alert</h3>
        <p>
          Watch for {symbol || "this asset"} near {alertPrice || "your level"}.
          The level is {Math.abs(distance.dollars).toFixed(2)} points away,
          about {Math.abs(distance.percent).toFixed(2)}% from the entered
          current price.
        </p>
        <p>
          Reason: <strong>{reason || "Add your thesis before the alert."}</strong>
        </p>
      </div>
    </div>
  );
}
