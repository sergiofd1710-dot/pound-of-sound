import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Nav.module.css';

interface NavProps {
  onAddClick: () => void;
  onAuthClick: () => void;
}

export function Nav({ onAddClick, onAuthClick }: NavProps) {
  const { user, username, signOut } = useAuth();

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoMark} />
        Pound of Sound
      </Link>

      <ul className={styles.links}>
        <li>
          <a href="#catalog">Каталог</a>
        </li>
        <li>
          <a href="#expert">Оценка</a>
        </li>
      </ul>

      <div className={styles.right}>
        <Button onClick={onAddClick}>+ Объявление</Button>
        {user ? (
          <div className={styles.user}>
            <span className={styles.username}>
              {username ?? user.email?.split('@')[0]}
            </span>
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
