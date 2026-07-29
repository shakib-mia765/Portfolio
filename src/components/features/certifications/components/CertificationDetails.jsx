import { useEffect, useState } from "react";

const DEFAULT_CERTIFICATION = Object.freeze({
  title: "Professional Certification",
  issuer: "Verified Institution",
  description: "Industry-recognized expertise and practical knowledge.",
  skills: [],
});
const CertificationDetails = ({ certification = DEFAULT_CERTIFICATION }) => {
  const [details, setDetails] = useState(DEFAULT_CERTIFICATION);
  useEffect(() => {
    let active = true;
    Promise.resolve(certification)
      .then((value) => ({ ...DEFAULT_CERTIFICATION, ...value }))
      .then((value) => active && setDetails(value))
      .catch(() => active && setDetails(DEFAULT_CERTIFICATION));
    return () => {
      active = false;
    };
  }, [certification]);

  const { title, issuer, description, credentialUrl, skills = [] } = details;
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
        Verified Certification
      </p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-1 font-medium text-slate-500 dark:text-slate-400">{issuer}</p>
      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">{skill}</li>
        ))}
      </ul>
      {credentialUrl && <a href={credentialUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex font-semibold text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">View credential →</a>}
    </article>
  );
};

export default CertificationDetails;
