import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
const SKILLS = Object.freeze([
  {
    id: "frontend-engineering",
    title: "Frontend Engineering",
    category: "Frontend",
    level: "Advanced",
    summary:
      "Production interface engineering with reusable systems, accessible interaction patterns, state management, and performance-aware delivery.",
    technologies: ["React", "Next.js", "TypeScript", "Redux Toolkit", "Tailwind CSS"],
    strengths: [
      "Component architecture and route-driven application composition.",
      "Responsive design, accessibility, rendering, and client performance.",
      "Reusable UI systems with predictable state and testing boundaries."
    ]
  },
  {
    id: "backend-engineering",
    title: "Backend Engineering",
    category: "Backend",
    level: "Advanced",
    summary:
      "API and service development focused on secure boundaries, data consistency, asynchronous work, and maintainable domain logic.",
    technologies: ["Python", "Django", "FastAPI", "Node.js", "NestJS"],
    strengths: [
      "REST and GraphQL API design with authentication and authorization.",
      "Service boundaries, background processing, and error handling.",
      "Database-aware implementation and production observability."
    ]
  },
  {
    id: "data-platforms",
    title: "Data Platforms",
    category: "Data",
    level: "Advanced",
    summary:
      "Relational and document data design covering query performance, caching, migrations, consistency, and operational reliability.",
    technologies: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma"],
    strengths: [
      "Schema design, indexing, transactions, and query optimization.",
      "Caching and data-access patterns for high-traffic applications.",
      "Migration planning, integrity safeguards, and recovery practices."
    ]
  },
  {
    id: "cloud-platform-engineering",
    title: "Cloud & Platform Engineering",
    category: "Cloud",
    level: "Advanced",
    summary:
      "Cloud-native delivery using containers, orchestration, infrastructure as code, CI/CD, security, and operational monitoring.",
    technologies: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
    strengths: [
      "Containerized services and Kubernetes deployment workflows.",
      "Infrastructure automation, delivery gates, and environment strategy.",
      "Reliability, security, cost awareness, and system diagnostics."
    ]
  }
]);
const FILTERS = Object.freeze(["All", "Frontend", "Backend", "Data", "Cloud"]);
const normalize = value => value.trim().toLowerCase();
const loadSkills = signal =>
  new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => resolve(SKILLS), 180);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Request aborted", "AbortError"));
      },
      { once: true }
    );
  });
const matchesSearch = (skill, query) =>
  [
    skill.title,
    skill.category,
    skill.level,
    skill.summary,
    ...skill.technologies,
    ...skill.strengths
  ].some(value => normalize(value).includes(query));
const SkillCard = ({ skill, onOpen }) => (
  <article className="group flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-emerald-400/50">
    <div className="flex items-start justify-between gap-4">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">{skill.category}</span>
        <h2 className="mt-3 text-xl font-bold leading-7 text-white">{skill.title}</h2>
      </div>
      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">{skill.level}</span>
    </div>
    <p className="mt-5 flex-1 text-sm leading-6 text-slate-300">{skill.summary}</p>
    <div className="mt-6 flex flex-wrap gap-2">
      {skill.technologies.map(technology => (
        <span
          key={technology}
          className="rounded-full bg-slate-950 px-3 py-1 text-xs text-slate-400 ring-1 ring-slate-800"
        >
          {technology}
        </span>
      ))}
    </div>
    <button
      type="button"
      onClick={() => onOpen(skill.id)}
      className="mt-6 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
    >
      View capability
    </button>
  </article>
);
const LoadingState = () => (
  <div className="grid gap-6 md:grid-cols-2" aria-label="Loading skills">
    {[0, 1, 2, 3].map(item => (
      <div
        key={item}
        className="h-80 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/60"
      />
    ))}
  </div>
);
const EmptyState = () => (
  <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-16 text-center">
    <h2 className="text-xl font-semibold text-white">No skills found</h2>
    <p className="mt-2 text-sm text-slate-400">Try another keyword or category.</p>
  </div>
);
function SkillsOverviewPage() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const controller = new AbortController();
    loadSkills(controller.signal)
      .then(data => {
        setSkills(data);
        setStatus("ready");
      })
      .catch(error => {
        if (error.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, []);
  const visibleSkills = useMemo(() => {
    const search = normalize(query);
    return skills.filter(skill => {
      const categoryMatch = category === "All" || skill.category === category;
      return categoryMatch && (!search || matchesSearch(skill, search));
    });
  }, [skills, query, category]);
  const openSkill = useCallback(
    skillId => navigate(`/skills/${skillId}`),
    [navigate]
  );
  return (
    <section className="mx-auto max-w-6xl">
      <header className="border-b border-slate-800 pb-10">
        <p className="text-sm font-semibold tracking-[0.22em] text-emerald-400">SKILLS</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl">Engineering capability across product, platform, data, and cloud.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
          Practical technical depth built through production delivery,
          architecture decisions, reliability work, and cross-functional ownership.
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
                  ? "bg-emerald-400 text-slate-950"
                  : "border border-slate-800 text-slate-400 hover:border-emerald-400 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <label className="block w-full lg:w-80">
          <span className="sr-only">Search skills</span>
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search skills"
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
        </label>
      </div>
      {status === "loading" && <LoadingState />}
      {status === "error" && (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-rose-200">
          Skills could not be loaded.
        </div>
      )}
      {status === "ready" &&
        (visibleSkills.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {visibleSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill} onOpen={openSkill} />
            ))}
          </div>
        ) : (
          <EmptyState />
        ))}
    </section>
  );
}
function SkillDetailsPage() {
  const { skillId } = useParams();
  const skill = SKILLS.find(item => item.id === skillId);
  if (!skill) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center">
        <h1 className="text-2xl font-bold text-white">Skill not found</h1>
        <Link
          to="/skills"
          className="mt-6 inline-flex rounded-xl bg-emerald-400 px-5 py-2.5 font-semibold text-slate-950 hover:bg-emerald-300"
        >
          Back to skills
        </Link>
      </div>
    );
  }
  return (
    <article className="mx-auto max-w-4xl">
      <Link
        to="/skills"
        className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
      >
        ← Back to skills
      </Link>
      <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-7 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">{skill.category}</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">{skill.title}</h1>
        <p className="mt-4 text-slate-400">{skill.level}</p>
        <p className="mt-8 text-lg leading-8 text-slate-300">{skill.summary}</p>
        <section className="mt-10 border-t border-slate-800 pt-8">
          <h2 className="text-xl font-bold text-white">Core strengths</h2>
          <ul className="mt-5 grid gap-4">
            {skill.strengths.map(strength => (
              <li key={strength} className="flex gap-3 leading-7 text-slate-300">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </section>
        <div className="mt-8 flex flex-wrap gap-2">
          {skill.technologies.map(technology => (
            <span
              key={technology}
              className="rounded-full bg-slate-950 px-3 py-1 text-xs text-slate-400 ring-1 ring-slate-800"
            >
              {technology}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
export default function SkillsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 sm:py-24">
      <Routes><Route index element={<SkillsOverviewPage />} /><Route path=":skillId" element={<SkillDetailsPage />} /></Routes>
    </main>
  );
}
