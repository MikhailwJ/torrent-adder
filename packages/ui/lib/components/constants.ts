export const componentLayouts = ['vertical', 'horizontal'] as const;
export const componentPositions = ['top', 'bottom', 'left', 'right', 'start', 'end'] as const;
export const componentShapes = ['circle', 'square'] as const;
export const componentSizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;
export const componentStatuses = ['info', 'success', 'warning', 'error'] as const;
export const componentVariants = ['soft', 'dash', 'outline'] as const;
export const brandColors = ['neutral', 'primary', 'secondary', 'accent'] as const;
export const componentColors = [...brandColors, 'ghost', ...componentStatuses] as const;
export const bgColors = ['base-100', 'base-200', 'base-300', 'neutral'] as const;

export const defaultTheme = 'light';
