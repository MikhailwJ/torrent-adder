import type { ElementType, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export type CardTitleProps = HTMLAttributes<HTMLDivElement> & {
  tag?: ElementType;
};

export const CardTitle = forwardRef<HTMLElement, CardTitleProps>(({ className, tag = 'div', ...props }, ref) => {
  const Tag = tag;

  return <Tag {...props} className={twMerge('card-title', className)} ref={ref} />;
});
