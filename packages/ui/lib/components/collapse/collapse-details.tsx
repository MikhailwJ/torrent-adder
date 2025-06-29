import { classesFn } from './collapse';
import { forwardRef } from 'react';
import type { CollapseProps } from './collapse';
import type { JSX } from 'react';

export type DetailsProps = Omit<CollapseProps<HTMLDetailsElement>, 'checkbox' | 'onOpen' | 'onClose' | 'onToggle'>;

export const Details = forwardRef<HTMLDetailsElement, DetailsProps>(
  ({ children, icon, open, className, ...props }, ref): JSX.Element => (
    <details {...props} ref={ref} className={classesFn({ className, icon, open })} open={open}>
      {children}
    </details>
  ),
);
