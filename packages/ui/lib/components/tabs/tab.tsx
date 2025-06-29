import { Link } from '@tanstack/react-router';
import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import type { ComponentColor } from '../types';
import type { LinkComponentProps } from '@tanstack/react-router';

export interface TabProps extends LinkComponentProps {
  color?: ComponentColor;
  bgColor?: string;
  borderColor?: string;
  active?: boolean;
  disabled?: boolean;
}

export const Tab = forwardRef<HTMLAnchorElement, TabProps>(
  ({ children, className, color, bgColor, borderColor, active, disabled, ...props }, ref) => {
    const classes = twMerge(
      'tab',
      className,
      clsx({
        [`[--tab-bg:${bgColor}]`]: bgColor,
        [`[--tab-border-color:${borderColor}]`]: borderColor,
        'text-neutral': color === 'neutral',
        'text-primary': color === 'primary',
        'text-secondary': color === 'secondary',
        'text-accent': color === 'accent',
        'text-info': color === 'info',
        'text-success': color === 'success',
        'text-warning': color === 'warning',
        'text-error': color === 'error',
        'tab-active': active,
        'tab-disabled': disabled,
      }),
    );

    return (
      <Link role="tab" {...props} ref={ref} className={classes}>
        {children}
      </Link>
    );
  },
);
