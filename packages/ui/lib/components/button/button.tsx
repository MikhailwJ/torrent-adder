import { clsx } from 'clsx';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  HTMLAttributes,
  ImgHTMLAttributes,
  InputHTMLAttributes,
  JSX,
  LabelHTMLAttributes,
  ReactNode,
} from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { Loading } from '../loading';
import type { ComponentColor, ComponentShape, ComponentSize, ComponentVariant } from '../types';

type ITagProps = {
  a: {
    attr: AnchorHTMLAttributes<HTMLAnchorElement>;
    ele: HTMLAnchorElement;
  };
  button: {
    attr: ButtonHTMLAttributes<HTMLButtonElement>;
    ele: HTMLButtonElement;
  };
  div: {
    attr: HTMLAttributes<HTMLDivElement>;
    ele: HTMLDivElement;
  };
  img: {
    attr: ImgHTMLAttributes<HTMLImageElement>;
    ele: HTMLImageElement;
  };
  input: {
    attr: InputHTMLAttributes<HTMLInputElement>;
    ele: HTMLInputElement;
  };
  label: {
    attr: LabelHTMLAttributes<HTMLLabelElement>;
    ele: HTMLLabelElement;
  };
  span: {
    attr: HTMLAttributes<HTMLSpanElement>;
    ele: HTMLSpanElement;
  };
};

type GetTagProps<T extends ElementType> = T extends keyof ITagProps ? ITagProps[T] : ITagProps['button'];

type ButtonProps<
  T extends ElementType = 'button',
  A extends HTMLAttributes<HTMLElement> = GetTagProps<T>['attr'],
> = Omit<A, 'color' | 'size'> & {
  shape?: ComponentShape;
  size?: ComponentSize;
  color?: ComponentColor;
  variant?: ComponentVariant | 'link';
  glass?: boolean;
  wide?: boolean;
  fullWidth?: boolean;
  responsive?: boolean;
  animation?: boolean;
  loading?: boolean;
  active?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  disabled?: boolean;
  tag?: T;
};
//  https://developer.mozilla.org/en-US/docs/Glossary/Void_element
const VoidElementList: ElementType[] = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'keygen',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      shape,
      size,
      variant,
      color,
      glass,
      startIcon,
      endIcon,
      wide,
      fullWidth,
      responsive,
      animation = true,
      loading,
      active,
      disabled,

      className,
      style,
      tag = 'button',
      ...props
    },
    ref,
  ): JSX.Element => {
    const Tag = tag;
    const classes = twMerge(
      'btn',
      className,
      clsx(((startIcon && !loading) || endIcon) && 'gap-2', {
        'btn-xl': size === 'xl',
        'btn-lg': size === 'lg',
        'btn-md': size === 'md',
        'btn-sm': size === 'sm',
        'btn-xs': size === 'xs',
        'btn-circle': shape === 'circle',
        'btn-square': shape === 'square',
        'btn-soft': variant === 'soft',
        'btn-dash': variant === 'dash',
        'btn-outline': variant === 'outline',
        'btn-link': variant === 'link',
        'btn-neutral': color === 'neutral',
        'btn-primary': color === 'primary',
        'btn-secondary': color === 'secondary',
        'btn-accent': color === 'accent',
        'btn-info': color === 'info',
        'btn-success': color === 'success',
        'btn-warning': color === 'warning',
        'btn-error': color === 'error',
        'btn-ghost': color === 'ghost',
        glass: glass,
        'btn-wide': wide,
        'btn-block': fullWidth,
        'btn-xs sm:btn-sm md:btn-md lg:btn-lg': responsive,
        'no-animation': !animation,
        'btn-active': active,
        'btn-disabled': disabled,
      }),
    );
    if (VoidElementList.includes(Tag)) {
      return <Tag {...props} ref={ref} className={classes} style={style} disabled={disabled} />;
    } else {
      return (
        <Tag {...props} ref={ref} className={classes} style={style} disabled={disabled}>
          {loading && <Loading size={size} />}
          {startIcon && !loading && startIcon}
          {children}
          {endIcon && endIcon}
        </Tag>
      );
    }
  },
);
