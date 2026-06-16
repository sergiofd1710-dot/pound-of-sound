import { useSyncExternalStore } from 'react';
import { getSnapshot, subscribe, type DemoState } from '../lib/demoStore';
import { useAuth } from '../contexts/AuthContext';

// Реактивный доступ к локальному демо-хранилищу.
export function useDemo(): DemoState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// Имя текущего пользователя как актора в демо-хранилище.
// Берём username из профиля Supabase, иначе префикс email.
export function useActor(): string | null {
  const { user, username } = useAuth();
  if (!user) return null;
  return username ?? user.email?.split('@')[0] ?? 'guest';
}
