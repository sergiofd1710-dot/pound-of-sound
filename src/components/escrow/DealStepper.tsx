import type { Deal, DealStatus } from '../../lib/demoStore';
import { advanceDeal, cancelDeal } from '../../lib/demoStore';
import { Button } from '../common/Button';
import styles from './DealStepper.module.css';

const STEPS: { status: DealStatus; label: string; hint: string }[] = [
  { status: 'frozen', label: 'Деньги заморожены', hint: 'Оплата удержана площадкой' },
  { status: 'shipped', label: 'Отправлено', hint: 'Продавец отправил пластинку' },
  { status: 'inspection', label: 'Проверка 48ч', hint: 'Покупатель проверяет товар' },
  { status: 'released', label: 'Перевод продавцу', hint: 'Сделка завершена' },
];

const ORDER: DealStatus[] = ['frozen', 'shipped', 'inspection', 'released'];

// Кто двигает шаг дальше (демо): продавец отправляет, покупатель подтверждает.
const ACTION_LABEL: Partial<Record<DealStatus, string>> = {
  frozen: 'Отметить отправку',
  shipped: 'Начать проверку',
  inspection: 'Подтвердить и перевести продавцу',
};

export function DealStepper({
  deal,
  actor,
}: {
  deal: Deal;
  actor: string;
}) {
  const currentIndex = ORDER.indexOf(deal.status);
  const cancelled = deal.status === 'cancelled';
  const done = deal.status === 'released';

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div>
          <div className={styles.subject}>{deal.subject}</div>
          <div className={styles.parties}>
            {deal.buyer} → {deal.seller}
          </div>
        </div>
        <div className={styles.amounts}>
          <div className={styles.amount}>
            {deal.amount.toLocaleString('ru-RU')} ₽
          </div>
          <div className={styles.fee}>
            комиссия 5%: {deal.fee.toLocaleString('ru-RU')} ₽
          </div>
        </div>
      </div>

      {cancelled ? (
        <div className={styles.cancelled}>Сделка отменена</div>
      ) : (
        <div className={styles.steps}>
          {STEPS.map((step, i) => {
            const reached = currentIndex >= i;
            const isCurrent = currentIndex === i;
            return (
              <div
                key={step.status}
                className={`${styles.step} ${reached ? styles.reached : ''} ${
                  isCurrent ? styles.current : ''
                }`}
              >
                <div className={styles.dot}>{reached ? '✓' : i + 1}</div>
                <div className={styles.stepLabel}>{step.label}</div>
                <div className={styles.stepHint}>{step.hint}</div>
              </div>
            );
          })}
        </div>
      )}

      {!cancelled && !done && (
        <div className={styles.actions}>
          {ACTION_LABEL[deal.status] && (
            <Button variant="fill" onClick={() => advanceDeal(deal.id)}>
              {ACTION_LABEL[deal.status]}
            </Button>
          )}
          <button className={styles.cancel} onClick={() => cancelDeal(deal.id)}>
            Отменить сделку
          </button>
          <span className={styles.actorNote}>вы — {actor}</span>
        </div>
      )}

      {done && <div className={styles.done}>Сделка успешно завершена ✓</div>}
    </div>
  );
}
