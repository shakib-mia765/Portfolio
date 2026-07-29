const CONTACT = Object.freeze({
  email: "r01227673@gmail.com",
  github: "https://github.com/shakib-mia765",
  linkedin: "https://www.linkedin.com/in/shakib-mia-529b77316",
});

<div className="mt-4 flex flex-wrap gap-3">
  {[
    { label: "GitHub", href: CONTACT.github },
    { label: "LinkedIn", href: CONTACT.linkedin },
  ].map(({ label, href }) => (
    <a
      key={label}
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
    >
      {label}
    </a>
  ))}
</div>
