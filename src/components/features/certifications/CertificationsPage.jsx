```jsx
import { memo, useEffect, useMemo, useState } from 'react';

const CERTIFICATIONS = [
  {
    id: 'CERT-001',
    title: 'Virtualization, Docker, and Kubernetes for Data Engineering',
    issuer: 'Duke University',
    issued: 'June 2026',
    credentialId: '3CCYPNBIEK26',
    track: 'Cloud & DevOps',
    skills: ['Docker', 'Kubernetes', 'Virtualization', 'Data Engineering'],
  },
  {
    id: 'CERT-002',
    title: 'AWS Cloud Practitioner Essentials',
    issuer: 'Amazon Web Services',
    issued: 'June 2026',
    credentialId: 'HTPJ07B98G54',
    track: 'Cloud & DevOps',
    skills: ['AWS', 'Cloud economics', 'Shared responsibility'],
  },
  {
    id: 'CERT-003',
    title: 'Full Stack Software Developer Assessment',
    issuer: 'IBM',
    issued: 'May 2026',
    credentialId: 'VH0MLV842PP4',
    track: 'Full-Stack Engineering',
    skills: ['Application architecture', 'Frontend', 'Backend'],
  },
  {
    id: 'CERT-004',
    title: 'Full-Stack Developer Capstone Project',
    issuer: 'Microsoft',
    issued: 'June 2026',
    credentialId: '8BOCR2L2NPME',
    track: 'Full-Stack Engineering',
    skills: ['System design', 'Deployment', 'Application delivery'],
  },
  {
    id: 'CERT-005',
    title: 'Getting Started with Git and GitHub',
    issuer: 'IBM',
    issued: 'June 2026',
    credentialId: 'SGT8CVAL48OQ',
    track: 'Developer Productivity',
    skills: ['Git', 'GitHub', 'Version control'],
  },
  {
    id: 'CERT-006',
    title: 'APIs',
    issuer: 'Meta',
    issued: 'June 2026',
    credentialId: 'EJH8P9B7D9PG',
    track: 'Backend Engineering',
    skills: ['REST APIs', 'HTTP', 'API contracts'],
  },
  {
    id: 'CERT-007',
    title: 'Microservice Architectures',
    issuer: 'Vanderbilt University',
    issued: 'June 2026',
    credentialId: 'ENB1OVY7NEOM',
    track: 'Backend Engineering',
    skills: ['Microservices', 'Distributed systems', 'Scalability'],
  },
  {
    id: 'CERT-008',
    title: 'Django Web Framework',
    issuer: 'Meta',
    issued: 'June 2026',
    credentialId: 'MT4OBCGZSXC3',
    track: 'Backend Engineering',
    skills: ['Python', 'Django', 'MVT architecture'],
  },
  {
    id: 'CERT-009',
    title: 'Developing Back-End Apps with Node.js and Express',
    issuer: 'IBM',
    issued: 'June 2026',
    credentialId: 'UNNXMXRIIO69',
    track: 'Backend Engineering',
    skills: ['Node.js', 'Express', 'Async JavaScript'],
  },
  {
    id: 'CERT-010',
    title: 'Developing Front-End Apps with React',
    issuer: 'IBM',
    issued: 'June 2026',
    credentialId: 'CB7P5PSKFESH',
    track: 'Frontend Engineering',
    skills: ['React', 'State management', 'Component architecture'],
  },
  {
    id: 'CERT-011',
    title: 'Next.js Advanced Implementation & Routing',
    issuer: 'Microsoft',
    issued: 'July 2026',
    credentialId: 'MSFT-NX-9021',
    track: 'Frontend Engineering',
    skills: ['Next.js', 'Routing', 'Server rendering', 'Prisma'],
  },
  {
    id: 'CERT-012',
    title: 'Algorithm Practice — 130+ Solved Problems',
    issuer: 'LeetCode',
    issued: 'Ongoing',
    credentialId: 'LC-RANK-130-PLUS',
    track: 'Algorithms & Data Structures',
    skills: ['Data structures', 'Algorithms', 'Problem solving'],
  },
];

const THEMES = new Map([
  ['Duke University', 'border-blue-400/30 text-blue-300'],
  ['Amazon Web Services', 'border-amber-400/30 text-amber-300'],
  ['IBM', 'border-cyan-400/30 text-cyan-300'],
  ['Microsoft', 'border-teal-400/30 text-teal-300'],
  ['Meta', 'border-indigo-400/30 text-indigo-300'],
  ['Vanderbilt University', 'border-yellow-400/30 text-yellow-300'],
  ['LeetCode', 'border-orange-400/30 text-orange-300'],
]);

const loadCertifications = (signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(CERTIFICATIONS), 250);

    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Request aborted', 'AbortError'));
      },
      { once: true },
    );
  });

const CertificationCard = memo(function CertificationCard({ certification }) {
  const theme =
    THEMES.get(certification.issuer) ?? 'border-slate-700 text-slate-300';
  return (
    <article className={`flex h-full flex-col rounded-2xl border bg-slate-900/60 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-slate-900 ${theme}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full border border-current/30 bg-slate-950 px-3 py-1 text-xs font-semibold">
          {certification.issuer}
        </span>
        <span className="text-xs text-slate-500">{certification.issued}</span>
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
        {certification.track}
      </p>
      <h2 className="mt-2 text-xl font-bold leading-snug text-white">
        {certification.title}
      </h2>
      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <p className="text-xs uppercase tracking-wider text-slate-500">
          Credential ID
        </p>
        <p className="mt-2 break-all font-mono text-sm text-slate-300">
          {certification.credentialId}
        </p>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2">
        {certification.skills.map((skill) => (
          <li
            key={`${certification.id}-${skill}`}
            className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300"
          >
            {skill}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <span className="flex min-h-11 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-sm text-slate-500">
          Verification link not provided
        </span>
      </div>
    </article>
  );
});

