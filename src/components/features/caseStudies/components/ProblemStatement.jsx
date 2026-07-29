const DEFAULT_PROBLEM = Object.freeze({
  title: "Problem Statement",
  summary:
    "The existing platform struggled with scale, reliability, and user experience.",
  challenges: Object.freeze([
    "Slow response times",
    "Limited scalability",
    "Complex maintenance",
  ]),
});

const ProblemStatement = ({ problem = DEFAULT_PROBLEM }) => {
  const content =
    problem && typeof problem === "object" ? problem : DEFAULT_PROBLEM;
  const challenges = Array.isArray(content.challenges)
    ? content.challenges.filter(
        (challenge) => typeof challenge === "string" && challenge.trim(),
      )
    : DEFAULT_PROBLEM.challenges;

  return (
    <section
      aria-labelledby="problem-statement-title"
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">
        The Challenge
      </p>
      <h2 id="problem-statement-title" className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
        {content.title || DEFAULT_PROBLEM.title}
      </h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
        {content.summary || DEFAULT_PROBLEM.summary}
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {challenges.map((challenge, index) => (
          <li key={challenge} className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <span aria-hidden="true" className="font-bold text-rose-600">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{challenge}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProblemStatement;
