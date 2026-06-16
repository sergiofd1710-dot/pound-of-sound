import { useState } from 'react';
import { Button } from '../components/common/Button';
import { AppraisalResult } from '../components/appraisal/AppraisalResult';
import { useAppraisal } from '../hooks/useAppraisal';
import type { Condition } from '../types/database';
import styles from './AppraisalPage.module.css';

const CONDITIONS: Condition[] = ['M', 'NM', 'VG+', 'VG', 'G+'];

export function AppraisalPage() {
  const appraisal = useAppraisal();

  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [year, setYear] = useState('');
  const [label, setLabel] = useState('');
  const [condition, setCondition] = useState<Condition>('VG+');
  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState(false);

  function submit() {
    setTouched(true);
    if (!artist.trim() || !album.trim()) return;
    appraisal.mutate({
      artist: artist.trim(),
      album: album.trim(),
      year: year.trim() || undefined,
      label: label.trim() || undefined,
      condition,
      notes: notes.trim() || undefined,
    });
  }

  const missing = touched && (!artist.trim() || !album.trim());

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <div className={styles.eyebrow}>ИИ-оценка</div>
        <h1 className={styles.title}>
          Сколько стоит
          <br />
          <em>ваша пластинка</em>
        </h1>
        <p className={styles.lead}>
          Укажите данные пластинки — оценка покажет рыночную вилку, редкость и
          совет: продавать, держать или выставить на аукцион.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.formCard}>
          {missing && (
            <div className="form-msg form-msg-error">
              Укажите исполнителя и альбом
            </div>
          )}

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

          <div className="form-group">
            <label className="form-label">Состояние (Goldmine)</label>
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

          <div className="form-group">
            <label className="form-label">
              Примечания (пресс, матрица, страна) — необязательно
            </label>
            <textarea
              className="form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Original mono, матрица 1A, Japan…"
            />
          </div>

          <Button
            variant="fill"
            disabled={appraisal.isPending}
            style={{ width: '100%', padding: '14px' }}
            onClick={submit}
          >
            {appraisal.isPending ? 'Оцениваем…' : 'Оценить пластинку'}
          </Button>
        </div>

        <div className={styles.resultCol}>
          {appraisal.data ? (
            <AppraisalResult result={appraisal.data} />
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>◎</div>
              <div>Результат оценки появится здесь</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
