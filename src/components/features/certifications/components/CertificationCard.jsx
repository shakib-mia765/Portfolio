const DEFAULT_CERTIFICATION = Object.freeze({
  id: "aws-saa",
  title: "AWS Solutions Architect",
  issuer: "Amazon Web Services",
  issued: "2026",
  skills: Object.freeze(["AWS", "Architecture", "Security"]),
  credentialUrl: "#",
});

const CertificationCard = ({
  certification = DEFAULT_CERTIFICATION,
  onVerify = ({ credentialUrl }) =>
    Promise.resolve(window.open(credentialUrl, "_blank", "noopener,noreferrer")),
}) => {
  const data =
    certification && typeof certification === "object"
      ? certification
      : DEFAULT_CERTIFICATION;
  const skills = Array.isArray(data.skills)
    ? data.skills.filter((skill) => typeof skill === "string" && skill.trim())
    : DEFAULT_CERTIFICATION.skills;
  const handleVerify = async () => {
    await Promise.resolve(onVerify(data)).catch(() => undefined);
  };

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
        {data.issuer}
      </p>
      <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
        {data.title}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Issued {data.issued}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Certified skills">
        {skills.map((skill) => (
          <li key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            {skill}
          </li>
        ))}
      </ul>
      <button type="button" onClick={handleVerify} className="mt-5 font-semibold text-blue-600 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
        Verify credential →
      </button>
    </article>
  );
};

export default CertificationCard;
