import styles from './FilterBar.module.css';

interface FilterBarProps {
  category: string;
  search: string;
  onCategory: (category: string) => void;
  onSearch: (search: string) => void;
}

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'Джаз', label: 'Джаз' },
  { value: 'Рок', label: 'Рок' },
  { value: 'Классика', label: 'Классика' },
  { value: 'Электроника', label: 'Электроника' },
  { value: 'exchange', label: 'Только обмен' },
];

export function FilterBar({
  category,
  search,
  onCategory,
  onSearch,
}: FilterBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.chips}>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            className={`${styles.chip} ${category === c.value ? styles.active : ''}`}
            onClick={() => onCategory(c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className={styles.searchWrap}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="#756c5f" strokeWidth="1" />
          <line
            x1="9.5"
            y1="9.5"
            x2="13"
            y2="13"
            stroke="#756c5f"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          value={search}
          placeholder="Исполнитель, альбом, лейбл…"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
