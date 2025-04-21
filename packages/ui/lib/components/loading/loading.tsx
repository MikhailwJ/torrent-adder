import { clsx } from 'clsx';
import type { HTMLAttributes, JSX } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import type { ComponentColor, ComponentSize } from '../types';

export type LoadingProps = HTMLAttributes<HTMLSpanElement> & {
  size?: ComponentSize;
  color?: ComponentColor;
  variant?: 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
};

export const Loading = forwardRef<HTMLSpanElement, LoadingProps>(
  ({ size, variant = 'spinner', color, className, style, ...props }, ref): JSX.Element => {
    const classes = twMerge(
      'loading',
      className,
      clsx({
        'loading-xl': size === 'xl',
        'loading-lg': size === 'lg',
        'loading-md': size === 'md',
        'loading-sm': size === 'sm',
        'loading-xs': size === 'xs',
        'loading-spinner': variant === 'spinner',
        'loading-dots': variant === 'dots',
        'loading-ring': variant === 'ring',
        'loading-ball': variant === 'ball',
        'loading-bars': variant === 'bars',
        'loading-infinity': variant === 'infinity',
        'text-primary': color === 'primary',
        'text-secondary': color === 'secondary',
        'text-accent': color === 'accent',
        'text-info': color === 'info',
        'text-success': color === 'success',
        'text-warning': color === 'warning',
        'text-error': color === 'error',
        'text-ghost': color === 'ghost',
      }),
    );

    return <span {...props} ref={ref} className={classes} style={style} />;
  },
);
