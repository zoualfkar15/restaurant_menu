const BASE = import.meta.env.VITE_API_URL || '';

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  const apiPath = p.startsWith('/api') ? p : `/api${p}`;
  return `${BASE}${apiPath}`;
}

export async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('accessToken');
  const headers: HeadersInit = {
    ...(options.headers as Record<string, string>),
    'Content-Type': 'application/json',
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  const res = await fetch(apiUrl(path), { ...options, headers });

  if (res.status === 401) {
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

export async function authUploadFile(file: File, path = '/admin/upload'): Promise<{ url: string }> {
  const token = localStorage.getItem('accessToken');
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (res.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Upload failed');
  }
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return { res, data: await res.json().catch(() => ({})) };
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch(apiUrl('/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return { res, data: await res.json().catch(() => ({})) };
}

const inflightCatalog = new Map<string, Promise<unknown>>();

/** Restaurant + categories + products in one request. */
export async function getCatalog(slug: string) {
  const existing = inflightCatalog.get(slug);
  if (existing) return existing;

  const promise = fetch(apiUrl(`/restaurants/${slug}/catalog`))
    .then((res) => (res.ok ? res.json() : null))
    .finally(() => inflightCatalog.delete(slug));

  inflightCatalog.set(slug, promise);
  return promise;
}

export async function getRestaurant(slug: string) {
  return getCatalog(slug);
}

export async function getMenu(slug: string) {
  return getCatalog(slug);
}

export async function getProduct(restaurantSlug: string, productSlug: string) {
  const res = await fetch(apiUrl(`/restaurants/${restaurantSlug}/products/${productSlug}`));
  if (!res.ok) return null;
  return res.json();
}
