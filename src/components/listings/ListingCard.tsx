import type { ListingWithSeller } from '../../types/database';
import {
  RECORD_COLORS,
  actionLabel,
  priceLabel,
  typeLabel,
} from '../../lib/listing';
import styles from './ListingCard.module.css';

interface ListingCardProps {
  listing: ListingWithSeller;
  index: number;
  onOpen: (listing: ListingWithSeller) => void;
}

export function ListingCard({ listing: r, index, onOpen }: ListingCardProps) {
  const color = RECORD_COLORS[index % RECORD_COLORS.length];
  const price = priceLabel(r.price);

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => onOpen(r)}
    >
      <div className={styles.visual}>
        {r.image_url ? (
          <img src={r.image_url} alt={r.artist} className={styles.cover} />
        ) : (
          <div className={styles.record} style={{ background: color }} />
        )}
        <span className={styles.badge}>{typeLabel(r.type)}</span>
        <span className={styles.condition}>{r.condition}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.genre}>{r.genre ?? ''}</div>
        <div className={styles.artist}>{r.artist}</div>
        <div className={styles.album}>{r.album}</div>
        <div className={styles.year}>
          {[r.year, r.label].filter(Boolean).join(' · ')}
        </div>
      </div>

      <div className={styles.footer}>
        <div>
          <div className={styles.price}>{price}</div>
          {r.price > 0 && <div className={styles.priceLabel}>фиксированная</div>}
        </div>
        <div className={styles.type}>
          <span className={styles.dot} />
          {actionLabel(r.type)}
        </div>
      </div>
    </div>
  );
}
