# 个人书架

基于 PRD 开发的个人书架网站，采用 Apple 风格简洁大气的 UI 设计。

## 功能特性

- **用户系统**：登录/注册（Supabase Auth）
- **书架管理**：添加、编辑、删除书籍
- **阅读追踪**：想读 / 在读 / 已读，阅读进度
- **评分与书评**：1-5 星评分，书评笔记
- **搜索与筛选**：按书名、作者、状态搜索，多维度排序
- **阅读统计**：藏书总数、已读数量、平均评分等

## 技术栈

- React 19 + TypeScript
- Vite 7
- React Router 7
- Supabase（数据库 + 认证）
- Lucide React（图标）

## Supabase 配置

1. 在 Supabase 控制台执行 `supabase-schema.sql` 创建表
2. 复制 `.env.example` 为 `.env`，填入：
   - `VITE_SUPABASE_URL`：项目 URL
   - `VITE_SUPABASE_ANON_KEY`：anon 公钥（Project Settings → API）
3. 开发阶段可在 Authentication → Providers → Email 中关闭「Confirm email」

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
bookshelf/
├── src/
│   ├── components/     # 通用组件
│   ├── context/        # React Context（认证）
│   ├── lib/            # Supabase 客户端与数据层
│   ├── pages/          # 页面组件
│   ├── types/          # TypeScript 类型
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── tailwind.config.js
└── package.json
```

## 设计说明

- 采用 Apple 风格：浅灰背景、圆角卡片、柔和阴影
- 主色：#0071e3（Apple 蓝）
- 响应式布局，支持移动端
- 毛玻璃导航栏（backdrop-blur）
