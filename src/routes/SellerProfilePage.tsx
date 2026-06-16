import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDemo, useActor } from '../hooks/useDemo';
import { useListings } from '../hooks/useListings';
import { addReview, sellerRating } from '../lib/demoStore';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { RatingStars } from '../components/common/RatingStars';
import { useToast } from '../components/common/Toast';
import { priceLabel } from '../lib/listing';
import styles from './SellerProfilePage.module.css';

export function SellerProfilePage({
  onRequireAuth,
}: {
  onRequireAuth: () => void;
}) {
  const { username = '' } = useParams();
  const state = useDemo();
  const actor = useActor();
  const { data: listings = [] } = useListings();
  const toast = useToast();

  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');

  const profile = state.profiles.find((p) => p.username === username);
  const { avg, count } = sellerRating(state, username);
  const sellerListings = listings.filter(
    (l) => l.profiles?.username === username,
  );
  const sellerAuctions = state.auctions.filter((a) => a.seller === username);
  const reviews = state.reviews.filter((r) => r.seller === username);

  function submitReview() {
    if (!actor) {
      onRequireAuth();
      toast('Войдите, чтобы оставить отзыв');
      return;
    }
    if (actor === username) {
      toast('Нельзя оценивать самого себя');
      return;
    }
    if (!body.trim()) {
      toast('Напишите пару слов в отзыве');
      return;
    }
    addReview(username, actor, rating, body.trim());
    setBody('');
    setRating(5);
    toast('Спасибо за отзыв!');
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Avatar name={username} color={profile?.avatarColor} size={72} />
        <div className={styles.headInfo}>
          <h1 className={styles.name}>{username}</h1>
          {profile?.city && <div className={styles.city}>📍 {profile.city}</div>}
          <div className={styles.rating}>
            <RatingStars value={avg} size={18} />
            <span className={styles.ratingNum}>
              {count ? `${avg} · ${count} отзывов` : 'Нет отзывов'}
            </span>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Объявления ({sellerListings.length})
        </h2>
        {sellerListings.length === 0 ? (
          <div className={styles.empty}>Нет активных объявлений.</div>
        ) : (
          <div className={styles.cards}>
            {sellerListings.map((l) => (
              <div key={l.id} className={styles.miniCard}>
                <div className={styles.miniTitle}>{l.artist}</div>
                <div className={styles.miniSub}>{l.album}</div>
                <div className={styles.miniPrice}>{priceLabel(l.price)}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {sellerAuctions.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Лоты на торгах ({sellerAuctions.length})
          </h2>
          <div className={styles.cards}>
            {sellerAuctions.map((a) => (
              <Link
                key={a.id}
                to={`/auctions/${a.id}`}
                className={styles.miniCard}
              >
                <div className={styles.miniTitle}>{a.artist}</div>
                <div className={styles.miniSub}>{a.album}</div>
                <div className={styles.miniPrice}>
                  {a.currentPrice.toLocaleString('ru-RU')} ₽
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Отзывы ({reviews.length})</h2>

        {actor !== username && (
          <div className={styles.reviewForm}>
            <div className={styles.reviewFormHead}>
              <span>Ваша оценка:</span>
              <RatingStars value={rating} size={22} onSelect={setRating} />
            </div>
            <textarea
              className="form-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Поделитесь впечатлением о сделке…"
            />
            <Button variant="fill" onClick={submitReview}>
              Оставить отзыв
            </Button>
          </div>
        )}

        <div className={styles.reviews}>
          {reviews.length === 0 ? (
            <div className={styles.empty}>Отзывов пока нет.</div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className={styles.review}>
                <Avatar name={r.reviewer} size={36} />
                <div>
                  <div className={styles.reviewHead}>
                    <span className={styles.reviewer}>{r.reviewer}</span>
                    <RatingStars value={r.rating} size={13} />
                  </div>
                  <div className={styles.reviewBody}>{r.body}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
