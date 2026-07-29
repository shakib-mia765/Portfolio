import { useId, useState } from "react";
import PropTypes from "prop-types";

const INPUT_STYLES = Object.freeze({
  base: "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition dark:bg-slate-900",
  idle: "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700",
  error: "border-red-500 focus:ring-2 focus:ring-red-500/20",
});
const validateValue = (value, rules = []) =>
  Promise.resolve(rules.map((rule) => rule(value)).find(Boolean) ?? "");
export default function Input({
  label,
  name,
  type = "text",
  value,
  rules = [],
  onChange,
  ...props
}) {
  const id = useId();
  const [error, setError] = useState("");
  const handleBlur = async () => setError(await validateValue(value, rules));
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <input
        {...props}
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${INPUT_STYLES.base} ${error ? INPUT_STYLES.error : INPUT_STYLES.idle}`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.func),
  onChange: PropTypes.func.isRequired,
};
