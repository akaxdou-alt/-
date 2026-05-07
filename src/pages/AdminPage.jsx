import { Image, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { emptyDish } from '../constants';
import { EmptyState } from '../components/EmptyState';
import { ItemImage } from '../components/ItemImage';
import { SectionHeader } from '../components/SectionHeader';

export function AdminPage({ dishesStore }) {
  const [form, setForm] = useState(emptyDish);
  const [editingId, setEditingId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setEditingId('');
    setForm(emptyDish);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        ...form,
        imageUrl: form.imageUrl.trim(),
        name: form.name.trim(),
        category: form.category.trim() || '其他',
        description: form.description.trim(),
        defaultQuantity: Math.max(1, Number(form.defaultQuantity || 1)),
      };

      if (!payload.name) return;

      if (editingId) {
        await dishesStore.updateItem(editingId, payload);
      } else {
        await dishesStore.addItem(payload);
      }
      resetForm();
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (dish) => {
    setEditingId(dish.id);
    setForm({
      name: dish.name || '',
      imageUrl: dish.imageUrl || '',
      category: dish.category || '',
      description: dish.description || '',
      defaultQuantity: Number(dish.defaultQuantity || 1),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section>
      <SectionHeader
        eyebrow="admin"
        title="维护你们的菜单"
        description="图片可以填写网络 URL，也可以填写 public/images 里的本地路径，例如 /images/蚝油生菜.jpg。"
      />

      <form onSubmit={handleSubmit} className="mb-6 rounded-lg bg-white p-4 shadow-sm ring-1 ring-rose-100">
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <div>
            <div className="aspect-square overflow-hidden rounded-lg bg-amber-50 ring-1 ring-rose-100">
              <ItemImage src={form.imageUrl} alt={form.name || '菜品图片'} />
            </div>
            <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-stone-600">
              把图片放到 <span className="font-semibold text-stone-900">public/images</span>，这里填
              <span className="font-semibold text-stone-900"> /images/文件名.jpg</span>。
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-stone-700">菜名</span>
              <input
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-stone-200 px-3 outline-none transition focus:border-teal-500"
                placeholder="蚝油生菜"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-700">分类</span>
              <input
                value={form.category}
                onChange={(event) => handleChange('category', event.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-stone-200 px-3 outline-none transition focus:border-teal-500"
                placeholder="家常菜 / 甜点 / 饮料"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-stone-700">图片路径 / 图片 URL</span>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-stone-200 px-3 focus-within:border-teal-500">
                <Image className="h-4 w-4 shrink-0 text-stone-400" />
                <input
                  value={form.imageUrl}
                  onChange={(event) => handleChange('imageUrl', event.target.value)}
                  className="h-11 min-w-0 flex-1 border-0 bg-transparent outline-none"
                  placeholder="/images/蚝油生菜.jpg 或 https://..."
                />
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-700">默认数量</span>
              <input
                type="number"
                min="1"
                value={form.defaultQuantity}
                onChange={(event) => handleChange('defaultQuantity', event.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-stone-200 px-3 outline-none transition focus:border-teal-500"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-stone-700">描述</span>
              <textarea
                value={form.description}
                onChange={(event) => handleChange('description', event.target.value)}
                className="mt-1 min-h-24 w-full rounded-lg border border-stone-200 px-3 py-2 outline-none transition focus:border-teal-500"
                placeholder="清爽下饭，适合晚餐加一道绿叶菜"
              />
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-stone-900 px-5 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isSaving ? '保存中' : editingId ? '保存修改' : '添加菜品'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              disabled={isSaving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-stone-100 px-5 text-sm font-bold text-stone-700 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="h-4 w-4" />
              取消
            </button>
          ) : null}
        </div>
      </form>

      {dishesStore.items.length === 0 ? (
        <EmptyState title="还没有菜品" description="从上面的表单添加第一道菜，菜单页会自动出现。" />
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {dishesStore.items.map((dish) => (
          <article key={dish.id} className="grid grid-cols-[84px_1fr] gap-3 rounded-lg bg-white p-3 ring-1 ring-rose-100">
            <div className="aspect-square overflow-hidden rounded-md bg-amber-50">
              <ItemImage src={dish.imageUrl} alt={dish.name} />
            </div>
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-stone-900">{dish.name}</h3>
                  <p className="text-sm text-teal-700">
                    {dish.category || '其他'} · 默认 {dish.defaultQuantity || 1} 份
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => startEditing(dish)}
                    className="grid h-9 w-9 place-items-center rounded-md text-stone-500 transition hover:bg-teal-50 hover:text-teal-700"
                    aria-label="编辑菜品"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => dishesStore.removeItem(dish.id)}
                    className="grid h-9 w-9 place-items-center rounded-md text-stone-500 transition hover:bg-rose-50 hover:text-rose-700"
                    aria-label="删除菜品"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-stone-600">{dish.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
