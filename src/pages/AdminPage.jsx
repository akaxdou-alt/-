import { Image, LogOut, LockKeyhole, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { emptyDish } from '../constants';
import { EmptyState } from '../components/EmptyState';
import { ItemImage } from '../components/ItemImage';
import { SectionHeader } from '../components/SectionHeader';

const ADMIN_PASSWORD = 'djh200243..';
const ADMIN_STORAGE_KEY = 'couple-menu-admin-unlocked';

const inputClass =
  'mt-1 h-11 w-full rounded-lg border border-cyan-300/25 bg-slate-950/70 px-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300';

function AdminLock({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      setError('');
      onUnlock();
      return;
    }
    setError('密码不对');
  };

  return (
    <section>
      <SectionHeader eyebrow="admin" title="管理模式" />
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md rounded-lg border border-cyan-300/25 bg-slate-950/72 p-5 shadow-[0_0_24px_rgba(34,211,238,0.13)]"
      >
        <label className="block">
          <span className="text-sm font-bold text-cyan-100">密码</span>
          <div className="mt-1 flex items-center gap-2 rounded-lg border border-cyan-300/25 bg-slate-950/70 px-3 focus-within:border-cyan-300">
            <LockKeyhole className="h-4 w-4 shrink-0 text-cyan-200" />
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
              }}
              className="h-11 min-w-0 flex-1 border-0 bg-transparent text-white outline-none"
              autoComplete="current-password"
              autoFocus
            />
          </div>
        </label>
        {error ? <p className="mt-3 text-sm font-bold text-fuchsia-200">{error}</p> : null}
        <button
          type="submit"
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 text-sm font-black text-slate-950 transition hover:bg-fuchsia-300"
        >
          <LockKeyhole className="h-4 w-4" />
          进入管理
        </button>
      </form>
    </section>
  );
}

export function AdminPage({ dishesStore }) {
  const [isUnlocked, setIsUnlocked] = useState(() => localStorage.getItem(ADMIN_STORAGE_KEY) === 'true');
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

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    resetForm();
    setIsUnlocked(false);
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

  if (!isUnlocked) {
    return <AdminLock onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader eyebrow="admin" title="菜品管理" />
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-fuchsia-300/45 bg-fuchsia-400/15 px-4 text-sm font-black text-fuchsia-100 transition hover:bg-fuchsia-400/25"
        >
          <LogOut className="h-4 w-4" />
          退出管理模式
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-lg border border-cyan-300/25 bg-slate-950/72 p-4 shadow-[0_0_24px_rgba(34,211,238,0.13)]"
      >
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <div className="aspect-square overflow-hidden rounded-lg border border-fuchsia-300/25 bg-slate-900">
            <ItemImage src={form.imageUrl} alt={form.name || '菜品图片'} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-cyan-100">菜名</span>
              <input
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                className={inputClass}
                placeholder="蚝油生菜"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-cyan-100">分类</span>
              <input
                value={form.category}
                onChange={(event) => handleChange('category', event.target.value)}
                className={inputClass}
                placeholder="家常菜"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-bold text-cyan-100">图片路径 / 图片 URL</span>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-cyan-300/25 bg-slate-950/70 px-3 focus-within:border-cyan-300">
                <Image className="h-4 w-4 shrink-0 text-cyan-200" />
                <input
                  value={form.imageUrl}
                  onChange={(event) => handleChange('imageUrl', event.target.value)}
                  className="h-11 min-w-0 flex-1 border-0 bg-transparent text-white outline-none placeholder:text-slate-500"
                  placeholder="/images/蚝油生菜.jpg"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-bold text-cyan-100">默认数量</span>
              <input
                type="number"
                min="1"
                value={form.defaultQuantity}
                onChange={(event) => handleChange('defaultQuantity', event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-bold text-cyan-100">描述</span>
              <textarea
                value={form.description}
                onChange={(event) => handleChange('description', event.target.value)}
                className="mt-1 min-h-24 w-full rounded-lg border border-cyan-300/25 bg-slate-950/70 px-3 py-2 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
                placeholder="清爽下饭"
              />
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 text-sm font-black text-slate-950 transition hover:bg-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isSaving ? '保存中' : editingId ? '保存修改' : '添加菜品'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              disabled={isSaving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-500/40 bg-slate-800/80 px-5 text-sm font-black text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="h-4 w-4" />
              取消
            </button>
          ) : null}
        </div>
      </form>

      {dishesStore.items.length === 0 ? <EmptyState title="还没有菜品" /> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {dishesStore.items.map((dish) => (
          <article
            key={dish.id}
            className="grid grid-cols-[84px_1fr] gap-3 rounded-lg border border-cyan-300/25 bg-slate-950/72 p-3 shadow-[0_0_18px_rgba(34,211,238,0.1)]"
          >
            <div className="aspect-square overflow-hidden rounded-md bg-slate-900">
              <ItemImage src={dish.imageUrl} alt={dish.name} />
            </div>
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-black text-white">{dish.name}</h3>
                  <p className="text-sm text-cyan-200">
                    {dish.category || '其他'} · 默认 {dish.defaultQuantity || 1} 份
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => startEditing(dish)}
                    className="grid h-9 w-9 place-items-center rounded-md text-slate-300 transition hover:bg-cyan-300/15 hover:text-cyan-100"
                    aria-label="编辑菜品"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => dishesStore.removeItem(dish.id)}
                    className="grid h-9 w-9 place-items-center rounded-md text-slate-300 transition hover:bg-fuchsia-400/15 hover:text-fuchsia-100"
                    aria-label="删除菜品"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-300">{dish.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
