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
      <SectionHeader
        eyebrow="menu"
        title="今天想吃点什么"
        description="菜品会实时从 Firestore 读取；你们在同一个网址里加菜，今晚点单会同步更新。"
      />

      {dishesStore.loading ? <p className="text-sm text-stone-500">正在加载菜单...</p> : null}
      {dishesStore.error ? <p className="text-sm text-rose-700">{dishesStore.error}</p> : null}

      {!dishesStore.loading && dishesStore.items.length === 0 ? (
        <EmptyState title="菜单还空着" description="先去管理页添加几个常吃的菜，之后这里就能直接点单。" />
      ) : null}

      <div className="space-y-8">
        {Object.entries(groupedDishes).map(([category, dishes]) => (
          <div key={category}>
            <div className="mb-3 flex items-center gap-3">
              <h3 className="text-lg font-bold text-stone-900">{category}</h3>
              <div className="h-px flex-1 bg-rose-100" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dishes.map((dish) => {
                const selectedQuantity = quantities[dish.id] ?? Number(dish.defaultQuantity || 1);
                return (
                  <article key={dish.id} className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-rose-100">
                    <div className="aspect-[4/3] bg-amber-50">
                      <ItemImage src={dish.imageUrl} alt={dish.name} />
                    </div>
                    <div className="space-y-4 p-4">
                      <div>
                        <h4 className="text-lg font-bold text-stone-900">{dish.name}</h4>
                        <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-stone-600">
                          {dish.description || '没有描述，交给今晚的心情决定。'}
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
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 text-sm font-bold text-white transition hover:bg-rose-700"
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
