import type { HTMLAttributes, JSX } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type ListProps = HTMLAttributes<HTMLLIElement>;

export const ListRow = forwardRef<HTMLLIElement, ListProps>(({ children, className }, ref): JSX.Element => {
  const classes = twMerge('list-row', className);

  return (
    <li className={classes} ref={ref}>
      {children}
    </li>
  );
});
