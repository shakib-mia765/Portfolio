import { useCallback, useState } from "react";

const CONFIG = Object.freeze({
  sizes: {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  },
  actions: [
    { id: "cancel", label: "Cancel", variant: "secondary" },
    { id: "confirm", label: "Confirm", variant: "primary" },
  ],
});
const Dialog = ({ open, title, description, size = "md", onClose, onConfirm }) => {
  const [pending, setPending] = useState(false);
  const handleAction = useCallback(async (action) => {
    if (pending) return;
    if (action.id === "cancel") return onClose?.();
    setPending(true);
    try {
      await Promise.resolve(onConfirm?.());
      onClose?.();
    } finally {
      setPending(false);
    }
  }, [onClose, onConfirm, pending]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="dialog-title" className={`w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950 ${CONFIG.sizes[size] ?? CONFIG.sizes.md}`}>
        <h2 id="dialog-title" className="text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          {CONFIG.actions.map((action) => (
            <button key={action.id} type="button" disabled={pending} onClick={() => handleAction(action)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${action.variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300"}`}>
              {action.id === "confirm" && pending ? "Processing..." : action.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dialog;
