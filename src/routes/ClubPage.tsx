import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDemo, useActor } from '../hooks/useDemo';
import { createThread } from '../lib/demoStore';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import styles from './ClubPage.module.css';

export function ClubPage({ onRequireAuth }: { onRequireAuth: () => void }) {
  const { threads, posts } = useDemo();
  const actor = useActor();
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Общее');
  const [body, setBody] = useState('');

  function create() {
    if (!actor) {
      onRequireAuth();
      toast('Войдите, чтобы создать тему');
      return;
    }
    if (!title.trim()) {
      toast('Введите заголовок темы');
      return;
    }
    createThread(actor, title.trim(), category, body);
    setTitle('');
    setBody('');
    setOpen(false);
    toast('Тема создана!');
  }

  const sorted = [...threads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>Сообщество</div>
          <h1 className={styles.title}>Клуб коллекционеров</h1>
        </div>
        <Button variant="fill" onClick={() => setOpen((v) => !v)}>
          + Новая тема
        </Button>
      </div>

      {open && (
        <div className={styles.composer}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Заголовок</label>
              <input
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="О чём хотите поговорить?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Категория</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {['Общее', 'Джаз', 'Рок', 'Электроника', 'Советы', 'Уход'].map(
                  (c) => (
                    <option key={c}>{c}</option>
                  ),
                )}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Первое сообщение</label>
            <textarea
              className="form-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Расскажите подробнее…"
            />
          </div>
          <Button variant="fill" onClick={create}>
            Опубликовать
          </Button>
        </div>
      )}

      <div className={styles.list}>
        {sorted.map((t) => {
          const count = posts.filter((p) => p.threadId === t.id).length;
          return (
            <Link key={t.id} to={`/club/${t.id}`} className={styles.thread}>
              <Avatar name={t.author} size={40} />
              <div className={styles.threadMain}>
                <div className={styles.threadTitle}>{t.title}</div>
                <div className={styles.threadMeta}>
                  {t.author} · {new Date(t.createdAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <div className={styles.threadRight}>
                <span className={styles.category}>{t.category}</span>
                <span className={styles.replies}>{count} ответов</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
