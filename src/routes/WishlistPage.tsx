import { useState } from 'react';
import { useDemo, useActor } from '../hooks/useDemo';
import { useListings } from '../hooks/useListings';
import { addWishlist, removeWishlist } from '../lib/demoStore';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import styles from './WishlistPage.module.css';

export function WishlistPage({ onRequireAuth }: { onRequireAuth: () => void }) {
  const { wishlist, auctions } = useDemo();
  const { data: listings = [] } = useListings();
  const actor = useActor();
  const toast = useToast();

  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');

  const myItems = wishlist.filter((w) => w.owner === actor);

  // Что сейчас есть на площадке — для проверки совпадений.
  const pool = [
    ...listings.map((l) => ({ artist: l.artist, album: l.album })),
    ...auctions.map((a) => ({ artist: a.artist, album: a.album })),
  ];

  function add() {
    if (!actor) {
      onRequireAuth();
      toast('Войдите, чтобы вести вонтлист');
      return;
    }
    if (!artist.trim()) {
      toast('Укажите хотя бы исполнителя');
      return;
    }
    addWishlist(actor, artist.trim(), album.trim() || null, pool);
    setArtist('');
    setAlbum('');
    toast('Добавлено в вонтлист');
  }

  function isAvailable(wArtist: string, wAlbum: string | null) {
    const a = wArtist.toLowerCase();
    return pool.some((p) => {
      const okArtist = p.artist.toLowerCase().includes(a);
      const okAlbum = wAlbum
        ? p.album.toLowerCase().includes(wAlbum.toLowerCase())
        : true;
      return okArtist && okAlbum;
    });
  }

  return (
    <div className={styles.page}>
      <div className={styles.eyebrow}>Вонтлист</div>
      <h1 className={styles.title}>Список желаемого</h1>
      <p className={styles.lead}>
        Добавьте пластинку — получите 🔔, когда она появится в продаже или на
        торгах.
      </p>

      <div className={styles.addRow}>
        <input
          className="form-input"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Исполнитель"
        />
        <input
          className="form-input"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          placeholder="Альбом (необязательно)"
        />
        <Button variant="fill" onClick={add}>
          Добавить
        </Button>
      </div>

      <div className={styles.list}>
        {myItems.length === 0 ? (
          <div className={styles.empty}>Вонтлист пуст.</div>
        ) : (
          myItems.map((w) => {
            const available = isAvailable(w.artist, w.album);
            return (
              <div key={w.id} className={styles.item}>
                <div>
                  <div className={styles.itemTitle}>
                    {w.artist}
                    {w.album ? ` — ${w.album}` : ''}
                  </div>
                  <div
                    className={`${styles.status} ${
                      available ? styles.available : ''
                    }`}
                  >
                    {available ? '🔔 Уже есть на площадке' : 'Ждём появления'}
                  </div>
                </div>
                <button
                  className={styles.remove}
                  onClick={() => removeWishlist(w.id)}
                >
                  Удалить
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
