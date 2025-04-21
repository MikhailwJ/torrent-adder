import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Navbar } from '.';
import { NavbarStart, NavbarCenter, NavbarEnd } from './navbar';

describe('NavBar', () => {
  it('Should render NavBar', () => {
    render(<Navbar />);
  });

  it('Should apply additional class names', () => {
    const { container } = render(<Navbar className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('Should pass down data-theme prop', () => {
    const { container } = render(<Navbar />);
    expect(container.firstChild).toHaveAttribute('data-theme', 'light');
  });

  it('Should render NavbarStart component', () => {
    const { getByText } = render(<NavbarStart>Start</NavbarStart>);
    expect(getByText('Start')).toBeInTheDocument();
  });

  it('Should render NavbarCenter component', () => {
    const { getByText } = render(<NavbarCenter>Center</NavbarCenter>);
    expect(getByText('Center')).toBeInTheDocument();
  });

  it('Should render NavbarEnd component', () => {
    const { getByText } = render(<NavbarEnd>End</NavbarEnd>);
    expect(getByText('End')).toBeInTheDocument();
  });

  it('Should forward the ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Navbar ref={ref} />);
    expect(ref.current).toBeInTheDocument();
  });
});
