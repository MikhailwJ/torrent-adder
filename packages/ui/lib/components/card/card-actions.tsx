import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import type { HTMLAttributes } from 'react';

export type CardActionsProps = HTMLAttributes<HTMLDivElement>;

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(({ className, ...props }, ref) => (
  <div {...props} className={twMerge('card-actions', className)} ref={ref} />
));
