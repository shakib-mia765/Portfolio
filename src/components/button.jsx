import { useCallback, useState } from "react";

const CONFIG = Object.freeze({
  variants: {
    primary: "bg-blue-600 text-white hover:bg-blue-500",
    secondary: "bg-slate-900 text-slate-200 hover:bg-slate-800",
    danger: "bg-rose-600 text-white hover:bg-rose-500",
    ghost: "bg-transparent text-slate-400 hover:bg-slate-900 hover:text-white",
  },
  sizes: {
    sm: "px-4 py-2 text-xs rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-2xl",
  },
});
const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  disabled = false,
  onClick,
  type = "button",
}) => {
  const [status, setStatus] = useState("idle");
  const handleClick = useCallback(async (event) => {
    if (disabled || status === "loading") return;
    setStatus("loading");
    try {
      await Promise.resolve(onClick?.(event));
      setStatus("success");
    } catch (error) {
      setStatus("error");
      console.error("Button action failed:", error);
    }
  }, [disabled, onClick, status]);
  const classes = [
    "inline-flex items-center justify-center gap-2 border border-transparent font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
    CONFIG.variants[variant] ?? CONFIG.variants.primary,
    CONFIG.sizes[size] ?? CONFIG.sizes.md,
  ].map((value) => value.trim()).join(" ");
  return (
    <button type={type} disabled={disabled || status === "loading"} onClick={handleClick} className={classes} aria-busy={status === "loading"}>
      {Icon && iconPosition === "left" && <Icon aria-hidden="true" className="size-4" />}
      <span>{status === "loading" ? "Processing..." : children}</span>
      {Icon && iconPosition === "right" && <Icon aria-hidden="true" className="size-4" />}
    </button>
  );
};

export default Button;
