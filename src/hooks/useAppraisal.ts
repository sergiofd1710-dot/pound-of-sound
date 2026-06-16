import { useMutation } from '@tanstack/react-query';
import {
  demoAppraise,
  type AppraisalInput,
  type AppraisalResult,
} from '../lib/appraisal';

// Имитируем сетевую задержку, чтобы демо-оценка ощущалась как запрос к модели.
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useAppraisal() {
  return useMutation<AppraisalResult, Error, AppraisalInput>({
    mutationFn: async (input) => {
      // ── ДЕМО-режим (текущий) ───────────────────────────────────────────
      await delay(700);
      return demoAppraise(input);

      // ── Боевой режим (Фаза 2+, когда подключите Edge Function) ──────────
      // Заменить тело выше на вызов функции; UI менять не нужно:
      //
      // const { data, error } = await supabase.functions.invoke('appraise', {
      //   body: input,
      // });
      // if (error) throw new Error('Сервис оценки недоступен');
      // return data as AppraisalResult;
    },
  });
}
