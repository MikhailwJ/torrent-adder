import { clsx } from 'clsx';
import type { FocusEvent, HTMLAttributes, JSX } from 'react';
import { forwardRef, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type CollapseProps<T extends HTMLElement = HTMLDivElement> = HTMLAttributes<T> & {
  checkbox?: boolean;
  icon?: 'arrow' | 'plus';
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onToggle?: () => void;
};

export const classesFn = ({ className, icon, open }: Pick<CollapseProps, 'className' | 'icon' | 'open'>) =>
  twMerge(
    'collapse',
    className,
    clsx({
      'collapse-arrow': icon === 'arrow',
      'collapse-plus': icon === 'plus',
      'collapse-open': open === true,
      'collapse-close': open === false,
    }),
  );

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
  ({ children, checkbox, icon, open, className, onOpen, onClose, onToggle, ...props }, ref): JSX.Element => {
    const [isChecked, setIsChecked] = useState(open);
    const checkboxRef = useRef<HTMLInputElement>(null);

    // Handle events for checkbox changes
    const handleCheckboxChange = () => {
      if (onToggle) {
        onToggle();
      }
      if (onOpen && checkboxRef.current?.checked) {
        onOpen();
      } else if (onClose && !checkboxRef.current?.checked) {
        onClose();
      }

      setIsChecked(checkboxRef.current?.checked);
    };

    // Handle blur events, specifically handling open/close for non checkbox types
    const handleBlur = (event: FocusEvent<HTMLDivElement, Element>) => {
      if (!checkbox && onToggle) onToggle();
      if (!checkbox && onClose) onClose();
      if (props.onBlur) props.onBlur(event);
    };

    // Handle focus events, specifically handling open/close for non checkbox types
    const handleFocus = (event: FocusEvent<HTMLDivElement, Element>) => {
      if (!checkbox && onToggle) onToggle();
      if (!checkbox && onOpen) onOpen();
      if (props.onFocus) props.onFocus(event);
    };

    return (
      <div
        aria-expanded={open}
        {...props}
        ref={ref}
        className={classesFn({ className, icon, open })}
        onBlur={handleBlur}
        onFocus={handleFocus}>
        {checkbox && (
          <input
            type="checkbox"
            tabIndex={isChecked === true ? 0 : undefined}
            className="peer"
            ref={checkboxRef}
            onChange={handleCheckboxChange}
          />
        )}
        {children}
      </div>
    );
  },
);
