import { clsx } from 'clsx';
import type { ComponentSize, ComponentColor } from '../types';

export const inputClasses = ({ size, color }: { size?: ComponentSize; color?: ComponentColor }) =>
  clsx({
    'input-xl': size === 'xl',
    'input-lg': size === 'lg',
    'input-md': size === 'md',
    'input-sm': size === 'sm',
    'input-xs': size === 'xs',
    'input-primary': color === 'primary',
    'input-secondary': color === 'secondary',
    'input-accent': color === 'accent',
    'input-ghost': color === 'ghost',
    'input-info': color === 'info',
    'input-success': color === 'success',
    'input-warning': color === 'warning',
    'input-error': color === 'error',
  });
