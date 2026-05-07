export function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p>
      ) : null}
      <h2 className="mt-1 text-2xl font-bold text-stone-900">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p> : null}
    </div>
  );
}
