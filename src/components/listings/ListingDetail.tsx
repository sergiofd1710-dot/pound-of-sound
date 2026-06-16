import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';
import { useAuth } from '../../contexts/AuthContext';
import type { ListingWithSeller } from '../../types/database';
import {
  isExchange,
  isSell,
  priceLabel,
  typeLabel,
} from '../../lib/listing';
import styles from './ListingDetail.module.css';

interface ListingDetailProps {
  listing: ListingWithSeller | null;
  onClose: () => void;
  onRequireAuth: () => void;
}

export function ListingDetail({
  listing: r,
  onClose,
  onRequireAuth,
}: ListingDetailProps) {
  const { user } = useAuth();
  const toast = useToast();

  if (!r) return null;

  const price = priceLabel(r.price);
  const seller = r.profiles?.username ?? 'Пользователь';
  const initials = seller.slice(0, 2).toUpperCase();

  // В Фазе 1 кнопки покупки/обмена — заглушки. Реальный эскроу-флоу — Фаза 6.
  function handleAction(label: string) {
    if (!user) {
      onRequireAuth();
      toast('Войдите, чтобы продолжить');
      return;
    }
    toast(`${label} — скоро (безопасная сделка появится позже)`);
  }

  const specs: [string, string][] = [
    ['Жанр', r.genre ?? '—'],
    ['Лейбл', r.label ?? '—'],
    ['Год', r.year ?? '—'],
    ['Состояние', String(r.condition)],
    ['Тип', typeLabel(r.type)],
  ];

  return (
    <Modal open={!!r} onClose={onClose} title="Объявление" width={760}>
      <div className={styles.body}>
        <div className={styles.visual}>
          {r.image_url ? (
            <img src={r.image_url} alt={r.artist} className={styles.cover} />
          ) : (
            <div className={styles.record} />
          )}
          <table className={styles.specs}>
            <tbody>
              {specs.map(([k, v]) => (
                <tr key={k}>
                  <td className={styles.specKey}>{k}</td>
                  <td className={styles.specVal}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.info}>
          <div className={styles.genre}>{r.genre ?? ''}</div>
          <div className={styles.artist}>{r.artist}</div>
          <div className={styles.album}>{r.album}</div>

          <div className={styles.priceBlock}>
            <div className={styles.price}>{price}</div>
            <div className={styles.priceSub}>
              {r.type === 'exchange' ? 'только обмен' : 'фиксированная цена'}
            </div>
          </div>

          <p className={styles.desc}>{r.description ?? 'Описание не указано.'}</p>

          <div className={styles.tags}>
            <span className={styles.tag}>{r.condition}</span>
            {r.genre && <span className={styles.tag}>{r.genre}</span>}
          </div>

          <div className={styles.actions}>
            {isSell(r.type) && (
              <Button
                variant="fill"
                onClick={() => handleAction(`Купить за ${price}`)}
              >
                Купить за {price}
              </Button>
            )}
            {isExchange(r.type) && (
              <Button onClick={() => handleAction('Предложить обмен')}>
                Предложить обмен
              </Button>
            )}
          </div>

          <div className={styles.seller}>
            <div className={styles.avatar}>{initials}</div>
            <div>
              <div className={styles.sellerName}>{seller}</div>
              <div className={styles.sellerMeta}>Продавец</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
