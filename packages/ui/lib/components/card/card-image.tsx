/* eslint-disable jsx-a11y/alt-text */
import { forwardRef } from 'react';
import type { ImgHTMLAttributes } from 'react';

export type CardImageProps = ImgHTMLAttributes<HTMLImageElement>;

export const CardImage = forwardRef<HTMLElement, CardImageProps>(({ ...props }, ref) => (
  <figure ref={ref}>
    <img {...props} />
  </figure>
));
