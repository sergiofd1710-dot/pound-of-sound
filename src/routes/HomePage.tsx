import { useMemo, useState } from 'react';
import { Hero } from '../components/layout/Hero';
import { ExpertSection } from '../components/layout/ExpertSection';
import { FilterBar } from '../components/listings/FilterBar';
import { ListingGrid } from '../components/listings/ListingGrid';
import { ListingDetail } from '../components/listings/ListingDetail';
import { useListings } from '../hooks/useListings';
import { filterListings } from '../lib/listing';
import type { ListingWithSeller } from '../types/database';
import styles from './HomePage.module.css';

interface HomePageProps {
  onSellClick: () => void;
  onRequireAuth: () => void;
}

export function HomePage({ onSellClick, onRequireAuth }: HomePageProps) {
  const { data: listings = [], isLoading, isError } = useListings();

  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ListingWithSeller | null>(null);

  const filtered = useMemo(
    () => filterListings(listings, { category, search }),
    [listings, category, search],
  );

  return (
    <>
      <Hero onSellClick={onSellClick} />

      <FilterBar
        category={category}
        search={search}
        onCategory={setCategory}
        onSearch={setSearch}
      />

      <section className={styles.catalog} id="catalog">
        <div className={styles.header}>
          <h2 className={styles.title}>Свежие объявления</h2>
          <span className={styles.meta}>
            {isLoading ? 'Загрузка…' : `${filtered.length} объявлений`}
          </span>
        </div>

        <ListingGrid
          listings={filtered}
          loading={isLoading}
          error={isError}
          onOpen={setSelected}
        />
      </section>

      <ExpertSection />

      <ListingDetail
        listing={selected}
        onClose={() => setSelected(null)}
        onRequireAuth={onRequireAuth}
      />
    </>
  );
}
