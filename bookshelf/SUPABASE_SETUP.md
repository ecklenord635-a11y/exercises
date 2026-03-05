# Supabase 配置指南

## 获取正确的 API Key

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目（或创建新项目）
3. 左侧点击 **Project Settings**（齿轮图标）
4. 在 **API** 页面找到：
   - **Project URL**：如 `https://xxxxx.supabase.co`
   - **Project API keys** → **anon public**：点击复制

## 配置 .env

1. 打开项目根目录的 `.env` 文件
2. 确保格式正确（**不要**加引号、不要有多余空格）：

```
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=粘贴你复制的anon公钥
```

3. 检查：
   - 每行一个变量
   - `=` 两边不要有空格
   - anon key 是一长串以 `eyJ` 开头的字符串
   - 复制时不要漏掉开头或结尾的字符

## 重启开发服务器

修改 `.env` 后必须重启：

1. 在终端按 `Ctrl + C` 停止当前服务器
2. 再次运行 `npm run dev`

## 常见问题

- **Invalid API key**：key 错误、复制不完整、或来自错误项目
- **项目被暂停**：Supabase 免费项目长时间不用会暂停，需在 Dashboard 中恢复
