export function EmptyState({ title, description }) {
  return (
    <div className="rounded-lg border border-dashed border-cyan-300/35 bg-slate-950/55 px-5 py-10 text-center shadow-[0_0_24px_rgba(34,211,238,0.1)]">
      <h2 className="text-lg font-black text-white">{title}</h2>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-300">{description}</p> : null}
    </div>
  );
}
