import { useEffect, useState } from "react";

const DEFAULT_CONTENT = Object.freeze({
  title: "Lessons Learned",
  description: "Insights that improved execution, architecture, and delivery.",
});

const LessonsLearned = ({ lessons = [], content = DEFAULT_CONTENT }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let active = true;
    Promise.resolve(lessons)
      .then((result) =>
        Array.isArray(result)
          ? result.filter(({ lesson }) => typeof lesson === "string")
          : []
      )
      .then((result) => active && setItems(result))
      .catch(() => active && setItems([]));

    return () => {
      active = false;
    };
  }, [lessons]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <header className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
          Case Study Insights
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
          {content.title}
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {content.description}
        </p>
      </header>
      <ul className="grid gap-3">
        {items.map(({ id, lesson }, index) => (
          <li key={id ?? lesson} className="flex gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <span className="font-bold text-amber-600">{index + 1}.</span>
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{lesson}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LessonsLearned;
