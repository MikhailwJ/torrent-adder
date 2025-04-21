import { clsx } from 'clsx';
import type { HTMLAttributes, JSX } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import type { ComponentSize, ComponentVariant } from '../types';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  size?: ComponentSize;
  bordered?: boolean;
  variant?: Exclude<ComponentVariant, 'soft'> | 'border';
  imageFull?: boolean;
  side?: ComponentSize | boolean;
};

const DYNAMIC_MODIFIERS: Record<ComponentSize | 'true', string> = {
  true: 'card-side',
  xs: 'xs:card-side',
  sm: 'sm:card-side',
  md: 'md:card-side',
  lg: 'lg:card-side',
  xl: 'xl:card-side',
} as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ size, bordered = true, variant, imageFull, side, className, ...props }, ref): JSX.Element => {
    const classes = twMerge(
      'card',
      className,
      clsx({
        'card-xl': size === 'xl',
        'card-lg': size === 'lg',
        'card-md': size === 'md',
        'card-sm': size === 'sm',
        'card-xs': size === 'xs',
        'card-dash': variant === 'dash',
        'card-border': bordered || variant === 'outline' || variant == 'border',
        'image-full': imageFull,
        [(side && DYNAMIC_MODIFIERS[`${side}`]) || '']: !!side,
      }),
    );

    return <div aria-label="Card" {...props} className={classes} ref={ref} />;
  },
);
