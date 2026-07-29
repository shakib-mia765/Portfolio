const DEFAULT_VERIFICATION = Object.freeze({
  label: "Verify Credential",
  provider: "Coursera",
  credentialId: "3CCYPNBIEK26",
  url: "https://coursera.org/verify/3CCYPNBIEK26",
  checks: Object.freeze(["Issuer verified", "Credential active"]),
});

const VerificationLink = ({
  verification = DEFAULT_VERIFICATION,
  onVerify = ({ url }) =>
    Promise.resolve(window.open(url, "_blank", "noopener,noreferrer")),
}) => {
  const data =
    verification && typeof verification === "object"
      ? { ...DEFAULT_VERIFICATION, ...verification }
      : DEFAULT_VERIFICATION;
  const checks = Array.isArray(data.checks)
    ? data.checks.filter((check) => typeof check === "string" && check.trim())
    : DEFAULT_VERIFICATION.checks;
  const handleVerify = () => {
    if (!/^https?:\/\//i.test(data.url)) return;
    Promise.resolve(onVerify(data)).catch(() => undefined);
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
        {data.provider}
      </p>
      <p className="mt-2 font-mono text-xs text-slate-500">
        Credential ID: {data.credentialId}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Verification checks">
        {checks.map((check) => (
          <li key={check} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            ✓ {check}
          </li>
        ))}
      </ul>
      <button type="button" onClick={handleVerify} className="mt-5 inline-flex font-semibold text-emerald-600 transition hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
        {data.label} ↗
      </button>
    </div>
  );
};

export default VerificationLink;
