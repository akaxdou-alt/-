export function FirebaseSetupNotice() {
  return (
    <div className="mx-auto mt-12 max-w-2xl rounded-lg border border-amber-200 bg-white p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
        Firebase 还没配置
      </p>
      <h1 className="mt-2 text-2xl font-bold text-stone-900">先填好 `.env`，网站就能实时同步</h1>
      <p className="mt-3 leading-7 text-stone-600">
        请复制 `.env.example` 为 `.env.local`，填入你的 Firebase Web App 配置，然后在 Firebase
        控制台开启 Firestore Database。
      </p>
      <div className="mt-5 rounded-lg bg-stone-950 p-4 text-sm text-stone-100">
        <code>cp .env.example .env.local</code>
      </div>
    </div>
  );
}
