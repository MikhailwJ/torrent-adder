import type { JSX, OptionHTMLAttributes } from 'react';

export type SelectOptionProps = OptionHTMLAttributes<HTMLOptionElement>;

export const SelectOption = ({ children, ...props }: SelectOptionProps): JSX.Element => {
  return <option {...props}>{children}</option>;
};
