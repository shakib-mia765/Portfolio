import { Link } from "react-router-dom";

const CaseStudyCard = ({ study }) => {
  const {
    title,
    summary,
    slug,
    image,
    category = "Case Study",
    metrics = [],
  } = study ?? {};

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950">
      <img
        src={image}
        alt={`${title} case study`}
        loading="lazy"
        className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="space-y-4 p-6">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
          {category}
        </span>
        <div>
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {summary}
          </p>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="Project metrics">
          {metrics.map((metric) => (
            <li key={metric} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {metric}
            </li>
          ))}
        </ul>
        <Link
          to={`/case-studies/${slug}`}
          aria-label={`Read ${title} case study`}
          className="inline-flex font-semibold text-blue-600 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          View case study →
        </Link>
      </div>
    </article>
  );
};

export default CaseStudyCard;
