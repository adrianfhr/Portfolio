import type { APIRoute } from 'astro';

const backendBaseUrl = import.meta.env.API_BASE_URL ?? 'http://127.0.0.1:8000';

async function proxy(request: Request, path: string[]) {
  const targetUrl = new URL(path.join('/'), backendBaseUrl.endsWith('/') ? backendBaseUrl : `${backendBaseUrl}/`);
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

  const responseHeaders = new Headers(response.headers);
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