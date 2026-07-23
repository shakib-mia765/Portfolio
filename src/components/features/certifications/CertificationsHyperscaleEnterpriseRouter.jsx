import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";

const CERTIFICATIONS = Object.freeze([
  {
    id: "meta-frontend-developer",
    title: "Meta Front-End Developer",
    issuer: "Meta",
    issued: "2024",
    category: "Frontend",
    credential: "Add credential ID",
    url: "https://www.coursera.org/account/accomplishments",
    description: "Professional training in React, JavaScript, responsive interfaces, accessibility, version control, and production frontend delivery.",
    skills: ["React", "JavaScript", "Accessibility", "Responsive Design"]
  },
  {
    id: "meta-backend-developer",
    title: "Meta Back-End Developer",
    issuer: "Meta",
    issued: "2024",
    category: "Backend",
    credential: "Add credential ID",
    url: "https://www.coursera.org/account/accomplishments",
    description: "Backend engineering program covering Python, Django, APIs, databases, authentication, testing, and secure application design.",
    skills: ["Python", "Django", "REST APIs", "SQL"]
  },
  {
    id: "microsoft-full-stack-capstone",
    title: "Microsoft Full-Stack Developer Capstone",
    issuer: "Microsoft",
    issued: "2025",
    category: "Full Stack",
    credential: "Add credential ID",
    url: "https://www.coursera.org/account/accomplishments",
    description: "Capstone delivery combining frontend, backend, cloud, testing, deployment, and modern software engineering practices.",
    skills: ["React", "Node.js", "Cloud", "CI/CD"]
  },
  {
    id: "aws-cloud-architecture",
    title: "AWS Cloud Architecture",
    issuer: "Amazon Web Services",
    issued: "2025",
    category: "Cloud",
    credential: "Add credential ID",
    url: "https://www.coursera.org/account/accomplishments",
    description: "Cloud architecture training focused on scalable services, reliability, security, networking, and cost-aware AWS design.",
    skills: ["AWS", "Architecture", "Security", "Reliability"]
  }
]);

const FILTERS = Object.freeze(["All", "Frontend", "Backend", "Full Stack", "Cloud"]);
const normalize = value => value.trim().toLowerCase();
const loadCertifications = () =>
  new Promise(resolve => window.setTimeout(() => resolve(CERTIFICATIONS), 180));
const matchesSearch = (item, query) =>
  [item.title, item.issuer, item.category, item.description, ...item.skills]
    .some(value => normalize(value).includes(query));
const CertificationCard = ({ item, onOpen }) => (
  <article className="group flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-violet-400/50">
    <div className="flex items-start justify-between gap-4">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
          {item.category}
        </span>
        <h2 className="mt-3 text-xl font-bold leading-7 text-white">{item.title}</h2>
      </div>
      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
        {item.issued}
      </span>
    </div>
    <p className="mt-3 text-sm font-medium text-slate-400">Issued by {item.issuer}</p>
    <p className="mt-5 flex-1 text-sm leading-6 text-slate-300">{item.description}</p>
    <div className="mt-6 flex flex-wrap gap-2">
      {item.skills.map(skill => (
        <span key={skill} className="rounded-full bg-slate-950 px-3 py-1 text-xs text-slate-400 ring-1 ring-slate-800">
          {skill}
        </span>
      ))}
    </div>
    <button
      type="button"
      onClick={() => onOpen(item.id)}
      className="mt-6 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
    >
      View credential
    </button>
  </article>
);

const LoadingState = () => (
  <div className="grid gap-6 md:grid-cols-2" aria-label="Loading certifications">
    {[0, 1, 2, 3].map(item => (
      <div key={item} className="h-80 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/60" />
    ))}
  </div>
);
const EmptyState = () => (
  <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-16 text-center">
    <h2 className="text-xl font-semibold text-white">No certifications found</h2>
    <p className="mt-2 text-sm text-slate-400">Try another keyword or category.</p>
  </div>
);

function CertificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    let active = true;
    loadCertifications()
      .then(data => {
        if (!active) return;
        setItems(data);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleItems = useMemo(() => {
    const search = normalize(query);
    return items.filter(item => {
      const matchesCategory = category === "All" || item.category === category;
      return matchesCategory && (!search || matchesSearch(item, search));
    });
  }, [items, query, category]);
  const openCertificate = useCallback(
    id => navigate(`/certifications/${id}`),
    [navigate]
  );

  return (
    <section className="mx-auto max-w-6xl">
      <header className="border-b border-slate-800 pb-10">
        <p className="text-sm font-semibold tracking-[0.22em] text-violet-400">CERTIFICATIONS</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Verified learning across product engineering and cloud systems.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
          Professional credentials supporting frontend, backend, full-stack, architecture, and delivery expertise.
        </p>
      </header>
      <div className="flex flex-col gap-5 py-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(filter => (
            <button
              key={filter}
              type="button"
              onClick={() => setCategory(filter)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === filter
                  ? "bg-violet-500 text-white"
                  : "border border-slate-800 text-slate-400 hover:border-violet-400 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <label className="block w-full lg:w-80">
          <span className="sr-only">Search certifications</span>
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search certifications"
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
          />
        </label>
      </div>
      {status === "loading" && <LoadingState />}
      {status === "error" && (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-rose-200">
          Certifications could not be loaded.
        </div>
      )}
      {status === "ready" && (
        visibleItems.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {visibleItems.map(item => (
              <CertificationCard key={item.id} item={item} onOpen={openCertificate} />
            ))}
          </div>
        ) : <EmptyState />
      )}
    </section>
  );
}

function CertificationDetailsPage() {
  const { certificationId } = useParams();
  const item = CERTIFICATIONS.find(certificate => certificate.id === certificationId);
  if (!item) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center">
        <h1 className="text-2xl font-bold text-white">Credential not found</h1>
        <Link to="/certifications" className="mt-6 inline-flex rounded-xl bg-violet-500 px-5 py-2.5 font-semibold text-white hover:bg-violet-400">
          Back to certifications
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/certifications" className="text-sm font-semibold text-violet-400 hover:text-violet-300">
        ← Back to certifications
      </Link>
      <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-7 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">{item.category}</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">{item.title}</h1>
        <p className="mt-4 text-slate-400">{item.issuer} · Issued {item.issued}</p>
        <p className="mt-8 text-lg leading-8 text-slate-300">{item.description}</p>
        <dl className="mt-8 grid gap-5 border-t border-slate-800 pt-8 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-500">Credential ID</dt>
            <dd className="mt-2 text-sm font-semibold text-slate-200">{item.credential}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-500">Core skills</dt>
            <dd className="mt-2 text-sm font-semibold text-slate-200">{item.skills.join(" · ")}</dd>
          </div>
        </dl>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex rounded-xl bg-violet-500 px-5 py-3 font-semibold text-white transition hover:bg-violet-400"
        >
          Verify credential ↗
        </a>
      </div>
    </article>
  );
}

export default function CertificationsHyperscaleEnterpriseRouter() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 sm:py-24">
      <Routes>
        <Route index element={<CertificationsPage />} />
        <Route path=":certificationId" element={<CertificationDetailsPage />} />
      </Routes>
    </main>
  );
}
