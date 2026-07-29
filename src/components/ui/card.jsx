import { useCallback, useState } from "react";

const CARD_CONFIG = Object.freeze({
  variants: {
    default: "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950",
    featured: "border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20",
  },
  actions: [
    { id: "details", label: "View Details" },
    { id: "credential", label: "Open Credential" },
  ],
});
const Card = ({ title, description, tags = [], variant = "default", onAction }) => {
  const [pendingAction, setPendingAction] = useState(null);
  const handleAction = useCallback(
    async (action) => {
      if (pendingAction) return;
      setPendingAction(action.id);
      try {
        await Promise.resolve(onAction?.(action.id));
      } finally {
        setPendingAction(null);
      }
    },
    [onAction, pendingAction]
  );
  const classes = [
    "rounded-3xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl",
    CARD_CONFIG.variants[variant] ?? CARD_CONFIG.variants.default,
  ].join(" ");
  return (
    <article className={classes}>
      <h3 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => <li key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300">{tag}</li>)}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        {CARD_CONFIG.actions.map((action) => (
          <button key={action.id} type="button" disabled={Boolean(pendingAction)} onClick={() => handleAction(action)} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950">
            {pendingAction === action.id ? "Processing..." : action.label}
          </button>
        ))}
      </div>
    </article>
  );
};

export default Card;
