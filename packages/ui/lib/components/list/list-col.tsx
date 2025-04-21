import type { HTMLAttributes, JSX } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = HTMLAttributes<HTMLDivElement>;

export const ListColWrap = forwardRef<HTMLDivElement, Props>(({ children, className }, ref): JSX.Element => {
  const classes = twMerge('list-col-wrap', className);

  return (
    <div className={classes} ref={ref}>
      {children}
    </div>
  );
});

export const ListColGrow = forwardRef<HTMLDivElement, Props>(({ children, className }, ref): JSX.Element => {
  const classes = twMerge('list-col-grow', className);

  return (
    <div className={classes} ref={ref}>
      {children}
    </div>
  );
});
