"use client";

import { useMemo, useState } from "react";

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

function number(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(value);
}

export default function RiskCalculator() {
  const [accountSize, setAccountSize] = useState("1000");
  const [riskPercent, setRiskPercent] = useState("1");
  const [entryPrice, setEntryPrice] = useState("100");
  const [stopPrice, setStopPrice] = useState("95");
  const [targetPrice, setTargetPrice] = useState("110");

  const result = useMemo(() => {
    const account = toNumber(accountSize);
    const risk = toNumber(riskPercent);
    const entry = toNumber(entryPrice);
    const stop = toNumber(stopPrice);
    const target = toNumber(targetPrice);
    const riskDollars = account * (risk / 100);
    const riskPerUnit = Math.abs(entry - stop);
    const rewardPerUnit = Math.abs(target - entry);
    const positionSize = riskPerUnit > 0 ? riskDollars / riskPerUnit : 0;
    const positionValue = positionSize * entry;
    const rewardDollars = positionSize * rewardPerUnit;
    const riskReward = riskPerUnit > 0 ? rewardPerUnit / riskPerUnit : 0;

    return {
      riskDollars,
      riskPerUnit,
      positionSize,
      positionValue,
      rewardDollars,
      riskReward,
    };
  }, [accountSize, riskPercent, entryPrice, stopPrice, targetPrice]);

  return (
    <div className="riskCalculator">
      <div className="calculatorInputs">
        <label>
          Account Size
          <input
            value={accountSize}
            onChange={(event) => setAccountSize(event.target.value)}
            inputMode="decimal"
          />
        </label>

        <label>
          Risk %
          <input
            value={riskPercent}
            onChange={(event) => setRiskPercent(event.target.value)}
            inputMode="decimal"
          />
        </label>

        <label>
          Entry Price
          <input
            value={entryPrice}
            onChange={(event) => setEntryPrice(event.target.value)}
            inputMode="decimal"
          />
        </label>

        <label>
          Stop Price
          <input
            value={stopPrice}
            onChange={(event) => setStopPrice(event.target.value)}
            inputMode="decimal"
          />
        </label>

        <label>
          Target Price
          <input
            value={targetPrice}
            onChange={(event) => setTargetPrice(event.target.value)}
            inputMode="decimal"
          />
        </label>
      </div>

      <div className="calculatorResults" aria-live="polite">
        <div>
          <span>Dollar Risk</span>
          <strong>{money(result.riskDollars)}</strong>
        </div>

        <div>
          <span>Risk Per Unit</span>
          <strong>{money(result.riskPerUnit)}</strong>
        </div>

        <div>
          <span>Position Size</span>
          <strong>{number(result.positionSize)} units</strong>
        </div>

        <div>
          <span>Position Value</span>
          <strong>{money(result.positionValue)}</strong>
        </div>

        <div>
          <span>Potential Reward</span>
          <strong>{money(result.rewardDollars)}</strong>
        </div>

        <div>
          <span>Risk / Reward</span>
          <strong>{number(result.riskReward)}R</strong>
        </div>
      </div>
    </div>
  );
}
