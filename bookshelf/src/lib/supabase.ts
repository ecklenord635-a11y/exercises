import { createClient } from '@supabase/supabase-js';

// 移除 BOM、非 ASCII、首尾空白（含 \r\n），避免 key 无效
function sanitizeEnv(str: string): string {
  return String(str || '')
    .replace(/^\uFEFF/, '')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/\r\n?|\n/g, '')  // 移除换行符
    .trim();
}

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseUrl = sanitizeEnv(rawUrl) || rawUrl.trim();
export const supabaseAnonKey = sanitizeEnv(rawKey) || rawKey.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase: 请在 .env 中配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
}
if (supabaseAnonKey && !supabaseAnonKey.startsWith('eyJ')) {
  console.warn('Supabase: anon key 格式异常，应以 eyJ 开头，请检查 .env 中的 VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
