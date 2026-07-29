const DEFAULT_CERTIFICATES = Object.freeze([
  { id: "aws", title: "AWS Solutions Architect", issuer: "Amazon Web Services", url: "#" },
  { id: "meta", title: "Meta Front-End Developer", issuer: "Meta", url: "#" },
  { id: "ibm", title: "IBM Full Stack Developer", issuer: "IBM", url: "#" },
]);

const CertificateViewer = ({
  title = "Professional Certifications",
  certificates = DEFAULT_CERTIFICATES,
  onOpen = ({ url }) => Promise.resolve(window.open(url, "_blank", "noopener,noreferrer")),
}) => {
  const items = Array.isArray(certificates)
    ? certificates.filter(({ id, title: name, issuer }) => id && name && issuer)
    : DEFAULT_CERTIFICATES;
  const handleOpen = async (certificate) => {
    try {
      await Promise.resolve(onOpen(certificate));
    } catch {
      window.open(certificate.url, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <section aria-labelledby="certificates-title" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Verified Expertise</p>
      <h2 id="certificates-title" className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
      <ul className="mt-5 grid gap-3 md:grid-cols-3">
        {items.map((certificate) => (
          <li key={certificate.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-950 dark:text-white">{certificate.title}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{certificate.issuer}</p>
            <button type="button" onClick={() => handleOpen(certificate)} className="mt-4 font-semibold text-blue-600 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              View certificate →
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CertificateViewer;
