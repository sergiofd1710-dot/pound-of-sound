import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'fill';
}

export function Button({
  variant = 'outline',
  className = '',
  ...rest
}: ButtonProps) {
  const variantClass = variant === 'fill' ? styles.fill : styles.outline;
  return <button className={`${styles.btn} ${variantClass} ${className}`} {...rest} />;
}
