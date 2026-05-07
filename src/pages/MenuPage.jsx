import { ShoppingBasket } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { ItemImage } from '../components/ItemImage';
import { QuantityStepper } from '../components/QuantityStepper';
import { SectionHeader } from '../components/SectionHeader';

export function MenuPage({ dishesStore, ordersStore }) {
  const [quantities, setQuantities] = useState({});

  const groupedDishes = useMemo(() => {
    return dishesStore.items.reduce((groups, dish) => {
      const category = dish.category?.trim() || '其他';
      return {
        ...groups,
        [category]: [...(groups[category] || []), dish],
      };
    }, {});
  }, [dishesStore.items]);

  const handleAddOrder = async (dish) => {
    const selectedQuantity = quantities[dish.id] ?? Number(dish.defaultQuantity || 1);
    const existingOrder = ordersStore.items.find((item) => item.id === dish.id);
    await ordersStore.setItem(dish.id, {
      dishId: dish.id,
      name: dish.name,
      imageUrl: dish.imageUrl || '',
      quantity: Number(existingOrder?.quantity || 0) + selectedQuantity,
    });
    setQuantities((current) => ({ ...current, [dish.id]: Number(dish.defaultQuantity || 1) }));
  };

  return (
    <section>
      <SectionHeader eyebrow="menu" title="菜单" />

      {dishesStore.loading ? <p className="text-sm text-cyan-200">加载中...</p> : null}
      {dishesStore.error ? <p className="text-sm text-fuchsia-200">{dishesStore.error}</p> : null}

      {!dishesStore.loading && dishesStore.items.length === 0 ? (
        <EmptyState title="菜单还空着" />
      ) : null}

      <div className="space-y-8">
        {Object.entries(groupedDishes).map(([category, dishes]) => (
          <div key={category}>
            <div className="mb-3 flex items-center gap-3">
              <h3 className="text-lg font-black text-cyan-100">{category}</h3>
              <div className="h-px flex-1 bg-cyan-300/25" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dishes.map((dish) => {
                const selectedQuantity = quantities[dish.id] ?? Number(dish.defaultQuantity || 1);
                return (
                  <article
                    key={dish.id}
                    className="overflow-hidden rounded-lg border border-cyan-300/25 bg-slate-950/72 shadow-[0_0_24px_rgba(34,211,238,0.13)]"
                  >
                    <div className="aspect-[4/3] bg-slate-900">
                      <ItemImage src={dish.imageUrl} alt={dish.name} />
                    </div>
                    <div className="space-y-4 p-4">
                      <div>
                        <h4 className="text-lg font-black text-white">{dish.name}</h4>
                        <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-slate-300">
                          {dish.description || '今晚限定'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <QuantityStepper
                          value={selectedQuantity}
                          min={1}
                          onChange={(value) => setQuantities((current) => ({ ...current, [dish.id]: value }))}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddOrder(dish)}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 text-sm font-black text-slate-950 transition hover:bg-fuchsia-300"
                        >
                          <ShoppingBasket className="h-4 w-4" />
                          加入
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
