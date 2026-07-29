const DEFAULT_LESSONS = Object.freeze([
  "Validate assumptions with measurable user feedback.",
  "Design observability before scaling infrastructure.",
  "Prefer simple architecture until complexity is justified.",
]);

const LessonsLearned = ({
  lessons = DEFAULT_LESSONS,
  title = "Lessons Learned",
}) => {
  const safeLessons = Array.isArray(lessons)
    ? lessons.filter((lesson) => typeof lesson === "string" && lesson.trim())
    : DEFAULT_LESSONS;
  return (
    <section
      aria-labelledby="lessons-learned-title"
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="mb-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-10 place-items-center rounded-2xl bg-amber-100 text-lg dark:bg-amber-950"
        >
        </span>
        <h2
          id="lessons-learned-title"
          className="text-xl font-bold tracking-tight text-slate-950 dark:text-white"
        >
          {title}
        </h2>
      </div>
      <ul className="space-y-3">
        {safeLessons.map((lesson, index) => (
          <li
            key={`${index}-${lesson}`}
            className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <span className="font-bold text-amber-600">{index + 1}.</span>
            <span>{lesson}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LessonsLearned;
