import { useId } from "react";
import PropTypes from "prop-types";

const EMPTY_METRICS = Object.freeze([]);
const CaseStudyDetails = ({
  title,
  summary,
  challenge,
  solution,
  impact,
  metrics = EMPTY_METRICS,
}) => {
  const titleId = useId();
  const items = Array.isArray(metrics) ? metrics : EMPTY_METRICS;
  return (
    <section aria-labelledby={titleId} className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Case Study
        </p>
        <h2 id={titleId} className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h2>
        <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{summary}</p>
      </header>
      <div className="grid gap-5 lg:grid-cols-3">
        {Object.entries({ Challenge: challenge, Solution: solution, Impact: impact }).map(
          ([label, content]) => (
            <article key={label} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
              <h3 className="font-semibold text-slate-950 dark:text-white">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{content}</p>
            </article>
          ),
        )}
      </div>
      {items.length > 0 && (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ label, value }) => (
            <div key={label} className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-900">
              <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
              <dd className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
};
CaseStudyDetails.propTypes = {
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  challenge: PropTypes.string.isRequired,
  solution: PropTypes.string.isRequired,
  impact: PropTypes.string.isRequired,
  metrics: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
};

export default CaseStudyDetails;
