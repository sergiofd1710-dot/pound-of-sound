import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { RatingStars } from '../common/RatingStars';
import { useToast } from '../common/Toast';
import { useActor, useDemo } from '../../hooks/useDemo';
import {
  addWishlist,
  createDeal,
  sellerRating,
  startConversation,
} from '../../lib/demoStore';
import type { ListingWithSeller } from '../../types/database';
import { isExchange, isSell, priceLabel, typeLabel } from '../../lib/listing';
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
  const actor = useActor();
  const state = useDemo();
  const toast = useToast();
  const navigate = useNavigate();

  if (!r) return null;

  const price = priceLabel(r.price);
  const seller = r.profiles?.username ?? 'Пользователь';
  const subject = `${r.artist} — ${r.album}`;
  const rating = sellerRating(state, seller);

  function requireActor(): string | null {
    if (!actor) {
      onRequireAuth();
      toast('Войдите, чтобы продолжить');
      return null;
    }
    return actor;
  }

  function buySafe() {
    const me = requireActor();
    if (!me) return;
    if (me === seller) {
      toast('Это ваше объявление');
      return;
    }
    createDeal(me, seller, subject, r!.price);
    onClose();
    toast('Безопасная сделка создана');
    navigate('/profile');
  }

  function message(text: string) {
    const me = requireActor();
    if (!me) return;
    if (me === seller) {
      toast('Это ваше объявление');
      return;
    }
    startConversation(me, seller, subject, text);
    onClose();
    navigate('/chats');
  }

  function wish() {
    const me = requireActor();
    if (!me) return;
    addWishlist(me, r!.artist, r!.album, [
      ...state.auctions.map((a) => ({ artist: a.artist, album: a.album })),
      { artist: r!.artist, album: r!.album },
    ]);
    toast('Добавлено в вонтлист');
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
              <Button variant="fill" onClick={buySafe}>
                Купить — безопасная сделка
              </Button>
            )}
            {isExchange(r.type) && (
              <Button
                onClick={() =>
                  message(`Здравствуйте! Интересует обмен на «${subject}».`)
                }
              >
                Предложить обмен
              </Button>
            )}
            <Button
              onClick={() =>
                message(`Здравствуйте! Ещё актуально «${subject}»?`)
              }
            >
              Написать продавцу
            </Button>
            <button className={styles.wishBtn} onClick={wish}>
              ♡ В вонтлист
            </button>
          </div>

          <button
            className={styles.seller}
            onClick={() => {
              onClose();
              navigate(`/seller/${seller}`);
            }}
          >
            <Avatar name={seller} size={42} />
            <div>
              <div className={styles.sellerName}>{seller}</div>
              <div className={styles.sellerMeta}>
                {rating.count ? (
                  <span className={styles.sellerRating}>
                    <RatingStars value={rating.avg} size={12} /> {rating.avg}
                  </span>
                ) : (
                  'Продавец'
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
}
