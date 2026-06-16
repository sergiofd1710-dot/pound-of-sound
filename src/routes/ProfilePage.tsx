import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDemo, useActor } from '../hooks/useDemo';
import { useListings } from '../hooks/useListings';
import { upsertProfile } from '../lib/demoStore';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { DealStepper } from '../components/escrow/DealStepper';
import { useToast } from '../components/common/Toast';
import { priceLabel } from '../lib/listing';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const { user } = useAuth();
  const actor = useActor();
  const state = useDemo();
  const { data: listings = [] } = useListings();
  const toast = useToast();

  const profile = state.profiles.find((p) => p.username === actor);
  const [city, setCity] = useState(profile?.city ?? '');
  const [editing, setEditing] = useState(false);

  if (!user || !actor) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>Войдите, чтобы открыть профиль.</div>
      </div>
    );
  }

  const myListings = listings.filter((l) => l.user_id === user.id);
  const myAuctions = state.auctions.filter((a) => a.seller === actor);
  const myDeals = state.deals.filter(
    (d) => d.buyer === actor || d.seller === actor,
  );

  function saveCity() {
    upsertProfile(actor!, city.trim());
    setEditing(false);
    toast('Профиль обновлён');
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Avatar name={actor} color={profile?.avatarColor} size={72} />
        <div className={styles.headInfo}>
          <h1 className={styles.name}>{actor}</h1>
          <div className={styles.email}>{user.email}</div>
          {editing ? (
            <div className={styles.cityEdit}>
              <input
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Город"
              />
              <Button variant="fill" onClick={saveCity}>
                Сохранить
              </Button>
            </div>
          ) : (
            <button
              className={styles.cityBtn}
              onClick={() => setEditing(true)}
            >
              📍 {profile?.city || 'Указать город'}
            </button>
          )}
        </div>
        <Link to="/wishlist" className={styles.wishLink}>
          Мой вонтлист →
        </Link>
      </div>

      <Section title={`Мои объявления (${myListings.length})`}>
        {myListings.length === 0 ? (
          <Empty text="Вы пока ничего не продаёте." />
        ) : (
          <div className={styles.cards}>
            {myListings.map((l) => (
              <div key={l.id} className={styles.miniCard}>
                <div className={styles.miniTitle}>{l.artist}</div>
                <div className={styles.miniSub}>{l.album}</div>
                <div className={styles.miniPrice}>{priceLabel(l.price)}</div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title={`Мои лоты на торгах (${myAuctions.length})`}>
        {myAuctions.length === 0 ? (
          <Empty text="У вас нет активных лотов." />
        ) : (
          <div className={styles.cards}>
            {myAuctions.map((a) => (
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
        )}
      </Section>

      <Section title={`Безопасные сделки (${myDeals.length})`}>
        {myDeals.length === 0 ? (
          <Empty text="Сделок пока нет. Оформите покупку через безопасную сделку." />
        ) : (
          <div className={styles.deals}>
            {myDeals.map((d) => (
              <DealStepper key={d.id} deal={d} actor={actor} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <div className={styles.empty}>{text}</div>;
}
