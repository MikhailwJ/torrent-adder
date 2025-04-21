import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Form, Label } from '.';

describe('Form', () => {
  test('Should render Form', () => {
    render(<Form />);
  });

  test('Should apply additional class names', () => {
    const { container } = render(<Form className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('Should forward the ref to the root element', () => {
    const ref = createRef<HTMLFormElement>();
    render(<Form ref={ref} />);
    expect(ref.current).toBeInTheDocument();
  });

  test('Should render Label', () => {
    const { getByText } = render(<Label title="Username" />);
    expect(getByText('Username')).toBeInTheDocument();
  });

  test('Should render children elements', () => {
    const { container } = render(
      <Form>
        <Label title="Username">
          <input type="text" name="username" />
          <button type="submit">Submit</button>
        </Label>
      </Form>,
    );

    expect(container.querySelector('input[name="username"]')).toBeInTheDocument();
    expect(container.querySelector('button[type="submit"]')).toBeInTheDocument();
  });
});
