import { Link } from 'react-router-dom';
import { useDemo } from '../hooks/useDemo';
import { Countdown } from '../components/common/Countdown';
import styles from './AuctionsPage.module.css';

export function AuctionsPage() {
  const { auctions } = useDemo();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>Аукционы</div>
          <h1 className={styles.title}>Торги за редкий винил</h1>
        </div>
        <span className={styles.meta}>{auctions.length} активных лотов</span>
      </div>

      <div className={styles.grid}>
        {auctions.map((a) => (
          <Link key={a.id} to={`/auctions/${a.id}`} className={styles.card}>
            <div className={styles.visual} style={{ background: a.color }}>
              <div className={styles.disc} />
              <span className={styles.condition}>{a.condition}</span>
            </div>
            <div className={styles.body}>
              <div className={styles.genre}>{a.genre}</div>
              <div className={styles.artist}>{a.artist}</div>
              <div className={styles.album}>{a.album}</div>
              <div className={styles.year}>
                {a.year} · {a.label}
              </div>
            </div>
            <div className={styles.footer}>
              <div>
                <div className={styles.priceLabel}>Текущая ставка</div>
                <div className={styles.price}>
                  {a.currentPrice.toLocaleString('ru-RU')} ₽
                </div>
              </div>
              <div className={styles.timer}>
                <div className={styles.timerLabel}>До конца</div>
                <Countdown endsAt={a.endsAt} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
