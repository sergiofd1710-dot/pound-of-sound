import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDemo, useActor } from '../hooks/useDemo';
import { addPost } from '../lib/demoStore';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import styles from './ThreadDetailPage.module.css';

export function ThreadDetailPage({
  onRequireAuth,
}: {
  onRequireAuth: () => void;
}) {
  const { id } = useParams();
  const { threads, posts } = useDemo();
  const actor = useActor();
  const toast = useToast();
  const [body, setBody] = useState('');

  const thread = threads.find((t) => t.id === id);
  if (!thread) {
    return (
      <div className={styles.page}>
        <p>Тема не найдена.</p>
        <Link to="/club" className={styles.back}>
          ← В клуб
        </Link>
      </div>
    );
  }

  const threadPosts = posts
    .filter((p) => p.threadId === thread.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  function reply() {
    if (!actor) {
      onRequireAuth();
      toast('Войдите, чтобы ответить');
      return;
    }
    if (!body.trim()) return;
    addPost(thread!.id, actor, body.trim());
    setBody('');
  }

  return (
    <div className={styles.page}>
      <Link to="/club" className={styles.back}>
        ← В клуб
      </Link>

      <div className={styles.head}>
        <span className={styles.category}>{thread.category}</span>
        <h1 className={styles.title}>{thread.title}</h1>
        <div className={styles.meta}>
          Автор {thread.author} ·{' '}
          {new Date(thread.createdAt).toLocaleDateString('ru-RU')}
        </div>
      </div>

      <div className={styles.posts}>
        {threadPosts.map((p) => (
          <div key={p.id} className={styles.post}>
            <Avatar name={p.author} size={36} />
            <div>
              <div className={styles.postHead}>
                <span className={styles.author}>{p.author}</span>
                <span className={styles.time}>
                  {new Date(p.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>
              <div className={styles.body}>{p.body}</div>
            </div>
          </div>
        ))}
        {threadPosts.length === 0 && (
          <div className={styles.empty}>Сообщений пока нет.</div>
        )}
      </div>

      <div className={styles.replyBox}>
        <textarea
          className="form-textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Ваш ответ…"
        />
        <Button variant="fill" onClick={reply}>
          Ответить
        </Button>
      </div>
    </div>
  );
}
