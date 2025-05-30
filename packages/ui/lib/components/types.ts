import type {
  componentColors,
  componentLayouts,
  componentPositions,
  componentSizes,
  componentShapes,
  componentStatuses,
  componentVariants,
  bgColors,
  brandColors,
} from './constants';

export type ComponentColor = (typeof componentColors)[number];

export type ComponentPosition = (typeof componentPositions)[number];
export type ComponentShape = (typeof componentShapes)[number];
export type ComponentSize = (typeof componentSizes)[number];
export type ComponentStatus = (typeof componentStatuses)[number];
export type ComponentVariant = (typeof componentVariants)[number];
export type ComponentLayout = (typeof componentLayouts)[number];
export type ComponentBrandColors = (typeof brandColors)[number];
export type ComponentBgColors = (typeof bgColors)[number];

export type ListOrItem<T> = T[] | T | Array<T | T[]>;
