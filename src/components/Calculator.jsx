import React, { useEffect } from "react";
import { useState } from "react";

function Calculator() {
  const [accuracy, setAccuracy] = useState();
  const [riskRewardRatio, setRiskRewardRatio] = useState();
  const [initialCapital, setInitialCapital] = useState();
  const [riskPerTrade, setRiskPerTrade] = useState();

  const [resultHundred, setResultHundred] = useState();
  const [resultThousand, setResultThousand] = useState();
  const [resultTenThousand, setResultTenThousand] = useState();

  const [status, setStatus] = useState(false);

  function monteCarloSimulator(
    numTrades,
    accuracy,
    riskRewardRatio,
    initialCapital,
    riskPerTrade
  ) {
    console.time("Simulator");
    let capital = initialCapital;
    let profit = 0;
    let loss = 0;
    let maxDrawdown = 0;
    let maxDrawdownPercent = 0; // Track maximum drawdown
    let maxEquity = initialCapital; // Track maximum equity
    let wins = 0;

    for (let i = 0; i < numTrades; i++) {
      // Calculating trade size based on maximum risk per trade
      const tradeSize = capital * riskPerTrade;

      // Simulating win or loss based on accuracy
      const random = Math.random();
      const isWin = random <= accuracy;

      // Calculating profit or loss based on win or loss
      const tradeResult = isWin ? riskRewardRatio : -1;
      const tradeProfitLoss = tradeResult * tradeSize;

      // Updating capital
      capital += tradeProfitLoss;

      // Update maximum equity
      maxEquity = Math.max(maxEquity, capital);

      // Update drawdown
      const currentDrawdown = maxEquity - capital;

      maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
      maxDrawdownPercent = (maxDrawdown / capital) * 100;

      // Updating profit, loss, and wins count
      if (tradeResult > 0) {
        profit += tradeProfitLoss;
        wins++;
      } else {
        loss -= tradeProfitLoss;
      }
    }

    const finalCapital = capital;
    const accuracyPercentage = (wins / numTrades) * 100;

    console.timeEnd("Simulator");
    return {
      profit,
      loss,
      drawdown: maxDrawdown,
      drawdownPercent: maxDrawdownPercent,
      accuracy: accuracyPercentage,
      finalCapital,
    };
  }

  // Example usage:
  // Maximum risk per trade (e.g., 2% of capital)

  const calculateResults = () => {
    if (accuracy && riskRewardRatio && initialCapital && riskPerTrade) {
      setResultHundred(
        monteCarloSimulator(
          100,
          accuracy / 100,
          riskRewardRatio,
          initialCapital,
          riskPerTrade / initialCapital
        )
      );
      setResultThousand(
        monteCarloSimulator(
          1000,
          accuracy / 100,
          riskRewardRatio,
          initialCapital,
          riskPerTrade / initialCapital
        )
      );
      setResultTenThousand(
        monteCarloSimulator(
          10000,
          accuracy / 100,
          riskRewardRatio,
          initialCapital,
          riskPerTrade / initialCapital
        )
      );
      setStatus(true);
    } else {
      setStatus(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full mt-10 calcContainer">
      <div className="accuracy">
        <label className="w-full max-w-xs form-control">
          <div className="label">
            <span className="label-text">Enter your accuracy</span>
            <span className="label-text-alt">in %</span>
          </div>
          <input
            type="number"
            placeholder="Accuracy %"
            className="w-64 input input-bordered"
            onChange={(e) => {
              setAccuracy(parseFloat(e.target.value));
            }}
          />
        </label>
      </div>

      <div className="mt-2 Risk Reward">
        <label className="w-full max-w-xs form-control">
          <div className="label">
            <span className="label-text">Enter your Risk:Reward Ratio</span>
          </div>
          <input
            type="number"
            placeholder="Risk:Reward Ratio"
            className="w-64 input input-bordered"
            onChange={(e) => {
              setRiskRewardRatio(parseFloat(e.target.value));
            }}
          />
          <div className="label">
            <span className="label-text-alt">
              Eg. For 1:2 ratio, just enter 2
            </span>
          </div>
        </label>
      </div>
      <div className="mt-2 Risk Reward">
        <label className="w-full max-w-xs form-control">
          <div className="label">
            <span className="label-text">Enter your Risk Per Trade</span>
            <span className="label-text-alt">in value</span>
          </div>
          <input
            type="number"
            placeholder="Risk per trade"
            className="w-64 input input-bordered"
            onChange={(e) => {
              setRiskPerTrade(parseFloat(e.target.value));
            }}
          />
          <div className="label"></div>
        </label>
      </div>
      <div className="mt-2 Risk Reward">
        <label className="w-full max-w-xs form-control">
          <div className="label">
            <span className="label-text">Enter your Initial Capital</span>
            <span className="label-text-alt">in value</span>
          </div>
          <input
            type="number"
            placeholder="Initial Capital"
            className="w-64 input input-bordered"
            onChange={(e) => {
              setInitialCapital(parseFloat(e.target.value));
            }}
          />
          <div className="label"></div>
        </label>
      </div>
      <div className="mt-2 Risk Reward">
        {accuracy && riskRewardRatio && initialCapital && riskPerTrade ? (
          <button
            className="w-64 btn btn-primary"
            onClick={() => {
              calculateResults();
            }}
          >
            Calculate
          </button>
        ) : (
          <button className="w-64 opacity-860 btn btn-primary" disabled>
            Calculate
          </button>
        )}
      </div>
      {resultHundred && resultTenThousand && resultThousand ? (
        <div className="flex flex-col flex-wrap items-center w-full mx-4 mb-10 md:flex-row results justify-evenly">
          <div className="overflow-hidden mx-5 p-5 mt-5 rounded-lg min-w-[80%] md:min-w-[30%] md:mx-0 result bg-base-300 drop-shadow-lg h-fit">
            <div className="text-lg head">Result 100 Trades</div>
            <hr className="mb-3 opacity-20" />
            <div
              className={
                resultHundred?.profit - resultHundred?.loss > 0
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              Total PnL:{" "}
              {(resultHundred?.profit - resultHundred?.loss).toLocaleString()}
            </div>
            <div
              className={
                resultHundred?.profit - resultHundred?.loss > 0
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              ROI %:{" "}
              {(
                ((resultHundred?.profit - resultHundred?.loss) /
                  initialCapital) *
                100
              ).toLocaleString()}
              %
            </div>
            <div className="text-green-400">
              Total profits: {resultHundred?.profit?.toLocaleString()}
            </div>
            <div className="text-red-400">
              Total Losses: -{resultHundred?.loss?.toLocaleString()}
            </div>
            <div
              className={
                resultHundred?.profit - resultHundred?.loss >
                resultHundred?.drawdown
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              Max Drawdown: -{resultHundred?.drawdownPercent?.toFixed(2)}%
            </div>
            <div
              className={
                resultHundred?.profit - resultHundred?.loss > 0
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              Simulated accuracy: {resultHundred?.accuracy?.toLocaleString()}%
            </div>
            <div
              className={
                resultHundred?.finalCapital > initialCapital
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              Final Capital: {resultHundred?.finalCapital?.toLocaleString()}
            </div>
          </div>
          <div className="overflow-hidden mx-5 p-5 mt-5 rounded-lg min-w-[80%] md:min-w-[30%] md:mx-0 result bg-base-300 drop-shadow-lg h-fit">
            <div className="text-lg head">Result over 1000 trades</div>
            <hr className="mb-3 opacity-20" />
            <div
              className={
                resultThousand?.profit - resultThousand?.loss > 0
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              Total PnL:{" "}
              {(resultThousand?.profit - resultThousand?.loss).toLocaleString()}
            </div>
            <div
              className={
                resultThousand?.profit - resultThousand?.loss > 0
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              ROI %:{" "}
              {(
                ((resultThousand?.profit - resultThousand?.loss) /
                  initialCapital) *
                100
              ).toLocaleString()}
              %
            </div>
            <div className="text-green-400">
              Total profits: {resultThousand?.profit?.toLocaleString()}
            </div>
            <div className="text-red-400">
              Total Losses: -{resultThousand?.loss?.toLocaleString()}
            </div>
            <div
              className={
                resultThousand?.profit - resultThousand?.loss >
                resultThousand?.drawdown
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              Max Drawdown: -{resultThousand?.drawdownPercent?.toFixed(2)}%
            </div>
            <div
              className={
                resultThousand?.profit - resultThousand?.loss > 0
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              Simulated accuracy: {resultThousand?.accuracy?.toLocaleString()}%
            </div>
            <div
              className={
                resultThousand?.finalCapital > initialCapital
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              Final Capital: {resultThousand?.finalCapital?.toLocaleString()}
            </div>
          </div>
          <div className="overflow-hidden mx-5 p-5 mt-5 rounded-lg min-w-[80%] md:min-w-[30%] md:mx-0 result bg-base-300 drop-shadow-lg h-fit">
            <div className="text-lg head">Result over 10000 trades</div>
            <hr className="mb-3 opacity-20" />
            <div
              className={
                resultTenThousand?.profit - resultTenThousand?.loss > 0
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              Total PnL:{" "}
              {(
                resultTenThousand?.profit - resultTenThousand?.loss
              ).toLocaleString()}
            </div>
            <div
              className={
                resultTenThousand?.profit - resultTenThousand?.loss > 0
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              ROI %:{" "}
              {(
                ((resultTenThousand?.profit - resultTenThousand?.loss) /
                  initialCapital) *
                100
              ).toLocaleString()}
              %
            </div>
            <div className="text-green-400">
              Total profits: {resultTenThousand?.profit?.toLocaleString()}
            </div>
            <div className="text-red-400">
              Total Losses: -{resultTenThousand?.loss?.toLocaleString()}
            </div>
            <div
              className={
                resultTenThousand?.profit - resultTenThousand?.loss >
                resultTenThousand?.drawdown
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              Max Drawdown: -{resultTenThousand?.drawdownPercent?.toFixed(2)}%
            </div>
            <div
              className={
                resultTenThousand?.profit - resultTenThousand?.loss > 0
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              Simulated accuracy:{" "}
              {resultTenThousand?.accuracy?.toLocaleString()}%
            </div>
            <div
              className={
                resultTenThousand?.finalCapital > initialCapital
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              Final Capital: {resultTenThousand?.finalCapital?.toLocaleString()}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Calculator;
