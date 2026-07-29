import { useEffect, useState } from "react";

const DEFAULT_CONTENT = Object.freeze({
  title: "Skills Earned",
  description: "Core capabilities validated through this certification.",
  skills: [],
});
const SkillsFromCertification = ({ content = DEFAULT_CONTENT }) => {
  const [details, setDetails] = useState(DEFAULT_CONTENT);
  useEffect(() => {
    let active = true;
    Promise.resolve(content)
      .then((value) => ({ ...DEFAULT_CONTENT, ...value }))
      .then((value) => ({
        ...value,
        skills: Array.isArray(value.skills) ? value.skills : [],
      }))
      .then((value) => active && setDetails(value))
      .catch(() => active && setDetails(DEFAULT_CONTENT));
    return () => {
      active = false;
    };
  }, [content]);

  const { title, description, skills } = details;
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Competencies</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {skills.map(({ id, name, level = "Verified" }) => (
          <li key={id ?? name} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-950 dark:text-white">{name}</h3>
            <p className="mt-1 text-xs font-medium text-violet-600">{level}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SkillsFromCertification;
