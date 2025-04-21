import { clsx } from 'clsx';
import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import type { ComponentLayout, ComponentStatus, ComponentVariant } from '../types';

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode;
  layout?: ComponentLayout;
  status?: ComponentStatus;
  variant?: ComponentVariant;
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ children, icon, layout, status, variant, className, ...props }, ref): JSX.Element => {
    const classes = twMerge(
      'alert',
      className,
      clsx({
        'alert-vertical': layout === 'vertical',
        'alert-horizontal': layout === 'horizontal',
        'alert-info': status === 'info',
        'alert-success': status === 'success',
        'alert-warning': status === 'warning',
        'alert-error': status === 'error',
        'alert-soft': variant === 'soft',
        'alert-dash': variant === 'dash',
        'alert-outline': variant === 'outline',
      }),
    );

    return (
      <div role="alert" {...props} ref={ref} className={classes}>
        {icon}
        {children}
      </div>
    );
  },
);
