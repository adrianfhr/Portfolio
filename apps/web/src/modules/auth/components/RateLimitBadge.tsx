import { useEffect, useState } from 'react';

export default function RateLimitBadge() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [policy, setPolicy] = useState<string>('');

  useEffect(() => {
    function updateFromHeaders() {
      // This component reads headers from the last API response.
      // For a real app you'd store this in a global store or context.
      // Here we use a simple custom event for demonstration.
      const lastRemaining = (window as any).__lastRateLimitRemaining;
      const lastPolicy = (window as any).__lastRateLimitPolicy;
      if (lastRemaining !== undefined) setRemaining(parseInt(lastRemaining, 10));
      if (lastPolicy) setPolicy(lastPolicy);
    }

    window.addEventListener('rate-limit-update', updateFromHeaders);
    updateFromHeaders();
    return () => window.removeEventListener('rate-limit-update', updateFromHeaders);
  }, []);

  if (remaining === null) return null;

  const low = remaining < 5;
  const color = low ? '#ffcf70' : '#6cf0b1';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.25rem 0.6rem',
        borderRadius: '999px',
        border: `1px solid ${color}30`,
        background: `${color}10`,
        color,
        fontSize: '0.78rem',
        fontFamily: 'var(--mono)',
      }}
      title={policy}
    >
      <span style={{ width: '0.45rem', height: '0.45rem', borderRadius: '999px', background: color }} />
      {remaining} left
    </div>
  );
}
