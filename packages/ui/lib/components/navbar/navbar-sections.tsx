import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { NavbarProps } from './navbar';
import type { JSX } from 'react';
import { forwardRef } from 'react';

export type NavbarSectionProps = NavbarProps & {
  section: 'start' | 'center' | 'end';
};

export const NavbarSection = forwardRef<HTMLDivElement, NavbarSectionProps>(
  ({ children, section, className, style }, ref): JSX.Element => {
    const classes = twMerge(
      className,
      clsx({
        'navbar-start': section === 'start',
        'navbar-center': section === 'center',
        'navbar-end': section === 'end',
      }),
    );

    return (
      <div className={classes} style={style} ref={ref}>
        {children}
      </div>
    );
  },
);
