import type { APIRoute } from 'astro';

const backendBaseUrl = import.meta.env.API_BASE_URL ?? 'http://127.0.0.1:8000';

async function proxy(request: Request, path: string[]) {
  // Astro route is /api/*; backend also expects /api/*
  const backendPath = ['api', ...path].join('/');
  const targetUrl = new URL(backendPath, backendBaseUrl.endsWith('/') ? backendBaseUrl : `${backendBaseUrl}/`);
  targetUrl.search = new URL(request.url).search;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('connection');
  headers.delete('content-length');

  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: body ? Buffer.from(body) : undefined,
    redirect: 'manual',
  });

  const responseHeaders = new Headers();
  // Forward all headers, preserving multiple Set-Cookie values
  response.headers.forEach((value, key) => {
    if (key === 'set-cookie') {
      const cookies = response.headers.getSetCookie ? response.headers.getSetCookie() : [value];
      cookies.forEach((cookie) => responseHeaders.append('set-cookie', cookie));
    } else {
      responseHeaders.set(key, value);
    }
  });

  responseHeaders.delete('content-encoding');
  responseHeaders.delete('transfer-encoding');

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const ALL: APIRoute = async ({ params, request }) => {
  const path = Array.isArray(params.path) ? params.path : params.path ? [params.path] : [];
  return proxy(request, path);
};
