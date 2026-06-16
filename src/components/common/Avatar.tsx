import { avatarColor, initials } from '../../lib/avatar';

interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
}

export function Avatar({ name, color, size = 40 }: AvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color ?? avatarColor(name),
        color: '#11100e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--mono)',
        fontSize: size * 0.34,
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  );
}
