import { resetDemo } from '../../lib/demoStore';
import { useToast } from '../common/Toast';
import styles from './Footer.module.css';

export function Footer() {
  const toast = useToast();

  function reset() {
    resetDemo();
    toast('Демо-данные сброшены');
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>Pound of Sound</div>
      <div>© 2026 — MVP. Учебный проект «Управление продуктом»</div>
      <div>
        О проекте · Правила ·{' '}
        <button className={styles.reset} onClick={reset}>
          Сбросить демо
        </button>
      </div>
    </footer>
  );
}
