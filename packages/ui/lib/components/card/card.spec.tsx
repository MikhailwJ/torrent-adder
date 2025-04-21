import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Card, CardActions, CardBody, CardImage } from '.';
import { CardTitle } from './card-title';

describe('Card', () => {
  it('Should render Card', () => {
    const { getByLabelText } = render(<Card />);
    expect(getByLabelText('Card')).toBeInTheDocument();
  });

  it('Should render children', () => {
    const { container } = render(
      <Card>
        <div>Child element</div>
      </Card>,
    );
    expect(container.firstChild).toHaveTextContent('Child element');
  });

  it('Should apply the "bordered" prop', () => {
    const { getByLabelText } = render(<Card bordered />);
    expect(getByLabelText('Card')).toHaveClass('card-bordered');
  });

  it('Should apply the "imageFull" prop', () => {
    const { getByLabelText } = render(<Card imageFull />);
    expect(getByLabelText('Card')).toHaveClass('image-full');
  });

  it('Should apply the "side" prop', () => {
    const { getByLabelText } = render(<Card side />);
    expect(getByLabelText('Card')).toHaveClass('card-side');
  });

  it('Should apply additional class names', () => {
    const { getByLabelText } = render(<Card className="custom-class" />);
    expect(getByLabelText('Card')).toHaveClass('custom-class');
  });

  it('Should allow passing extra props', () => {
    render(<Card data-testid="card" />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('Should forward the ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref} />);
    expect(ref.current).toBeInTheDocument();
  });

  it('Should render CardActions component', () => {
    const { container } = render(<CardActions />);
    expect(container.firstChild).toHaveClass('card-actions');
  });

  it('Should render CardBody component', () => {
    const { container } = render(<CardBody />);
    expect(container.firstChild).toHaveClass('card-body');
  });

  it('Should render CardTitle component', () => {
    const { container } = render(<CardTitle />);
    expect(container.firstChild).toHaveClass('card-title');
  });

  it('Should render CardImage component', () => {
    render(<CardImage src="http://xyz/images/pic-1.webp" alt="test image" />);
    const figureElement = screen.getByRole('figure');
    expect(figureElement).toBeInTheDocument();
    const imgElement = screen.getByRole('img') as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.src).toBe('http://xyz/images/pic-1.webp');
    expect(imgElement.alt).toBe('test image');
  });
});
