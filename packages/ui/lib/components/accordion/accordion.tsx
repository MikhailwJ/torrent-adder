import { clsx } from 'clsx';
import type { HTMLAttributes, JSX } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export type AccordionProps = Omit<HTMLAttributes<HTMLInputElement>, 'type'> & {
  name?: string;
  icon?: 'arrow' | 'plus';
};

export const Accordion = forwardRef<HTMLInputElement, AccordionProps>(
  ({ name = 'accordion', icon, className, children, ...props }, ref): JSX.Element => {
    const classes = twMerge(
      'collapse',
      clsx({
        'collapse-arrow': icon === 'arrow',
        'collapse-plus': icon === 'plus',
      }),
      className,
    );

    return (
      <div className={classes}>
        <input {...props} ref={ref} type="radio" name={name} />
        {children}
      </div>
    );
  },
);
