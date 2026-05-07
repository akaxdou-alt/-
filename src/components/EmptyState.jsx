export function EmptyState({ title, description }) {
  return (
    <div className="rounded-lg border border-dashed border-rose-200 bg-white/70 px-5 py-10 text-center">
      <h2 className="text-lg font-bold text-stone-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">{description}</p>
    </div>
  );
}
