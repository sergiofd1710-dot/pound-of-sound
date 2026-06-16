// Типы базы данных Supabase.
//
// ВАЖНО: пока это РУЧНАЯ реконструкция схемы по запросам из прежнего прототипа
// (vinyl_market13.html). Первым шагом при наличии Supabase CLI замените её на
// автогенерацию — она даст 100% точную схему:
//
//   npx supabase gen types typescript --project-id vqtbevkgjmdxbjjilkzg > src/types/database.ts
//
// До тех пор код опирается на типы ниже. Если в реальной таблице есть колонки,
// не перечисленные здесь, дополните их (особенно у `listings`).

export type ListingType = 'sell' | 'exchange' | 'both';
export type Condition = 'M' | 'NM' | 'VG+' | 'VG' | 'G+';

export interface Profile {
  id: string;
  username: string;
  // v2.0 (бэклог): city, avatar_color — добавятся позже
}

export interface Listing {
  id: string;
  user_id: string;
  artist: string;
  album: string;
  year: string | null;
  label: string | null;
  genre: string | null;
  condition: Condition | string;
  price: number;
  type: ListingType;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

// Объявление вместе с присоединённым профилем продавца
// (результат `.select('*, profiles(username)')`).
export interface ListingWithSeller extends Listing {
  profiles: Pick<Profile, 'username'> | null;
}

// Payload для вставки нового объявления (id/created_at проставляет БД).
export type NewListing = Omit<Listing, 'id' | 'created_at'>;
