import type { ListingWithSeller } from '../../types/database';
import { ListingCard } from './ListingCard';
import styles from './ListingGrid.module.css';

interface ListingGridProps {
  listings: ListingWithSeller[];
  loading: boolean;
  error: boolean;
  onOpen: (listing: ListingWithSeller) => void;
}

export function ListingGrid({
  listings,
  loading,
  error,
  onOpen,
}: ListingGridProps) {
  if (loading) {
    return <Empty icon="◎" text="Загрузка…" />;
  }
  if (error) {
    return <Empty icon="⚠" text="Не удалось загрузить объявления." />;
  }
  if (!listings.length) {
    return <Empty icon="◎" text="Объявлений пока нет. Будьте первым!" />;
  }

  return (
    <div className={styles.grid}>
      {listings.map((listing, i) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          index={i}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

function Empty({ icon, text }: { icon: string; text: string }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>{icon}</div>
      <div>{text}</div>
    </div>
  );
}
