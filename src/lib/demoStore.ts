// ─────────────────────────────────────────────────────────────────────────
// ЛОКАЛЬНОЕ ДЕМО-ХРАНИЛИЩЕ
//
// Все «социальные» фичи проекта (торги, клуб, чаты, профили, отзывы, вонтлист,
// эскроу) работают локально — данные лежат в localStorage, без бэкенда и API.
// Этого достаточно для показа проекта: всё кликается и сохраняется между
// перезагрузками. Когда захотите делать серьёзно — эти сущности переедут в
// таблицы Supabase (см. план/README), а UI почти не изменится.
// ─────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'pos_demo_v1';

export type AuctionStatus = 'live' | 'ended';

export interface Auction {
  id: string;
  artist: string;
  album: string;
  year: string;
  label: string;
  genre: string;
  condition: string;
  seller: string;
  startPrice: number;
  currentPrice: number;
  minIncrement: number;
  endsAt: string; // ISO
  description: string;
  color: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidder: string;
  amount: number;
  createdAt: string;
}

export interface Thread {
  id: string;
  title: string;
  category: string;
  author: string;
  createdAt: string;
}

export interface Post {
  id: string;
  threadId: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  subject: string; // о чём (исполнитель — альбом)
  buyer: string;
  seller: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  from: string;
  body: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  owner: string;
  artist: string;
  album: string | null;
  createdAt: string;
}

export interface Review {
  id: string;
  seller: string;
  reviewer: string;
  rating: number; // 1–5
  body: string;
  createdAt: string;
}

export type DealStatus =
  | 'frozen' // деньги заморожены
  | 'shipped' // продавец отправил
  | 'inspection' // проверка покупателем (48ч)
  | 'released' // перевод продавцу
  | 'cancelled';

export interface Deal {
  id: string;
  subject: string;
  buyer: string;
  seller: string;
  amount: number;
  fee: number; // комиссия 5%
  status: DealStatus;
  createdAt: string;
  history: { status: DealStatus; at: string }[];
}

export interface DemoProfile {
  username: string;
  city: string;
  avatarColor?: string;
}

export type NotificationType =
  | 'wishlist'
  | 'outbid'
  | 'message'
  | 'deal';

