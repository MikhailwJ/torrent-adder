import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import type { HTMLAttributes, JSX } from 'react';

type ListProps = HTMLAttributes<HTMLUListElement>;

export const List = forwardRef<HTMLUListElement, ListProps>(({ children, className }, ref): JSX.Element => {
  const classes = twMerge('list', className);

  return (
    <ul className={classes} ref={ref}>
      {children}
    </ul>
  );
});
