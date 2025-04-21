import type { FormHTMLAttributes, JSX } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export type FormProps = FormHTMLAttributes<HTMLFormElement>;

export const Form = forwardRef<HTMLFormElement, FormProps>(({ children, className, ...props }, ref): JSX.Element => {
  const classes = twMerge('form-control', className);

  return (
    <form {...props} className={classes} ref={ref}>
      {children}
    </form>
  );
});
