import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDemo, useActor } from '../hooks/useDemo';
import { placeBid } from '../lib/demoStore';
import { Countdown } from '../components/common/Countdown';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import styles from './AuctionDetailPage.module.css';

export function AuctionDetailPage({
  onRequireAuth,
}: {
  onRequireAuth: () => void;
}) {
  const { id } = useParams();
  const state = useDemo();
  const actor = useActor();
  const toast = useToast();
  const [amount, setAmount] = useState('');

  const auction = state.auctions.find((a) => a.id === id);
  if (!auction) {
    return (
      <div className={styles.page}>
        <p>Лот не найден.</p>
        <Link to="/auctions" className={styles.back}>
          ← К торгам
        </Link>
      </div>
    );
  }

  const ended = new Date(auction.endsAt).getTime() <= Date.now();
  const minBid = auction.currentPrice + auction.minIncrement;
  const bids = state.bids
    .filter((b) => b.auctionId === auction.id)
    .sort((a, b) => b.amount - a.amount);

  function submitBid() {
    if (!actor) {
      onRequireAuth();
      toast('Войдите, чтобы делать ставки');
      return;
    }
    const value = parseInt(amount, 10);
    if (Number.isNaN(value) || value < minBid) {
      toast(`Минимальная ставка — ${minBid.toLocaleString('ru-RU')} ₽`);
      return;
    }
    placeBid(auction!.id, actor, value);
    setAmount('');
    toast('Ставка принята!');
  }

  return (
    <div className={styles.page}>
      <Link to="/auctions" className={styles.back}>
        ← К торгам
      </Link>

      <div className={styles.grid}>
        <div>
          <div className={styles.visual} style={{ background: auction.color }}>
            <div className={styles.disc} />
          </div>
          <table className={styles.specs}>
            <tbody>
              {[
                ['Жанр', auction.genre],
                ['Лейбл', auction.label],
                ['Год', auction.year],
                ['Состояние', auction.condition],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td className={styles.specKey}>{k}</td>
                  <td className={styles.specVal}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className={styles.genre}>{auction.genre}</div>
          <h1 className={styles.artist}>{auction.artist}</h1>
          <div className={styles.album}>{auction.album}</div>

          <div className={styles.bidBox}>
            <div className={styles.bidRow}>
              <div>
                <div className={styles.smallLabel}>Текущая ставка</div>
                <div className={styles.price}>
                  {auction.currentPrice.toLocaleString('ru-RU')} ₽
                </div>
              </div>
              <div className={styles.timerCol}>
                <div className={styles.smallLabel}>До конца</div>
                <Countdown endsAt={auction.endsAt} />
              </div>
            </div>

            {ended ? (
              <div className={styles.endedNote}>Торги завершены</div>
            ) : (
              <div className={styles.bidForm}>
                <input
                  className="form-input"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`${minBid.toLocaleString('ru-RU')} ₽ или больше`}
                />
                <Button variant="fill" onClick={submitBid}>
                  Сделать ставку
                </Button>
              </div>
            )}
          </div>

          <p className={styles.desc}>{auction.description}</p>

          <div className={styles.sellerRow}>
            <Avatar name={auction.seller} size={36} />
            <div>
              <Link to={`/seller/${auction.seller}`} className={styles.sellerName}>
                {auction.seller}
              </Link>
              <div className={styles.sellerMeta}>Продавец лота</div>
            </div>
          </div>

          <div className={styles.history}>
            <div className={styles.historyTitle}>
              История ставок ({bids.length})
            </div>
            {bids.length === 0 ? (
              <div className={styles.noBids}>Ставок пока нет — будьте первым.</div>
            ) : (
              bids.map((b) => (
                <div key={b.id} className={styles.bid}>
                  <div className={styles.bidUser}>
                    <Avatar name={b.bidder} size={26} />
                    <span>{b.bidder}</span>
                  </div>
                  <span className={styles.bidAmount}>
                    {b.amount.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