export interface Notification {
  id: string;
  owner: string;
  type: NotificationType;
  text: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface DemoState {
  auctions: Auction[];
  bids: Bid[];
  threads: Thread[];
  posts: Post[];
  conversations: Conversation[];
  messages: Message[];
  wishlist: WishlistItem[];
  reviews: Review[];
  deals: Deal[];
  profiles: DemoProfile[];
  notifications: Notification[];
}

const genId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const now = () => new Date().toISOString();
const hoursFromNow = (h: number) =>
  new Date(Date.now() + h * 3600_000).toISOString();

// ── Сид (засеянные демо-данные) ──────────────────────────────────────────
function seed(): DemoState {
  const auctions: Auction[] = [
    {
      id: 'a1',
      artist: 'John Coltrane',
      album: 'A Love Supreme',
      year: '1965',
      label: 'Impulse!',
      genre: 'Джаз',
      condition: 'VG+',
      seller: 'jazzcat',
      startPrice: 4000,
      currentPrice: 6500,
      minIncrement: 500,
      endsAt: hoursFromNow(9),
      description: 'Оригинальный пресс Impulse!, оранжевый лейбл. Конверт VG+.',
      color: '#1a0f0a',
    },
    {
      id: 'a2',
      artist: 'Kraftwerk',
      album: 'Trans-Europe Express',
      year: '1977',
      label: 'Kling Klang',
      genre: 'Электроника',
      condition: 'NM',
      seller: 'groove_io',
      startPrice: 3000,
      currentPrice: 4200,
      minIncrement: 300,
      endsAt: hoursFromNow(28),
      description: 'Немецкий пресс, винил близок к идеалу.',
      color: '#0f0a14',
    },
    {
      id: 'a3',
      artist: 'Pink Floyd',
      album: 'The Dark Side of the Moon',
      year: '1973',
      label: 'Harvest',
      genre: 'Рок',
      condition: 'VG',
      seller: 'vinylvera',
      startPrice: 2500,
      currentPrice: 2500,
      minIncrement: 250,
      endsAt: hoursFromNow(52),
      description: 'Первый британский пресс с постерами. Конверт с потёртостями.',
      color: '#14100a',
    },
  ];

  const bids: Bid[] = [
    {
      id: genId(),
      auctionId: 'a1',
      bidder: 'vinylvera',
      amount: 5500,
      createdAt: hoursFromNow(-3),
    },
    {
      id: genId(),
      auctionId: 'a1',
      bidder: 'groove_io',
      amount: 6500,
      createdAt: hoursFromNow(-1),
    },
    {
      id: genId(),
      auctionId: 'a2',
      bidder: 'jazzcat',
      amount: 4200,
      createdAt: hoursFromNow(-2),
    },
  ];

  const threads: Thread[] = [
    {
      id: 't1',
      title: 'Как отличить оригинальный пресс от переиздания?',
      category: 'Советы',
      author: 'jazzcat',
      createdAt: hoursFromNow(-40),
    },
    {
      id: 't2',
      title: 'Лучшие джазовые лейблы 60-х',
      category: 'Джаз',
      author: 'vinylvera',
      createdAt: hoursFromNow(-20),
    },
    {
      id: 't3',
      title: 'Чем чистить пластинки без вреда?',
      category: 'Уход',
      author: 'groove_io',
      createdAt: hoursFromNow(-8),
    },
  ];

  const posts: Post[] = [
    {
      id: genId(),
      threadId: 't1',
      author: 'jazzcat',
      body: 'Смотрите на матричные номера в выбеге и логотип лейбла — у переизданий часто другой шрифт.',
      createdAt: hoursFromNow(-39),
    },
    {
      id: genId(),
      threadId: 't1',
      author: 'vinylvera',
      body: 'Ещё помогает Discogs: там по рантовым номерам можно вычислить конкретный пресс.',
      createdAt: hoursFromNow(-38),
    },
    {
      id: genId(),
      threadId: 't2',
      author: 'groove_io',
      body: 'Impulse!, Blue Note и Prestige — три кита. Impulse! ещё и оформление шикарное.',
      createdAt: hoursFromNow(-19),
    },
  ];

  const reviews: Review[] = [
    {
      id: genId(),
      seller: 'jazzcat',
      reviewer: 'vinylvera',
      rating: 5,
      body: 'Отличная упаковка, состояние как в описании. Рекомендую!',
      createdAt: hoursFromNow(-100),
    },
    {
      id: genId(),
      seller: 'jazzcat',
      reviewer: 'groove_io',
      rating: 4,
      body: 'Всё хорошо, доставка чуть задержалась.',
      createdAt: hoursFromNow(-60),
    },
  ];

  const profiles: DemoProfile[] = [
    { username: 'jazzcat', city: 'Москва', avatarColor: '#ff6b1a' },
    { username: 'vinylvera', city: 'Санкт-Петербург', avatarColor: '#4ea1ff' },
    { username: 'groove_io', city: 'Казань', avatarColor: '#39c07a' },
  ];

  return {
    auctions,
    bids,
    threads,
    posts,
    conversations: [],
    messages: [],
    wishlist: [],
    reviews,
    deals: [],
    profiles,
    notifications: [],
  };
}

// ── Загрузка / сохранение ────────────────────────────────────────────────
function load(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DemoState;
  } catch {
    /* пусто */
  }
  const seeded = seed();
  save(seeded);
  return seeded;
}

function save(s: DemoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* localStorage недоступен — игнорируем */
  }
}

// ── Реактивность (для useSyncExternalStore) ──────────────────────────────
let state: DemoState = load();
const listeners = new Set<() => void>();

function setState(updater: (prev: DemoState) => DemoState) {
  state = updater(state);
  save(state);
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): DemoState {
  return state;
}

function notify(
  owner: string,
  type: NotificationType,
  text: string,
  link?: string,
) {
  setState((s) => ({
    ...s,
    notifications: [
      {
        id: genId(),
        owner,
        type,
        text,
        link,
        read: false,
        createdAt: now(),
      },
      ...s.notifications,
    ],
  }));
}

// ── Мутации: профили ─────────────────────────────────────────────────────
export function upsertProfile(username: string, city: string) {
  setState((s) => {
    const exists = s.profiles.some((p) => p.username === username);
    const profiles = exists
      ? s.profiles.map((p) => (p.username === username ? { ...p, city } : p))
      : [...s.profiles, { username, city }];
    return { ...s, profiles };
  });
}

