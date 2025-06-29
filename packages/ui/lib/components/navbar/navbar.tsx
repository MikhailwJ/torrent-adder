import { NavbarSection } from './navbar-sections';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import type { NavbarSectionProps } from './navbar-sections';
import type { HTMLAttributes, JSX } from 'react';

export type NavbarProps = HTMLAttributes<HTMLDivElement>;

export const Navbar = forwardRef<HTMLDivElement, NavbarProps>(({ children, className, ...props }, ref): JSX.Element => {
  const classes = twMerge('navbar', className);

  return (
    <div role="navigation" aria-label="Navbar" {...props} className={classes} ref={ref}>
      {children}
    </div>
  );
});

export const NavbarStart = forwardRef<HTMLDivElement, Omit<NavbarSectionProps, 'section'>>((props, ref) => (
  <NavbarSection {...props} section="start" ref={ref} />
));

export const NavbarCenter = forwardRef<HTMLDivElement, Omit<NavbarSectionProps, 'section'>>((props, ref) => (
  <NavbarSection {...props} section="center" ref={ref} />
));

export const NavbarEnd = forwardRef<HTMLDivElement, Omit<NavbarSectionProps, 'section'>>((props, ref) => (
  <NavbarSection {...props} section="end" ref={ref} />
));
