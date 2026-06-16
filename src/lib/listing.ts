import type { Listing, ListingType } from '../types/database';

export const RECORD_COLORS = [
  '#1a1a1a',
  '#1a0f0a',
  '#0f0a06',
  '#1a1208',
  '#120a08',
  '#1a1510',
];

export function typeLabel(type: ListingType): string {
  if (type === 'sell') return 'Продажа';
  if (type === 'exchange') return 'Обмен';
  return 'Прод/Обмен';
}

export function actionLabel(type: ListingType): string {
  if (type === 'sell') return 'Купить';
  if (type === 'exchange') return 'Обменять';
  return 'Купить/Обм.';
}

export function priceLabel(price: number): string {
  return price > 0 ? `${Number(price).toLocaleString('ru-RU')} ₽` : 'Обмен';
}

export function isSell(type: ListingType): boolean {
  return type === 'sell' || type === 'both';
}

export function isExchange(type: ListingType): boolean {
  return type === 'exchange' || type === 'both';
}

export interface ListingFilters {
  category: string; // 'all' | 'exchange' | genre
  search: string;
}

export function filterListings<T extends Listing>(
  listings: T[],
  { category, search }: ListingFilters,
): T[] {
  const q = search.trim().toLowerCase();
  return listings.filter((r) => {
    if (category === 'exchange') {
      if (r.type !== 'exchange' && r.type !== 'both') return false;
    } else if (category !== 'all' && r.genre !== category) {
      return false;
    }
    if (q) {
      return (
        r.artist.toLowerCase().includes(q) ||
        r.album.toLowerCase().includes(q) ||
        (r.label ?? '').toLowerCase().includes(q)
      );
    }
    return true;
  });
}
