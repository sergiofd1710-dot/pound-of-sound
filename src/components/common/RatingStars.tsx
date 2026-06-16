import styles from './RatingStars.module.css';

interface RatingStarsProps {
  value: number; // 0–5 (может быть дробным для отображения)
  size?: number;
  onSelect?: (value: number) => void; // если задан — интерактивный ввод
}

export function RatingStars({ value, size = 16, onSelect }: RatingStarsProps) {
  return (
    <span className={styles.stars} style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = onSelect ? i <= value : i <= Math.round(value);
        return (
          <button
            key={i}
            type="button"
            className={`${styles.star} ${filled ? styles.filled : ''} ${
              onSelect ? styles.interactive : ''
            }`}
            onClick={onSelect ? () => onSelect(i) : undefined}
            disabled={!onSelect}
            aria-label={`${i} из 5`}
          >
            ★
          </button>
        );
      })}
    </span>
  );
}