// ── Мутации: торги ───────────────────────────────────────────────────────
export function placeBid(auctionId: string, bidder: string, amount: number) {
  setState((s) => {
    const auction = s.auctions.find((a) => a.id === auctionId);
    if (!auction) return s;
    return {
      ...s,
      auctions: s.auctions.map((a) =>
        a.id === auctionId ? { ...a, currentPrice: amount } : a,
      ),
      bids: [
        {
          id: genId(),
          auctionId,
          bidder,
          amount,
          createdAt: now(),
        },
        ...s.bids,
      ],
    };
  });

  // Демо-«живость»: через несколько секунд конкурент перебивает ставку.
  const auction = state.auctions.find((a) => a.id === auctionId);
  if (auction && auction.seller !== bidder) {
    setTimeout(() => {
      const a = state.auctions.find((x) => x.id === auctionId);
      if (!a || a.currentPrice !== amount) return; // уже перебили
      const rivals = ['vinylvera', 'groove_io', 'jazzcat'].filter(
        (r) => r !== bidder && r !== a.seller,
      );
      const rival = rivals[0] ?? 'collector_77';
      const counter = amount + a.minIncrement;
      setState((s) => ({
        ...s,
        auctions: s.auctions.map((x) =>
          x.id === auctionId ? { ...x, currentPrice: counter } : x,
        ),
        bids: [
          { id: genId(), auctionId, bidder: rival, amount: counter, createdAt: now() },
          ...s.bids,
        ],
      }));
      notify(
        bidder,
        'outbid',
        `Вашу ставку перебили: ${rival} предложил ${counter.toLocaleString('ru-RU')} ₽`,
        `/auctions/${auctionId}`,
      );
    }, 4500);
  }
}

// ── Мутации: клуб ────────────────────────────────────────────────────────
export function createThread(
  author: string,
  title: string,
  category: string,
  firstPost: string,
): string {
  const id = genId();
  setState((s) => ({
    ...s,
    threads: [
      { id, title, category, author, createdAt: now() },
      ...s.threads,
    ],
    posts: firstPost.trim()
      ? [
          { id: genId(), threadId: id, author, body: firstPost.trim(), createdAt: now() },
          ...s.posts,
        ]
      : s.posts,
  }));
  return id;
}

export function addPost(threadId: string, author: string, body: string) {
  setState((s) => ({
    ...s,
    posts: [
      ...s.posts,
      { id: genId(), threadId, author, body, createdAt: now() },
    ],
  }));
}

// ── Мутации: чаты ────────────────────────────────────────────────────────
export function startConversation(
  buyer: string,
  seller: string,
  subject: string,
  firstMessage: string,
): string {
  // Если диалог по этой теме уже есть — переиспользуем.
  const existing = state.conversations.find(
    (c) => c.buyer === buyer && c.seller === seller && c.subject === subject,
  );
  const id = existing?.id ?? genId();
  setState((s) => ({
    ...s,
    conversations: existing
      ? s.conversations
      : [{ id, buyer, seller, subject, createdAt: now() }, ...s.conversations],
    messages: [
      ...s.messages,
      { id: genId(), conversationId: id, from: buyer, body: firstMessage, createdAt: now() },
    ],
  }));
  scheduleAutoReply(id, seller, buyer);
  return id;
}

export function sendMessage(conversationId: string, from: string, body: string) {
  setState((s) => ({
    ...s,
    messages: [
      ...s.messages,
      { id: genId(), conversationId, from, body, createdAt: now() },
    ],
  }));
  const conv = state.conversations.find((c) => c.id === conversationId);
  if (conv) {
    const other = from === conv.buyer ? conv.seller : conv.buyer;
    scheduleAutoReply(conversationId, other, from);
  }
}

const AUTO_REPLIES = [
  'Здравствуйте! Да, пластинка ещё в наличии.',
  'Спасибо за интерес! Состояние как в описании, могу прислать доп. фото.',
  'Готов оформить безопасную сделку — так надёжнее для нас обоих.',
  'Отправлю в течение пары дней после оплаты.',
];

