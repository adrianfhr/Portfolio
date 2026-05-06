const API_BASE = '/api/v1';

export interface AuthMeResponse {
  authenticated: boolean;
  user?: {
    id: number;
    login: string;
    avatar_url?: string;
    role: string;
  };
  guest_id?: string | null;
  tier: string;
}

export async function getMe(): Promise<AuthMeResponse> {
  const token = localStorage.getItem('portfolio_access_token');
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/auth/me`, { headers });
  if (!res.ok) throw new Error('Failed to fetch auth state');
  return res.json();
}

export async function getGuestSession(): Promise<{ guest_id: string; signature: string }> {
  const res = await fetch(`${API_BASE}/auth/guest`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to create guest session');
  return res.json();
}

export async function logout(): Promise<void> {
  const token = localStorage.getItem('portfolio_access_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers,
    credentials: 'include',
  });
}
