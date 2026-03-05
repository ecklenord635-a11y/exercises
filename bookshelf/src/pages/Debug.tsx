/**
 * 临时调试页：验证 Supabase 连接
 * 访问 http://localhost:5176/debug 查看
 */
import { useState } from 'react';
import { supabaseUrl, supabaseAnonKey } from '../lib/supabase';
import { supabase } from '../lib/supabase';

export default function Debug() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('测试中...');
    try {
      const { error } = await supabase.from('profiles').select('id').limit(1);
      if (error) {
        setResult(`✗ ${error.message} (code: ${error.code || '-'})`);
      } else {
        setResult('✓ 连接成功！API Key 有效。');
      }
    } catch (e) {
      setResult(`✗ ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  const urlOk = !!supabaseUrl && supabaseUrl.startsWith('https://');
  const keyOk = !!supabaseAnonKey && supabaseAnonKey.startsWith('eyJ');

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>Supabase 连接诊断</h1>
      <div style={{ marginBottom: 16, fontSize: 14 }}>
        <p>URL: {urlOk ? '✓ 已配置' : '✗ 未配置'}</p>
        <p>Key: {keyOk ? `✓ 已配置 (${supabaseAnonKey.length} 字符)` : '✗ 未配置或格式异常'}</p>
      </div>
      <button
        onClick={testConnection}
        disabled={loading}
        style={{ padding: '8px 16px', cursor: loading ? 'wait' : 'pointer' }}
      >
        {loading ? '测试中...' : '测试连接'}
      </button>
      {result && (
        <p style={{ marginTop: 16, color: result.startsWith('✓') ? 'green' : '#dc2626' }}>
          {result}
        </p>
      )}
      <p style={{ marginTop: 24, fontSize: 12, color: '#666' }}>
        若显示 Invalid API key：1) 确认 Supabase 项目未暂停 2) 在 Dashboard 重新复制 anon 公钥 3) 修改 .env 后务必在 bookshelf 目录下重启 (Ctrl+C 后 npm run dev)
      </p>
    </div>
  );
}
