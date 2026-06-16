import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo, useActor } from '../../hooks/useDemo';
import { markNotificationsRead } from '../../lib/demoStore';
import styles from './NotificationBell.module.css';

export function NotificationBell() {
  const { notifications } = useDemo();
  const actor = useActor();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!actor) return null;

  const mine = notifications.filter((n) => n.owner === actor);
  const unread = mine.filter((n) => !n.read).length;

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) markNotificationsRead(actor!);
  }

  return (
    <div className={styles.wrap}>
      <button className={styles.bell} onClick={toggle} aria-label="Уведомления">
        🔔
        {unread > 0 && <span className={styles.badge}>{unread}</span>}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.head}>Уведомления</div>
          {mine.length === 0 ? (
            <div className={styles.empty}>Пока пусто</div>
          ) : (
            mine.slice(0, 12).map((n) => (
              <button
                key={n.id}
                className={styles.item}
                onClick={() => {
                  setOpen(false);
                  if (n.link) navigate(n.link);
                }}
              >
                <div className={styles.itemText}>{n.text}</div>
                <div className={styles.itemTime}>
                  {new Date(n.createdAt).toLocaleString('ru-RU')}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
