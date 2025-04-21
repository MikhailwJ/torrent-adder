import type { JSX } from 'react';
import { forwardRef } from 'react';

import type { CollapseProps } from './collapse';
import { classesFn } from './collapse';

export type DetailsProps = Omit<CollapseProps<HTMLDetailsElement>, 'checkbox' | 'onOpen' | 'onClose' | 'onToggle'>;

export const Details = forwardRef<HTMLDetailsElement, DetailsProps>(
  ({ children, icon, open, className, ...props }, ref): JSX.Element => {
    return (
      <details {...props} ref={ref} className={classesFn({ className, icon, open })} open={open}>
        {children}
      </details>
    );
  },
);
