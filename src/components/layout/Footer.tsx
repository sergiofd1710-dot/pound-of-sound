import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>Pound of Sound</div>
      <div>© 2026 — MVP. Учебный проект «Управление продуктом»</div>
      <div>О проекте · Правила · Помощь</div>
    </footer>
  );
}
