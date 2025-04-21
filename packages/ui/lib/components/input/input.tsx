import type { InputHTMLAttributes, JSX } from 'react';
import { forwardRef, useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import type { ComponentColor, ComponentSize } from '../types';
import { inputClasses } from './utils';
import { LabelContext } from '../form/label';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'> & {
  size?: ComponentSize;
  color?: ComponentColor;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ value, placeholder, size, color, className, type, ...props }, ref): JSX.Element => {
    const { useInputClasses } = useContext(LabelContext);

    const classes = twMerge(useInputClasses && ['input', inputClasses({ size, color })], className);
    return (
      <input
        {...props}
        ref={ref}
        type={type}
        value={value}
        placeholder={placeholder ?? (useInputClasses ? props.name : undefined)}
        className={classes}
      />
    );
  },
);
