import { clsx } from 'clsx';
import type { JSX, LabelHTMLAttributes } from 'react';
import { createContext, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import type { ComponentSize, ComponentColor } from '../types';
import { inputClasses } from '../input/utils';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> &
  (
    | {
        title: string;
        type?: 'floating-label';
        position?: 'start' | 'end';
        size?: undefined;
        color?: undefined;
      }
    | {
        title: string;
        type: 'input' | 'select';
        size?: ComponentSize;
        color?: ComponentColor;
        position?: undefined;
      }
  );

export const LabelContext = createContext<{ useInputClasses: boolean }>({ useInputClasses: true });

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    { children, title, type = 'floating-label', position = 'start', size, color, className, ...props },
    ref,
  ): JSX.Element => {
    const isFloating = type === 'floating-label';
    const classes = twMerge(!isFloating ? [type, inputClasses({ size, color })] : ['floating-label'], className);

    const Tag = () => (
      <span className={clsx({ label: type !== 'floating-label' })} ref={ref}>
        {title}
      </span>
    );

    return (
      <label {...props} className={classes}>
        {position === 'start' && <Tag />}
        <LabelContext.Provider value={{ useInputClasses: type === 'floating-label' }}>{children}</LabelContext.Provider>
        {position === 'end' && <Tag />}
      </label>
    );
  },
);
