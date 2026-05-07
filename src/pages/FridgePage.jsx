import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { ItemImage } from '../components/ItemImage';
import { QuantityStepper } from '../components/QuantityStepper';
import { SectionHeader } from '../components/SectionHeader';
import { emptyInventory } from '../constants';

const inputClass =
  'mt-1 h-11 w-full rounded-lg border border-cyan-300/25 bg-slate-950/70 px-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300';

export function FridgePage({ inventoryStore }) {
  const [form, setForm] = useState(emptyInventory);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      name: form.name.trim(),
      unit: form.unit.trim() || '份',
      note: form.note.trim(),
      quantity: Math.max(0, Number(form.quantity || 0)),
    };
    if (!payload.name) return;
    await inventoryStore.addItem(payload);
    setForm(emptyInventory);
  };

  const updateQuantity = async (item, quantity) => {
    await inventoryStore.updateItem(item.id, { quantity: Math.max(0, Number(quantity || 0)) });
  };

  return (
    <section>
      <SectionHeader eyebrow="fridge" title="冰箱库存" />

      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-lg border border-cyan-300/25 bg-slate-950/72 p-4 shadow-[0_0_24px_rgba(34,211,238,0.13)]"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-cyan-100">名称</span>
            <input
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              className={inputClass}
              placeholder="鸡蛋"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-cyan-100">图片路径 / 图片 URL</span>
            <input
              value={form.imageUrl}
              onChange={(event) => handleChange('imageUrl', event.target.value)}
              className={inputClass}
              placeholder="/images/鸡蛋.jpg"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-cyan-100">数量</span>
            <input
              type="number"
              min="0"
              value={form.quantity}
              onChange={(event) => handleChange('quantity', event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-cyan-100">单位</span>
            <input
              value={form.unit}
              onChange={(event) => handleChange('unit', event.target.value)}
              className={inputClass}
              placeholder="个"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-bold text-cyan-100">备注</span>
            <input
              value={form.note}
              onChange={(event) => handleChange('note', event.target.value)}
              className={inputClass}
              placeholder="快过期"
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 text-sm font-black text-slate-950 transition hover:bg-fuchsia-300"
        >
          <Plus className="h-4 w-4" />
          添加库存
        </button>
      </form>

      {inventoryStore.items.length === 0 ? <EmptyState title="冰箱记录还空着" /> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {inventoryStore.items.map((item) => (
          <article
            key={item.id}
            className="grid grid-cols-[84px_1fr] gap-3 rounded-lg border border-cyan-300/25 bg-slate-950/72 p-3 shadow-[0_0_18px_rgba(34,211,238,0.1)]"
          >
            <div className="aspect-square overflow-hidden rounded-md bg-slate-900">
              <ItemImage src={item.imageUrl} alt={item.name} />
            </div>
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-black text-white">{item.name}</h3>
                  <p className="text-sm text-cyan-200">
                    {Number(item.quantity || 0)} {item.unit || '份'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => inventoryStore.removeItem(item.id)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-300 transition hover:bg-fuchsia-400/15 hover:text-fuchsia-100"
                  aria-label="删除库存"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {item.note ? <p className="mt-1 truncate text-sm text-slate-400">{item.note}</p> : null}
              <div className="mt-3">
                <QuantityStepper value={Number(item.quantity || 0)} onChange={(value) => updateQuantity(item, value)} size="sm" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
