const getBase = () =>
  typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function apiUrl(path: string) {
  const base = getBase();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}/api${p.startsWith('/api') ? p.replace(/^\/api/, '') : p}`;
}

export async function authFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const headers: HeadersInit = {
    ...(options.headers as Record<string, string>),
    'Content-Type': 'application/json',
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  const res = await fetch(apiUrl(path), { ...options, headers });
  if (res.status === 401 && typeof window !== 'undefined') {
    const refresh = localStorage.getItem('refreshToken');
    if (refresh) {
      const r = await fetch(apiUrl('/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      const data = await r.json().catch(() => ({}));
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        (headers as Record<string, string>)['Authorization'] = `Bearer ${data.accessToken}`;
        return fetch(apiUrl(path), { ...options, headers });
      }
    }
    window.location.href = '/login';
  }
  return res;
}

/** Upload a file; returns { url } from the API. */
export async function authUploadFile(file: File): Promise<{ url: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(apiUrl('/admin/upload'), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (res.status === 401 && typeof window !== 'undefined') {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Upload failed');
  }
  return res.json();
}
