// Типы и ДЕМО-логика ИИ-оценки.
//
// Сейчас оценка считается ЛОКАЛЬНО (без внешних API) — этого достаточно для
// показа проекта. Форма входа/выхода намеренно совпадает с будущей Supabase
// Edge Function `appraise`, поэтому переход на настоящий ИИ — это замена одной
// реализации в src/hooks/useAppraisal.ts, без изменения UI.

import type { Condition } from '../types/database';

export interface AppraisalInput {
  artist: string;
  album: string;
  year?: string;
  label?: string;
  condition?: Condition | string;
  notes?: string; // матричные номера, страна пресса и т.п.
}

export type Verdict = 'sell' | 'hold' | 'auction';

export interface AppraisalResult {
  price_range: { min: number; max: number; currency: 'RUB' };
  rarity_score: number; // 1–10
  price_factors: string[];
  verdict: Verdict;
  advice: string;
  demo: true; // пометка, что это демо-оценка, а не реальный ИИ
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  sell: 'Продавать',
  hold: 'Держать',
  auction: 'На аукцион',
};

const CONDITION_MULT: Record<string, number> = {
  M: 1.0,
  NM: 0.85,
  'VG+': 0.62,
  VG: 0.42,
  'G+': 0.26,
};

// Детерминированный хеш строки → число 0..1 (чтобы оценка была стабильной
// для одинакового ввода, но «разной» для разных пластинок).
function hash01(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

// Локальный демо-оценщик. Имитирует поведение модели: выдаёт рыночную вилку,
// редкость, факторы цены и вердикт на основе введённых данных.
export function demoAppraise(input: AppraisalInput): AppraisalResult {
  const seed = hash01(`${input.artist}|${input.album}|${input.year ?? ''}`);
  const condition = String(input.condition ?? 'VG+');
  const condMult = CONDITION_MULT[condition] ?? 0.5;

  const year = parseInt(input.year ?? '', 10);
  const hasYear = !Number.isNaN(year);

  // Возрастной фактор: чем старше пресс — тем выше базовая редкость.
  let ageScore = 4;
  if (hasYear) {
    if (year < 1965) ageScore = 9;
    else if (year < 1975) ageScore = 7.5;
    else if (year < 1985) ageScore = 6;
    else if (year < 1995) ageScore = 4.5;
    else ageScore = 3;
  }

  const rarityRaw = ageScore * 0.7 + seed * 4 + (condMult - 0.5) * 2;
  const rarity = Math.min(10, Math.max(1, Math.round(rarityRaw)));

  const base = (1100 + rarity * 850) * condMult * (0.85 + seed * 0.5);
  const min = roundTo(base * 0.82, 100);
  const max = roundTo(base * 1.28, 100);

  // Факторы цены
  const factors: string[] = [];
  if (hasYear && year < 1975) {
    factors.push(`Ранний пресс ${year} г. — повышает ценность`);
  } else if (hasYear) {
    factors.push(`Год выпуска: ${year}`);
  }
  if (input.label) {
    factors.push(`Лейбл ${input.label} — влияет на спрос у коллекционеров`);
  }
  factors.push(
    condMult >= 0.85
      ? `Состояние ${condition} — близко к идеальному, премия к цене`
      : condMult >= 0.6
        ? `Состояние ${condition} — хорошее, цена средняя по рынку`
        : `Состояние ${condition} — заметный износ снижает цену`,
  );
  if (rarity >= 8) factors.push('Высокая редкость — интересно для аукциона');
  if (input.notes && input.notes.trim()) {
    factors.push('Учтены детали пресса из примечаний');
  }

  // Вердикт
  let verdict: Verdict;
  let advice: string;
  if (rarity >= 8) {
    verdict = 'auction';
    advice =
      'Редкая позиция с потенциалом перебить ставки. Выгоднее выставить на аукцион, чем продавать по фиксированной цене.';
  } else if (condMult >= 0.6 && rarity >= 4) {
    verdict = 'sell';
    advice =
      'Хорошее сочетание состояния и спроса. Можно смело выставлять по фиксированной цене ближе к верхней границе вилки.';
  } else {
    verdict = 'hold';
    advice =
      'Рынок по этой позиции спокойный. Если не горит — имеет смысл подождать или улучшить лот качественными фото и описанием.';
  }

  return {
    price_range: { min, max, currency: 'RUB' },
    rarity_score: rarity,
    price_factors: factors,
    verdict,
    advice,
    demo: true,
  };
}
