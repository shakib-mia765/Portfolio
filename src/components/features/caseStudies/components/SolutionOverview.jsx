import { useEffect, useState } from "react";

const DEFAULT_CONTENT = Object.freeze({
  title: "Solution Overview",
  description: "A focused architecture built for scale, reliability, and maintainability.",
});

const SolutionOverview = ({ solutions = [], content = DEFAULT_CONTENT }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let mounted = true;
    Promise.resolve(solutions)
      .then((result) => (Array.isArray(result) ? result : []))
      .then((result) =>
        result.filter(({ title }) => typeof title === "string" && title.trim())
      )
      .then((result) => mounted && setItems(result))
      .catch(() => mounted && setItems([]));
    return () => {
      mounted = false;
    };
  }, [solutions]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Architecture</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{content.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{content.description}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(({ id, title, description }, index) => (
          <article key={id ?? title} className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">
            <span className="text-sm font-bold text-blue-600">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 font-semibold text-slate-950 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SolutionOverview;