export default function CertificationsPage() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState('All');
  const load = async () => {
    const controller = new AbortController();
    setStatus('loading');
    setError('');
    try {
      setRecords(await loadCertifications(controller.signal));
      setStatus('success');
    } catch (requestError) {
      if (requestError.name !== 'AbortError') {
        setError('Certifications could not be loaded.');
        setStatus('error');
      }
    }
    return () => controller.abort();
  };

  useEffect(() => {
    const controller = new AbortController();
    loadCertifications(controller.signal)
      .then((data) => {
        setRecords(data);
        setStatus('success');
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError('Certifications could not be loaded.');
          setStatus('error');
        }
      });
    return () => controller.abort();
  }, []);
  const tracks = useMemo(
    () => ['All', ...new Set(records.map(({ track }) => track))],
    [records],
  );

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return records.filter((item) => {
      const matchesTrack = track === 'All' || item.track === track;
      const searchable = [
        item.title,
        item.issuer,
        item.track,
        item.credentialId,
        ...item.skills,
      ]
        .join(' ')
        .toLowerCase();
      return matchesTrack && searchable.includes(search);
    });
  }, [query, records, track]);
  const summary = useMemo(
    () => [
      { label: 'Credentials', value: records.length },
      { label: 'Issuers', value: new Set(records.map(({ issuer }) => issuer)).size },
      { label: 'Tracks', value: new Set(records.map(({ track }) => track)).size },
      {
        label: 'Skills',
        value: new Set(records.flatMap(({ skills }) => skills)).size,
      },
    ],
    [records],
  );

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-16 text-slate-100 md:px-10 lg:px-20">
      <section className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
          Professional development
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
          Certifications & Technical Learning
        </h1>
        <p className="mt-5 max-w-3xl leading-7 text-slate-400">
          Verified coursework, assessments and practical learning across cloud,
          frontend, backend, architecture and engineering productivity.
        </p>
        {status === 'success' && (
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {summary.map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-black">{value}</p>
              </div>
            ))}
          </div>
        )}

        {status === 'loading' && (
          <p className="mt-16 text-center text-slate-400">Loading certifications…</p>
        )}
        {status === 'error' && (
          <div className="mt-16 rounded-xl border border-rose-500/30 bg-rose-950/20 p-8 text-center">
            <p className="text-rose-300">{error}</p>
            <button
              type="button"
              onClick={load}
              className="mt-5 rounded-lg bg-rose-400 px-5 py-2 font-bold text-slate-950"
            >
              Retry
            </button>
          </div>
        )}

        {status === 'success' && (
          <>
            <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <input
                type="search"
                value={query}
                onChange={({ target }) => setQuery(target.value)}
                placeholder="Search certifications, issuers or skills"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
              />
              
              <div className="mt-4 flex flex-wrap gap-2">
                {tracks.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTrack(item)}
                    className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                      track === item
                        ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                        : 'border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-400">
              Showing <strong className="text-white">{filtered.length}</strong> of{' '}
              {records.length} credentials
            </p>
            <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((certification) => (
                <CertificationCard
                  key={certification.id}
                  certification={certification}
                />
              ))}
            </section>

            {!filtered.length && (
              <p className="mt-8 rounded-xl border border-dashed border-slate-700 py-16 text-center text-slate-500">
                No matching certifications found.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
```
