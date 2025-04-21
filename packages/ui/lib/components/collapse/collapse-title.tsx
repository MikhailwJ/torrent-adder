import type { HTMLAttributes, JSX } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export type CollapseTitleProps<T extends HTMLElement = HTMLDivElement> = HTMLAttributes<T>;

const classesFn = ({ className }: Pick<CollapseTitleProps, 'className'>) => twMerge('collapse-title', className);

export const CollapseTitle = ({ children, className, ...props }: CollapseTitleProps): JSX.Element => {
  return (
    <div {...props} className={classesFn({ className })}>
      {children}
    </div>
  );
};

export type SummaryProps = CollapseTitleProps<HTMLElement>;
export const Summary = forwardRef<HTMLElement, SummaryProps>(({ children, className }, ref): JSX.Element => {
  return (
    <summary ref={ref} className={classesFn({ className })}>
      {children}
    </summary>
  );
});
