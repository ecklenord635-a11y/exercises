/**
 * 使用原生 fetch 调用 Supabase API，确保请求头纯 ASCII，避免
 * 非 ASCII 字符（如中文）进入 HTTP 头导致的 ISO-8859-1 错误
 */
import { supabaseUrl, supabaseAnonKey } from './supabase';
import { supabase } from './supabase';

function getAuthError(data: Record<string, unknown>, fallback: string): string {
  const err = data.error;
  const msg =
    data.error_description ??
    (typeof err === 'object' && err && 'message' in err ? (err as { message?: string }).message : null) ??
    data.msg ??
    data.message;
  if (typeof msg === 'string') {
    if (/invalid.*api.*key/i.test(msg)) {
      return 'API Key 无效：请确认 1) Supabase 项目未暂停 2) 从 Dashboard 重新复制 anon 公钥 3) 修改 .env 后重启开发服务器';
    }
    return msg;
  }
  const code = typeof err === 'string' ? err : data.code;
  if (code === 'user_already_registered') return '该邮箱已注册，请直接登录';
  if (code === 'email_not_confirmed') return '请先查收邮件完成验证';
  return fallback;
}

export async function signUpWithFetch(email: string, password: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ email, password }),
    });
  } catch (e) {
    throw new Error('网络请求失败，请检查网络连接');
  }
  let data: Record<string, unknown>;
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    throw new Error(`注册失败 (${res.status})`);
  }
  if (!res.ok || data.error) {
    throw new Error(getAuthError(data, '注册失败'));
  }
  // 有 token 则直接登录；无 token 时可能是需邮箱确认，已创建用户
  if (data.access_token && data.refresh_token) {
    await supabase.auth.setSession({
      access_token: data.access_token as string,
      refresh_token: data.refresh_token as string,
    });
  }
}

export async function signInWithFetch(email: string, password: string): Promise<void> {
  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error_description || data.error?.message || '登录失败');
  }
  if (data.access_token && data.refresh_token) {
    await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
  }
}

/** 使用 fetch 更新 profile 姓名，请求体 UTF-8 不受 headers 限制 */
export async function updateProfileName(userId: string, name: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) return;

  const res = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${token}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ name, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error('更新姓名失败');
}
