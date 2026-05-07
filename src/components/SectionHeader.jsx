export function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p>
      ) : null}
      <h2 className="mt-1 text-2xl font-black text-white">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p> : null}
    </div>
  );
}
