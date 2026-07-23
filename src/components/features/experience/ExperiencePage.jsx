```jsx
import { memo, useEffect, useMemo, useState } from 'react';
import DATA_STORE from './experienceData.json';

const FILTERS = {
  ALL: 'all',
  PROJECTS: 'projects',
  MILESTONES: 'milestones',
};
const FILTER_OPTIONS = [
  { label: 'All roles', value: FILTERS.ALL },
  { label: 'Projects', value: FILTERS.PROJECTS },
  { label: 'Milestones', value: FILTERS.MILESTONES },
];
const THEMES = new Map([
  [
    'FS_ENGINES',
    {
      border: 'border-cyan-400/30',
      badge: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300',
    },
  ],
  [
    'SYS_INFRA',
    {
      border: 'border-purple-400/30',
      badge: 'border-purple-400/20 bg-purple-400/10 text-purple-300',
    },
  ],
  [
    'DATA_PER',
    {
      border: 'border-emerald-400/30',
      badge: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    },
  ],
]);

const DEFAULT_THEME = {
  border: 'border-slate-700',
  badge: 'border-slate-700 bg-slate-800 text-slate-300',
};
const loadExperience = (signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(DATA_STORE), 220);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Request aborted', 'AbortError'));
      },
      { once: true },
    );
  });

const StatCard = memo(function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
});

const TimelineItem = memo(function TimelineItem({
  experience,
  active,
  onSelect,
}) {
  const theme = THEMES.get(experience.domainKey) ?? DEFAULT_THEME;
  return (
    <button
      type="button"
      onClick={() => onSelect(experience.id)}
      className={`w-full rounded-xl border p-4 text-left transition ${
        active
          ? `${theme.border} bg-slate-900 shadow-xl`
          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-bold text-slate-100">
            {experience.company}
          </h2>
          <p className="mt-1 truncate text-sm text-slate-400">
            {experience.role}
          </p>
        </div>
        <span className="shrink-0 rounded-md border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-500">
          {experience.duration}
        </span>
      </div>
      <span
        className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${theme.badge}`}
      >
        {experience.status}
      </span>
    </button>
  );
});
const TechInventory = memo(function TechInventory({ items = [] }) {
  const groups = useMemo(
    () =>
      items.reduce((result, item) => {
        const group = result.get(item.domainKey) ?? [];
        group.push(item);
        result.set(item.domainKey, group);
        return result;
      }, new Map()),
    [items],
  );

  if (!items.length) return null;
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
        Technology inventory
      </h2>
      <div className="mt-5 space-y-5">
        {[...groups].map(([domain, technologies]) => (
          <div key={domain}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {domain.replaceAll('_', ' ')}
            </p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {technologies.map((technology) => (
                <li
                  key={technology.techId}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-200">
                      {technology.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {technology.deploymentScope}
                    </p>
                  </div>
                  <span className="shrink-0 rounded border border-slate-700 px-2 py-1 font-mono text-xs text-slate-400">
                    {technology.version}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
});

const ExperienceDetails = memo(function ExperienceDetails({ experience }) {
  if (!experience) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center text-slate-500">
        Select an experience to view details.
      </div>
    );
  }
  const theme = THEMES.get(experience.domainKey) ?? DEFAULT_THEME;
  return (
    <article
      className={`rounded-2xl border bg-slate-900/50 p-6 shadow-2xl ${theme.border}`}
    >
      <header className="border-b border-slate-800 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${theme.badge}`}>
            {experience.status}
          </span>
          <span className="text-sm text-slate-500">{experience.duration}</span>
        </div>
        <h2 className="mt-4 text-2xl font-black text-white">
          {experience.role}
        </h2>
        <p className="mt-1 text-lg font-semibold text-emerald-400">
          {experience.company}
        </p>
        {experience.scope && (
          <p className="mt-3 text-sm text-slate-400">
            Scope: <span className="text-slate-200">{experience.scope}</span>
          </p>
        )}

        <p className="mt-5 leading-7 text-slate-400">
          {experience.overview}
        </p>
      </header>
      {!!experience.projects?.length && (
        <section className="mt-7">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Selected projects
          </h3>
          <div className="mt-4 grid gap-3">
            {experience.projects.map((project) => (
              <div
                key={project.code}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-purple-400/10 px-2 py-1 font-mono text-xs text-purple-300">
                    {project.code}
                  </span>
                  <h4 className="font-bold text-slate-100">{project.name}</h4>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {project.impact}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {!!experience.milestones?.length && (
        <section className="mt-7">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Key achievements
          </h3>
          <ul className="mt-4 space-y-3">
            {experience.milestones.map((milestone) => (
              <li
                key={milestone}
                className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm leading-6 text-slate-400"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                {milestone}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
});

export default function ExperiencePage() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    loadExperience(controller.signal)
      .then((result) => {
        setData(result);
        setSelectedId(result.timeline?.[0]?.id ?? '');
        setStatus('success');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setStatus('error');
      });

    return () => controller.abort();
  }, []);
  const timeline = data?.timeline ?? [];
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return timeline.filter((item) => {
      const matchesFilter =
        filter === FILTERS.ALL ||
        (filter === FILTERS.PROJECTS && item.projects?.length) ||
        (filter === FILTERS.MILESTONES && item.milestones?.length);
      const searchable = [
        item.company,
        item.role,
        item.scope,
        item.overview,
        ...item.projects?.flatMap((project) => [
          project.name,
          project.impact,
        ]) ?? [],
        ...item.milestones ?? [],
      ]
        .join(' ')
        .toLowerCase();
      return matchesFilter && searchable.includes(search);
    });
  }, [filter, query, timeline]);

  const selected =
    timeline.find((item) => item.id === selectedId) ?? filtered[0] ?? null;
  const stats = useMemo(() => {
    const projects = timeline.reduce(
      (total, item) => total + (item.projects?.length ?? 0),
      0,
    );
    const milestones = timeline.reduce(
      (total, item) => total + (item.milestones?.length ?? 0),
      0,
    );

    return [
      {
        label: 'Experience',
        value: data?.globalMetrics?.totalYearsLogged
          ? `${data.globalMetrics.totalYearsLogged}+ years`
          : `${timeline.length} roles`,
      },
      { label: 'Projects', value: projects },
      { label: 'Milestones', value: milestones },
    ];
  }, [data, timeline]);

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-slate-950 px-5 py-24 text-center text-slate-400">
        Loading experience…
      </main>
    );
  }
  if (status === 'error') {
    return (
      <main className="min-h-screen bg-slate-950 px-5 py-24">
        <p className="mx-auto max-w-xl rounded-xl border border-rose-500/30 bg-rose-950/20 p-8 text-center text-rose-300">
          Experience data could not be loaded.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-14 text-slate-100 md:px-10">
      <div className="mx-auto max-w-7xl">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
            Professional experience
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            Engineering Experience
          </h1>
          <p className="mt-5 max-w-3xl leading-7 text-slate-400">
            Production systems, platform architecture, technical delivery and
            measurable engineering outcomes.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </header>
        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <input
            type="search"
            value={query}
            onChange={({ target }) => setQuery(target.value)}
            placeholder="Search companies, roles, projects or achievements"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                  filter === option.value
                    ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                    : 'border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-4">
            <section className="space-y-3">
              {filtered.map((experience) => (
                <TimelineItem
                  key={experience.id}
                  experience={experience}
                  active={experience.id === selected?.id}
                  onSelect={setSelectedId}
                />
              ))}

              {!filtered.length && (
                <p className="rounded-xl border border-dashed border-slate-700 p-10 text-center text-sm text-slate-500">
                  No matching experience found.
                </p>
              )}
            </section>
            <TechInventory items={data?.techInventory} />
          </aside>

          <section className="lg:col-span-8">
            <ExperienceDetails experience={selected} />
          </section>
        </div>
      </div>
    </main>
  );
}
```
