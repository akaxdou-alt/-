import { Trash2 } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { ItemImage } from '../components/ItemImage';
import { QuantityStepper } from '../components/QuantityStepper';
import { SectionHeader } from '../components/SectionHeader';

export function OrderPage({ ordersStore }) {
  const totalQuantity = ordersStore.items.reduce((total, item) => total + Number(item.quantity || 0), 0);
  const hasOrders = ordersStore.items.length > 0;

  const handleQuantityChange = async (item, quantity) => {
    if (quantity <= 0) {
      await ordersStore.removeItem(item.id);
      return;
    }
    await ordersStore.updateItem(item.id, { quantity });
  };

  const handleClearAll = async () => {
    await Promise.all(ordersStore.items.map((item) => ordersStore.removeItem(item.id)));
  };

  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader eyebrow="tonight" title="今晚点单" description={`共 ${totalQuantity} 份`} />
        {hasOrders ? (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-fuchsia-300/45 bg-fuchsia-400/15 px-4 text-sm font-black text-fuchsia-100 transition hover:bg-fuchsia-400/25"
          >
            <Trash2 className="h-4 w-4" />
            清空全部
          </button>
        ) : null}
      </div>

      {!hasOrders ? <EmptyState title="今晚还没点菜" /> : null}

      <div className="space-y-3">
        {ordersStore.items.map((item) => (
          <article
            key={item.id}
            className="grid grid-cols-[88px_1fr] gap-3 rounded-lg border border-cyan-300/25 bg-slate-950/72 p-3 shadow-[0_0_22px_rgba(34,211,238,0.12)]"
          >
            <div className="aspect-square overflow-hidden rounded-md bg-slate-900">
              <ItemImage src={item.imageUrl} alt={item.name} />
            </div>
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="truncate text-lg font-black text-white">{item.name}</h3>
                <button
                  type="button"
                  onClick={() => ordersStore.removeItem(item.id)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-300 transition hover:bg-fuchsia-400/15 hover:text-fuchsia-100"
                  aria-label="删除菜品"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <QuantityStepper
                  value={Number(item.quantity || 0)}
                  onChange={(quantity) => handleQuantityChange(item, quantity)}
                  size="sm"
                />
                <span className="rounded-lg border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-sm font-black text-cyan-100">
                  {Number(item.quantity || 0)} 份
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
