# 今晚吃什么

给两个人一起使用的共享菜单网站，使用 React + Vite + Tailwind CSS + Firebase Firestore。

## 功能

- 菜单页：查看菜品、选择数量、加入今晚点单
- 今晚点单：实时同步当前点单，支持改数量和删除
- 冰箱库存：实时同步库存，支持新增、增减数量和删除
- 管理页：新增、编辑、删除菜品
- 共享 ID：`couple-home`

## 运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

在 `.env.local` 里填入 Firebase Web App 配置，然后在 Firebase 控制台启用 Firestore Database。

## Firestore 数据结构

```text
homes/couple-home/dishes
homes/couple-home/orders
homes/couple-home/inventory
```

## Firestore 规则示例

这个项目按你的要求没有登录功能。下面规则只适合私人小项目或临时使用；如果之后要放公网，建议加登录或加一层自己的访问控制。

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /homes/couple-home/{collection}/{document} {
      allow read, write: if true;
    }
  }
}
```
