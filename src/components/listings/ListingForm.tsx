import { useRef, useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';
import { useCreateListing } from '../../hooks/useListings';
import { useAuth } from '../../contexts/AuthContext';
import { demoAppraise } from '../../lib/appraisal';
import type { Condition, ListingType } from '../../types/database';
import styles from './ListingForm.module.css';

interface ListingFormProps {
  open: boolean;
  onClose: () => void;
}

const GENRES = ['Джаз', 'Рок', 'Классика', 'Электроника', 'Поп', 'Другое'];
const CONDITIONS: Condition[] = ['M', 'NM', 'VG+', 'VG', 'G+'];

const TYPES: { value: ListingType; label: string }[] = [
  { value: 'sell', label: 'Продажа' },
  { value: 'exchange', label: 'Обмен' },
  { value: 'both', label: 'Оба' },
];

export function ListingForm({ open, onClose }: ListingFormProps) {
  const { user } = useAuth();
  const toast = useToast();
  const createListing = useCreateListing();
  const fileRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<ListingType>('sell');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [year, setYear] = useState('');
  const [label, setLabel] = useState('');
  const [genre, setGenre] = useState(GENRES[0]);
  const [condition, setCondition] = useState<Condition>('M');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function resetForm() {
    setType('sell');
    setArtist('');
    setAlbum('');
    setYear('');
    setLabel('');
    setGenre(GENRES[0]);
    setCondition('M');
    setPrice('');
    setDescription('');
    setPhoto(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  function onPhotoChange(file: File | undefined) {
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  // Демо-подсказка цены: берёт середину рыночной вилки от оценщика.
  function suggestPrice() {
    if (!artist.trim() || !album.trim()) {
      toast('Сначала укажите исполнителя и альбом');
      return;
    }
    const { price_range } = demoAppraise({
      artist: artist.trim(),
      album: album.trim(),
      year: year.trim() || undefined,
      label: label.trim() || undefined,
      condition,
    });
    const mid = Math.round((price_range.min + price_range.max) / 2 / 100) * 100;
    setPrice(String(mid));
    toast(
      `Рекомендуемая цена: ${price_range.min.toLocaleString('ru-RU')}–${price_range.max.toLocaleString('ru-RU')} ₽`,
    );
  }

  async function submit() {
    if (!user) {
      toast('Необходима авторизация');
      return;
    }
    if (!artist.trim() || !album.trim()) {
      toast('Укажите исполнителя и альбом');
      return;
    }

    try {
      await createListing.mutateAsync({
        userId: user.id,
        photo,
        listing: {
          user_id: user.id,
          artist: artist.trim(),
          album: album.trim(),
          year: year.trim() || null,
          label: label.trim() || null,
          genre,
          condition,
          price: type !== 'exchange' ? parseInt(price) || 0 : 0,
          type,
          description: description.trim() || null,
        },
      });
      toast('Объявление опубликовано!');
      resetForm();
      onClose();
    } catch (e) {
      toast((e as Error).message);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Новое объявление" width={560}>
      <div className="form-group">
        <label className="form-label">Тип объявления</label>
        <div className={styles.typeToggle}>
          {TYPES.map((t) => (
            <button
              key={t.value}
              className={`${styles.typeBtn} ${type === t.value ? styles.typeActive : ''}`}
              onClick={() => setType(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Исполнитель</label>
          <input
            className="form-input"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Miles Davis"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Альбом</label>
          <input
            className="form-input"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            placeholder="Kind of Blue"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Год выпуска</label>
          <input
            className="form-input"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="1959"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Лейбл</label>
          <input
            className="form-input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Columbia"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Жанр</label>
          <select
            className="form-select"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            {GENRES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Состояние</label>
          <select
            className="form-select"
            value={condition}
            onChange={(e) => setCondition(e.target.value as Condition)}
          >
            {CONDITIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {type !== 'exchange' && (
        <div className="form-group">
          <label className={`form-label ${styles.priceLabel}`}>
            <span>Цена (₽)</span>
            <button
              type="button"
              className={styles.suggest}
              onClick={suggestPrice}
            >
              ◎ Подсказать цену
            </button>
          </label>
          <input
            className="form-input"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="3500"
          />
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Описание</label>
        <textarea
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Оригинальный пресс, куплен в Японии…"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Фото пластинки</label>
        <div
          className={styles.uploadZone}
          onClick={() => fileRef.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="превью" className={styles.preview} />
          ) : (
            <div className={styles.uploadPlaceholder}>
              <div className={styles.uploadIcon}>◎</div>
              <div>Нажмите, чтобы выбрать фото</div>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onPhotoChange(e.target.files?.[0])}
        />
      </div>

      <Button
        variant="fill"
        disabled={createListing.isPending}
        style={{ width: '100%', padding: '14px' }}
        onClick={submit}
      >
        {createListing.isPending ? 'Публикация…' : 'Опубликовать объявление'}
      </Button>
    </Modal>
  );
}
