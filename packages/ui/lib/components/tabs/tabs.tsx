import { clsx } from 'clsx';
import type { HTMLAttributes, JSX } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import type { ComponentPosition, ComponentSize } from '../types';

type TabsProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'bordered' | 'lift' | 'boxed';
  size?: ComponentSize;
  position?: Extract<ComponentPosition, 'top' | 'bottom'>;
};

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ children, className, variant, size, position }, ref): JSX.Element => {
    const classes = twMerge(
      'tabs',
      className,
      clsx({
        'tabs-boxed': variant === 'boxed',
        'tabs-bordered': variant === 'bordered',
        'tabs-lift': variant === 'lift',
        'tabs-xl': size === 'xl',
        'tabs-lg': size === 'lg',
        'tabs-md': size === 'md',
        'tabs-sm': size === 'sm',
        'tabs-xs': size === 'xs',
        'tabs-top': position === 'top',
        'tabs-bottom': position === 'bottom',
      }),
    );

    return (
      <div role="tablist" className={classes} ref={ref}>
        {children}
      </div>
    );
  },
);
