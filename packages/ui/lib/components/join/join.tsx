import { clsx } from 'clsx';
import type { HTMLAttributes, JSX } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export type JoinProps = HTMLAttributes<HTMLDivElement> & {
  responsive?: boolean;
  vertical?: boolean;
  horizontal?: boolean;
};

export const Join = forwardRef<HTMLDivElement, JoinProps>(
  ({ className, children, responsive, vertical, horizontal, ...props }, ref): JSX.Element => {
    const classes = twMerge(
      'join',
      clsx({
        'join-vertical': !responsive && vertical,
        'join-horizontal': !responsive && horizontal,
        'join-vertical lg:join-horizontal': responsive,
      }),
      className,
    );

    return (
      <div {...props} className={classes} ref={ref}>
        {children}
      </div>
    );
  },
);
