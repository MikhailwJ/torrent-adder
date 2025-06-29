import { twMerge } from 'tailwind-merge';
import type { HTMLAttributes, JSX } from 'react';

export type CollapseContentProps = HTMLAttributes<HTMLDivElement>;

export const CollapseContent = ({ children, className, ...props }: CollapseContentProps): JSX.Element => {
  const classes = twMerge('collapse-content', className);

  return (
    <div {...props} className={classes}>
      {children}
    </div>
  );
};
