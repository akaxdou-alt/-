import { Minus, Plus } from 'lucide-react';

export function QuantityStepper({ value, onChange, min = 0, size = 'md' }) {
  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const textSize = size === 'sm' ? 'min-w-8 text-sm' : 'min-w-10 text-base';

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/25 bg-slate-950/70 p-1 shadow-[0_0_16px_rgba(34,211,238,0.12)]">
      <button
        type="button"
        className={`${buttonSize} grid place-items-center rounded-md text-cyan-100 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-40`}
        onClick={() => onChange(Math.max(min, Number(value || 0) - 1))}
        disabled={Number(value || 0) <= min}
        aria-label="减少数量"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className={`${textSize} text-center font-black text-white`}>{value}</span>
      <button
        type="button"
        className={`${buttonSize} grid place-items-center rounded-md text-fuchsia-100 transition hover:bg-fuchsia-400/15`}
        onClick={() => onChange(Number(value || 0) + 1)}
        aria-label="增加数量"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
