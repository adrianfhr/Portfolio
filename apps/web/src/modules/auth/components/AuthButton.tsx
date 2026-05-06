import { useEffect, useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';
import { getMe, getGuestSession, logout } from '../services/authService';

export default function AuthButton() {
  const { user, isAuthenticated, isLoading, guestId, setUser, setGuestId, setLoading, login, logout: clearAuth } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const data = await getMe();
        if (cancelled) return;
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else if (data.guest_id) {
          setGuestId(data.guest_id);
        } else {
          const guest = await getGuestSession();
          if (!cancelled) setGuestId(guest.guest_id);
        }
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => { cancelled = true; };
  }, [setUser, setGuestId, setLoading]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      const guest = await getGuestSession();
      setGuestId(guest.guest_id);
      setDropdownOpen(false);
    }
  };

  if (isLoading) {
    return <div style={{ width: '2rem', height: '2rem', borderRadius: '999px', background: 'rgba(255,255,255,0.06)' }} />;
  }

  if (isAuthenticated && user) {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            border: '1px solid rgba(155,185,217,0.18)',
            background: 'rgba(255,255,255,0.03)',
            color: '#e9f1fb',
            cursor: 'pointer',
            fontSize: '0.88rem',
          }}
        >
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.login} style={{ width: '1.5rem', height: '1.5rem', borderRadius: '999px' }} />
          ) : (
            <User size={18} />
          )}
          <span>{user.login}</span>
        </button>
        {dropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.4rem)',
              right: 0,
              minWidth: '10rem',
              borderRadius: '14px',
              border: '1px solid rgba(155,185,217,0.18)',
              background: 'rgba(8,18,30,0.96)',
              backdropFilter: 'blur(18px)',
              padding: '0.5rem',
              zIndex: 100,
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '10px',
                border: 'none',
                background: 'transparent',
                color: '#e9f1fb',
                cursor: 'pointer',
                fontSize: '0.88rem',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {guestId && (
        <span
          style={{
            padding: '0.25rem 0.6rem',
            borderRadius: '999px',
            border: '1px solid rgba(155,185,217,0.14)',
            background: 'rgba(255,255,255,0.02)',
            color: '#95abc4',
            fontSize: '0.78rem',
            fontFamily: 'var(--mono)',
            letterSpacing: '0.04em',
          }}
        >
          Guest
        </span>
      )}
      <a
        href="/api/v1/auth/github/initiate"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.45rem 0.9rem',
          borderRadius: '999px',
          border: '1px solid rgba(113,214,255,0.28)',
          background: 'linear-gradient(135deg, rgba(71,157,255,0.25), rgba(113,214,255,0.08))',
          color: '#e9f1fb',
          fontSize: '0.88rem',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        Login with GitHub
      </a>
    </div>
  );
}
