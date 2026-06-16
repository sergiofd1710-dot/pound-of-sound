import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from './Toast';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type Tab = 'login' | 'register';

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const toast = useToast();

  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  function reset() {
    setError('');
    setSuccess('');
  }

  function switchTab(next: Tab) {
    setTab(next);
    reset();
  }

  async function handleLogin() {
    reset();
    if (!email.trim() || !password) {
      setError('Заполните все поля');
      return;
    }
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      toast('Добро пожаловать!');
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister() {
    reset();
    if (!username.trim() || !email.trim() || !password) {
      setError('Заполните все поля');
      return;
    }
    if (password.length < 6) {
      setError('Пароль — минимум 6 символов');
      return;
    }
    setBusy(true);
    try {
      await signUp(username.trim(), email.trim(), password);
      setSuccess('Аккаунт создан! Теперь войдите.');
      setTab('login');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Аккаунт">
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'login' ? styles.active : ''}`}
          onClick={() => switchTab('login')}
        >
          Вход
        </button>
        <button
          className={`${styles.tab} ${tab === 'register' ? styles.active : ''}`}
          onClick={() => switchTab('register')}
        >
          Регистрация
        </button>
      </div>

      {error && <div className="form-msg form-msg-error">{error}</div>}
      {success && <div className="form-msg form-msg-success">{success}</div>}

      {tab === 'register' && (
        <div className="form-group">
          <label className="form-label">Имя пользователя</label>
          <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="vinyl_collector"
          />
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Пароль</label>
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={tab === 'register' ? 'Минимум 6 символов' : '••••••••'}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              tab === 'login' ? void handleLogin() : void handleRegister();
            }
          }}
        />
      </div>

      <Button
        variant="fill"
        disabled={busy}
        style={{ width: '100%', padding: '13px' }}
        onClick={() => (tab === 'login' ? handleLogin() : handleRegister())}
      >
        {busy
          ? 'Подождите…'
          : tab === 'login'
            ? 'Войти'
            : 'Зарегистрироваться'}
      </Button>
    </Modal>
  );
}
