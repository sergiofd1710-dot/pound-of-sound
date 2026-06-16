import { Link, NavLink } from 'react-router-dom';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationBell } from './NotificationBell';
import styles from './Nav.module.css';

interface NavProps {
  onAddClick: () => void;
  onAuthClick: () => void;
}

const LINKS = [
  { to: '/', label: 'Каталог', end: true },
  { to: '/auctions', label: 'Торги', end: false },
  { to: '/club', label: 'Клуб', end: false },
  { to: '/appraise', label: 'ИИ-оценка', end: false },
];

export function Nav({ onAddClick, onAuthClick }: NavProps) {
  const { user, username, signOut } = useAuth();

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoMark} />
        Pound of Sound
      </Link>

      <ul className={styles.links}>
        {LINKS.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                isActive ? styles.activeLink : undefined
              }
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className={styles.right}>
        <Button onClick={onAddClick}>+ Объявление</Button>
        {user ? (
          <div className={styles.user}>
            <NotificationBell />
            <Link to="/chats" className={styles.icon} aria-label="Сообщения">
              ✉
            </Link>
            <Link to="/profile" className={styles.username}>
              {username ?? user.email?.split('@')[0]}
            </Link>
            <Button onClick={() => void signOut()}>Выйти</Button>
          </div>
        ) : (
          <Button variant="fill" onClick={onAuthClick}>
            Войти
          </Button>
        )}
      </div>
    </nav>
  );
}
