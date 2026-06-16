import { useEffect, useState } from 'react';

function format(ms: number): { text: string; ended: boolean } {
  if (ms <= 0) return { text: 'Торги завершены', ended: true };
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return { text: `${d}д ${h}ч ${m}м`, ended: false };
  if (h > 0) return { text: `${h}ч ${m}м ${sec}с`, ended: false };
  return { text: `${m}м ${sec}с`, ended: false };
}

export function Countdown({ endsAt }: { endsAt: string }) {
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const { text, ended } = format(new Date(endsAt).getTime() - Date.now());

  return (
    <span
      style={{
        fontFamily: 'var(--mono)',
        color: ended ? 'var(--text3)' : 'var(--accent2)',
      }}
    >
      {text}
    </span>
  );
}
