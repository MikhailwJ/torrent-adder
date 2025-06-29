import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import type { HTMLAttributes, JSX } from 'react';

export type CollapseTitleProps<T extends HTMLElement = HTMLDivElement> = HTMLAttributes<T>;

const classesFn = ({ className }: Pick<CollapseTitleProps, 'className'>) => twMerge('collapse-title', className);

export const CollapseTitle = ({ children, className, ...props }: CollapseTitleProps): JSX.Element => (
  <div {...props} className={classesFn({ className })}>
    {children}
  </div>
);

export type SummaryProps = CollapseTitleProps<HTMLElement>;
export const Summary = forwardRef<HTMLElement, SummaryProps>(
  ({ children, className }, ref): JSX.Element => (
    <summary ref={ref} className={classesFn({ className })}>
      {children}
    </summary>
  ),
);
