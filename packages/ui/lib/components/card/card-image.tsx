/* eslint-disable jsx-a11y/alt-text */
import type { ImgHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type CardImageProps = ImgHTMLAttributes<HTMLImageElement>;

export const CardImage = forwardRef<HTMLElement, CardImageProps>(({ ...props }, ref) => {
  return (
    <figure ref={ref}>
      <img {...props} />
    </figure>
  );
});
