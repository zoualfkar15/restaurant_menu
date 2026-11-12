const API_ORIGIN = 'https://restaurant-menu-lzkb.onrender.com';
const SLUG = '[A-Za-z0-9_-]+';

function cacheKey(pathname) {
  const catalog = pathname.match(new RegExp(`^/api/restaurants/(${SLUG})/catalog/?$`));
  if (catalog) return { slug: catalog[1], key: `catalog:${catalog[1]}` };
  const menu = pathname.match(new RegExp(`^/api/restaurants/(${SLUG})/menu/?$`));
  if (menu) return { slug: menu[1], key: `catalog:${menu[1]}` };
  const product = pathname.match(new RegExp(`^/api/restaurants/(${SLUG})/products/(${SLUG})/?$`));
  if (product) return { slug: product[1], key: `product:${product[1]}:${product[2]}` };
  const profile = pathname.match(new RegExp(`^/api/restaurants/(${SLUG})/?$`));
  if (profile) return { slug: profile[1], key: `profile:${profile[1]}` };
  return null;
}

function jsonHeaders(extra = {}) {
  return {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=0, must-revalidate',
    ...extra,
  };
}

async function addToIndex(kv, slug, key) {
  const indexKey = `index:${slug}`;
  const raw = await kv.get(indexKey);
  const keys = raw ? JSON.parse(raw) : [];
  if (!keys.includes(key)) {
    keys.push(key);
    await kv.put(indexKey, JSON.stringify(keys));
  }
}

async function purgeSlug(kv, slug) {
  const indexKey = `index:${slug}`;
  const indexed = JSON.parse((await kv.get(indexKey)) || '[]');
  const keys = new Set([`catalog:${slug}`, `profile:${slug}`, indexKey, ...indexed]);
  let cursor;
  do {
    const page = await kv.list({ prefix: `product:${slug}:`, cursor });
    for (const item of page.keys) keys.add(item.name);
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  await Promise.all([...keys].map((key) => kv.delete(key)));
  return keys.size;
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = (env.API_ORIGIN || API_ORIGIN).replace(/\/$/, '');

  if (url.pathname === '/api/_cache/purge' && request.method === 'POST') {
    const secret = env.CACHE_PURGE_SECRET;
    if (!secret || request.headers.get('x-cache-purge-secret') !== secret) {
      return new Response(JSON.stringify({ ok: false }), { status: 401, headers: jsonHeaders() });
    }
    const body = await request.json().catch(() => ({}));
    const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
    if (!new RegExp(`^${SLUG}$`).test(slug)) {
      return new Response(JSON.stringify({ ok: false, error: 'slug required' }), {
        status: 400,
        headers: jsonHeaders(),
      });
    }
    const deleted = await purgeSlug(env.MENU_CACHE, slug);
    return new Response(JSON.stringify({ ok: true, slug, deleted }), { headers: jsonHeaders() });
  }

  const spec =
    request.method === 'GET' && !request.headers.get('Authorization') ? cacheKey(url.pathname) : null;

  if (spec && env.MENU_CACHE) {
    const hit = await env.MENU_CACHE.get(spec.key, { type: 'arrayBuffer' });
    if (hit) {
      return new Response(hit, { headers: jsonHeaders({ 'x-menu-cache': 'HIT' }) });
    }
    const originRes = await fetch(`${origin}${url.pathname}${url.search}`, {
      headers: { accept: 'application/json' },
    });
    if (originRes.ok) {
      const buf = await originRes.arrayBuffer();
      const writes = [env.MENU_CACHE.put(spec.key, buf)];
      if (spec.key.startsWith('product:')) writes.push(addToIndex(env.MENU_CACHE, spec.slug, spec.key));
      await Promise.all(writes);
      return new Response(buf, {
        status: originRes.status,
        headers: jsonHeaders({
          'content-type': originRes.headers.get('content-type') || 'application/json; charset=utf-8',
          'x-menu-cache': 'MISS',
        }),
      });
    }
    return originRes;
  }

  const headers = new Headers(request.headers);
  headers.delete('host');
  const init = { method: request.method, headers };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
  }
  return fetch(`${origin}${url.pathname}${url.search}`, init);
}
