import { useEffect, useState } from 'react';
import { useDemo, useActor } from '../hooks/useDemo';
import { sendMessage } from '../lib/demoStore';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import styles from './ChatsPage.module.css';

export function ChatsPage() {
  const { conversations, messages } = useDemo();
  const actor = useActor();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [text, setText] = useState('');

  const myConversations = conversations.filter(
    (c) => c.buyer === actor || c.seller === actor,
  );

  // Авто-выбор первого диалога.
  useEffect(() => {
    if (!activeId && myConversations.length) {
      setActiveId(myConversations[0].id);
    }
  }, [activeId, myConversations]);

  if (!actor) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>Войдите, чтобы видеть переписку.</div>
      </div>
    );
  }

  const active = myConversations.find((c) => c.id === activeId);
  const thread = messages
    .filter((m) => m.conversationId === activeId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  function send() {
    if (!text.trim() || !active) return;
    sendMessage(active.id, actor!, text.trim());
    setText('');
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Сообщения</h1>

      {myConversations.length === 0 ? (
        <div className={styles.empty}>
          Диалогов пока нет. Напишите продавцу со страницы объявления.
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            {myConversations.map((c) => {
              const other = c.buyer === actor ? c.seller : c.buyer;
              return (
                <button
                  key={c.id}
                  className={`${styles.convItem} ${
                    c.id === activeId ? styles.convActive : ''
                  }`}
                  onClick={() => setActiveId(c.id)}
                >
                  <Avatar name={other} size={38} />
                  <div className={styles.convText}>
                    <div className={styles.convName}>{other}</div>
                    <div className={styles.convSubject}>{c.subject}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className={styles.chat}>
            {active ? (
              <>
                <div className={styles.chatHead}>
                  {active.buyer === actor ? active.seller : active.buyer}
                  <span className={styles.chatSubject}>· {active.subject}</span>
                </div>
                <div className={styles.messages}>
                  {thread.map((m) => (
                    <div
                      key={m.id}
                      className={`${styles.msg} ${
                        m.from === actor ? styles.mine : styles.theirs
                      }`}
                    >
                      {m.body}
                    </div>
                  ))}
                </div>
                <div className={styles.composer}>
                  <input
                    className="form-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                    placeholder="Сообщение…"
                  />
                  <Button variant="fill" onClick={send}>
                    Отправить
                  </Button>
                </div>
              </>
            ) : (
              <div className={styles.empty}>Выберите диалог</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
