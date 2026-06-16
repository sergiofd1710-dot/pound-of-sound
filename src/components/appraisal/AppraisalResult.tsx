import {
  VERDICT_LABEL,
  type AppraisalResult as Result,
} from '../../lib/appraisal';
import styles from './AppraisalResult.module.css';

export function AppraisalResult({ result }: { result: Result }) {
  const { price_range, rarity_score, price_factors, verdict, advice } = result;

  return (
    <div className={styles.card}>
      <div className={styles.priceBlock}>
        <div className={styles.priceLabel}>Рыночная вилка</div>
        <div className={styles.price}>
          {price_range.min.toLocaleString('ru-RU')} –{' '}
          {price_range.max.toLocaleString('ru-RU')} ₽
        </div>
      </div>

      <div className={styles.row}>
        <span className={styles.rowLabel}>Редкость</span>
        <div className={styles.rarity}>
          <div className={styles.rarityTrack}>
            <div
              className={styles.rarityFill}
              style={{ width: `${rarity_score * 10}%` }}
            />
          </div>
          <span className={styles.rarityNum}>{rarity_score}/10</span>
        </div>
      </div>

      <div className={styles.row}>
        <span className={styles.rowLabel}>Вердикт</span>
        <span className={`${styles.verdict} ${styles[verdict]}`}>
          {VERDICT_LABEL[verdict]}
        </span>
      </div>

      <div className={styles.factors}>
        <div className={styles.rowLabel}>Факторы цены</div>
        <ul>
          {price_factors.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>

      <p className={styles.advice}>{advice}</p>

      <div className={styles.disclaimer}>
        Демо-оценка для презентации проекта. Точный грейд винила по фото/тексту
        недостоверен — финальное состояние подтверждается продавцом или живым
        экспертом.
      </div>
    </div>
  );
}
