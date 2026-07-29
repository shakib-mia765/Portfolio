import { useEffect, useState } from "react";

const DEFAULT_STRATEGY = Object.freeze({
  title: "Scaling Strategy",
  summary: "A measured roadmap for scaling performance, reliability, and delivery.",
  steps: Object.freeze([
    "Introduce horizontal application scaling",
    "Add distributed caching and read replicas",
    "Automate observability and capacity planning",
  ]),
});

const ScalingStrategy = ({ loadStrategy = () => Promise.resolve(DEFAULT_STRATEGY) }) => {
  const [strategy, setStrategy] = useState(DEFAULT_STRATEGY);
  useEffect(() => {
    let active = true;
    Promise.resolve(loadStrategy())
      .then((value) => {
        if (active && value && typeof value === "object") setStrategy(value);
      })
      .catch(() => active && setStrategy(DEFAULT_STRATEGY));
    return () => {
      active = false;
    };
  }, [loadStrategy]);

  const steps = Array.isArray(strategy.steps)
    ? strategy.steps.filter((step) => typeof step === "string" && step.trim())
    : DEFAULT_STRATEGY.steps;
  return (
    <section aria-labelledby="scaling-title" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Growth Architecture</p>
      <h2 id="scaling-title" className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{strategy.title}</h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{strategy.summary}</p>
      <ol className="mt-5 grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <span className="text-xs font-bold text-emerald-600">PHASE {index + 1}</span>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default ScalingStrategy;
