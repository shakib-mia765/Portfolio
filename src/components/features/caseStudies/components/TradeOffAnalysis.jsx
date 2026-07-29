import { useEffect, useState } from "react";

const DEFAULT_ANALYSIS = Object.freeze({
  title: "Trade-Off Analysis",
  summary: "Key architectural decisions balanced delivery speed, scale, and operational complexity.",
  decisions: Object.freeze([
    { choice: "Microservices", benefit: "Independent scaling", cost: "Higher operations" },
    { choice: "PostgreSQL", benefit: "Strong consistency", cost: "Replica management" },
    { choice: "Redis", benefit: "Lower latency", cost: "Cache invalidation" },
  ]),
});

const TradeOffAnalysis = ({ loadAnalysis = () => Promise.resolve(DEFAULT_ANALYSIS) }) => {
  const [analysis, setAnalysis] = useState(DEFAULT_ANALYSIS);
  useEffect(() => {
    let active = true;
    Promise.resolve(loadAnalysis())
      .then((value) => active && value && setAnalysis(value))
      .catch(() => active && setAnalysis(DEFAULT_ANALYSIS));
    return () => {
      active = false;
    };
  }, [loadAnalysis]);
  const decisions = Array.isArray(analysis.decisions)
    ? analysis.decisions.filter((item) => item?.choice && item?.benefit && item?.cost)
    : DEFAULT_ANALYSIS.decisions;

  return (
    <section aria-labelledby="trade-off-title" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Architecture Decisions</p>
      <h2 id="trade-off-title" className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{analysis.title}</h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{analysis.summary}</p>
      <ul className="mt-5 grid gap-3 md:grid-cols-3">
        {decisions.map(({ choice, benefit, cost }) => (
          <li key={choice} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-950 dark:text-white">{choice}</h3>
            <p className="mt-2 text-sm text-emerald-600">Benefit: {benefit}</p>
            <p className="mt-1 text-sm text-amber-600">Trade-off: {cost}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TradeOffAnalysis;
