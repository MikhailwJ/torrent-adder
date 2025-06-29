import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import type { HTMLAttributes } from 'react';

export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div {...props} className={twMerge('card-body', className)} ref={ref} />
));