function scheduleAutoReply(conversationId: string, from: string, to: string) {
  // Демо-автоответ продавца/собеседника.
  setTimeout(() => {
    const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
    setState((s) => ({
      ...s,
      messages: [
        ...s.messages,
        { id: genId(), conversationId, from, body: reply, createdAt: now() },
      ],
    }));
    notify(to, 'message', `Новое сообщение от ${from}`, '/chats');
  }, 1800);
}

// ── Мутации: вонтлист ────────────────────────────────────────────────────
// matchPool — список того, что сейчас есть на площадке (объявления + лоты),
// чтобы сразу проверить совпадение и «уведомить».
export function addWishlist(
  owner: string,
  artist: string,
  album: string | null,
  matchPool: { artist: string; album: string }[],
) {
  setState((s) => ({
    ...s,
    wishlist: [
      { id: genId(), owner, artist, album, createdAt: now() },
      ...s.wishlist,
    ],
  }));

  const a = artist.trim().toLowerCase();
  const match = matchPool.find((m) => {
    const okArtist = m.artist.toLowerCase().includes(a);
    const okAlbum = album
      ? m.album.toLowerCase().includes(album.trim().toLowerCase())
      : true;
    return okArtist && okAlbum;
  });
  if (match) {
    notify(
      owner,
      'wishlist',
      `🔔 «${match.artist} — ${match.album}» уже есть на площадке!`,
      '/',
    );
  }
}

export function removeWishlist(id: string) {
  setState((s) => ({
    ...s,
    wishlist: s.wishlist.filter((w) => w.id !== id),
  }));
}

// ── Мутации: отзывы ──────────────────────────────────────────────────────
export function addReview(
  seller: string,
  reviewer: string,
  rating: number,
  body: string,
) {
  setState((s) => ({
    ...s,
    reviews: [
      { id: genId(), seller, reviewer, rating, body, createdAt: now() },
      ...s.reviews,
    ],
  }));
}

export function sellerRating(s: DemoState, seller: string) {
  const list = s.reviews.filter((r) => r.seller === seller);
  if (!list.length) return { avg: 0, count: 0 };
  const avg = list.reduce((sum, r) => sum + r.rating, 0) / list.length;
  return { avg: Math.round(avg * 10) / 10, count: list.length };
}

// ── Мутации: эскроу ──────────────────────────────────────────────────────
export const ESCROW_FEE = 0.05;

export function createDeal(
  buyer: string,
  seller: string,
  subject: string,
  amount: number,
): string {
  const id = genId();
  const fee = Math.round(amount * ESCROW_FEE);
  setState((s) => ({
    ...s,
    deals: [
      {
        id,
        subject,
        buyer,
        seller,
        amount,
        fee,
        status: 'frozen',
        createdAt: now(),
        history: [{ status: 'frozen', at: now() }],
      },
      ...s.deals,
    ],
  }));
  notify(seller, 'deal', `Новая безопасная сделка: ${subject}`, '/profile');
  return id;
}

const NEXT_STATUS: Record<DealStatus, DealStatus | null> = {
  frozen: 'shipped',
  shipped: 'inspection',
  inspection: 'released',
  released: null,
  cancelled: null,
};

export function advanceDeal(dealId: string) {
  setState((s) => ({
    ...s,
    deals: s.deals.map((d) => {
      if (d.id !== dealId) return d;
      const next = NEXT_STATUS[d.status];
      if (!next) return d;
      return {
        ...d,
        status: next,
        history: [...d.history, { status: next, at: now() }],
      };
    }),
  }));
}

export function cancelDeal(dealId: string) {
  setState((s) => ({
    ...s,
    deals: s.deals.map((d) =>
      d.id === dealId && d.status !== 'released'
        ? {
            ...d,
            status: 'cancelled',
            history: [...d.history, { status: 'cancelled', at: now() }],
          }
        : d,
    ),
  }));
}

// ── Уведомления ──────────────────────────────────────────────────────────
export function markNotificationsRead(owner: string) {
  setState((s) => ({
    ...s,
    notifications: s.notifications.map((n) =>
      n.owner === owner ? { ...n, read: true } : n,
    ),
  }));
}

// Сброс демо-данных к исходному состоянию (для презентации).
export function resetDemo() {
  setState(() => seed());
}
