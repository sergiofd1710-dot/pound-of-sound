import { useStats } from '../../hooks/useListings';
import { Button } from '../common/Button';
import styles from './Hero.module.css';

interface HeroProps {
  onSellClick: () => void;
}

export function Hero({ onSellClick }: HeroProps) {
  const { data: stats } = useStats();

  function scrollToCatalog() {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className={styles.hero}>
      <div className={styles.recordWrap}>
        <div className={styles.record}>
          <div className={styles.recordLabel}>
            <div className={styles.labelTitle}>
              Pound
              <br />
              of Sound
            </div>
            <div className={styles.labelSub}>33⅓ RPM</div>
          </div>
        </div>
        <div className={styles.tonearm} />
      </div>

      <div className={styles.content}>
        <div className={styles.eyebrow}>Маркетплейс виниловых пластинок</div>
        <h1 className={styles.title}>
          Найди
          <br />
          <em>редкий</em>
          <br />
          винил.
        </h1>
        <p className={styles.sub}>
          Покупай, продавай и обменивай пластинки с коллекционерами по всей
          стране. Экспертная оценка состояния и подлинности.
        </p>
        <div className={styles.actions}>
          <Button variant="fill" onClick={scrollToCatalog}>
            Смотреть каталог
          </Button>
          <Button onClick={onSellClick}>Продать пластинку</Button>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNum}>
              {stats ? stats.listings.toLocaleString('ru-RU') : '—'}
            </div>
            <div className={styles.statLabel}>Пластинок</div>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <div className={styles.statNum}>
              {stats ? stats.users.toLocaleString('ru-RU') : '—'}
            </div>
            <div className={styles.statLabel}>Продавцов</div>
          </div>
        </div>
      </div>
    </section>
  );
}
