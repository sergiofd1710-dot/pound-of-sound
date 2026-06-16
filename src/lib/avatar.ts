// Детерминированный цвет аватара по имени пользователя.
const PALETTE = [
  '#ff6b1a',
  '#4ea1ff',
  '#39c07a',
  '#c77dff',
  '#ffb27a',
  '#ff5d8f',
  '#3ad1c8',
];

export function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return PALETTE[h % PALETTE.length];
}

export function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}
