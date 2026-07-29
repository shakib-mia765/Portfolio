import { useId } from "react";
import PropTypes from "prop-types";

const EMPTY_SECTIONS = Object.freeze([]);
const ArchitectureBreakdown = ({
  title = "Architecture Breakdown",
  description = "A scalable system designed for reliability, performance, and maintainability.",
  sections = EMPTY_SECTIONS,
}) => {
  const titleId = useId();
  const items = Array.isArray(sections) ? sections : EMPTY_SECTIONS;
  return (
    <section
      aria-labelledby={titleId}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          System Design
        </p>
        <h2 id={titleId} className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400">{description}</p>
      </header>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map(({ id, name, summary, technologies = EMPTY_SECTIONS }) => (
          <article
            key={id ?? name}
            className="rounded-2xl border border-slate-200 p-5 transition-transform hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none dark:border-slate-800"
          >
            <h3 className="font-semibold text-slate-950 dark:text-white">{name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{summary}</p>
            {technologies.length > 0 && (
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-blue-600">
                {technologies.join(" · ")}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

ArchitectureBreakdown.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  sections: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string),
  })),
};

export default ArchitectureBreakdown;
