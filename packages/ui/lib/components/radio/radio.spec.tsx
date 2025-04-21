import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio } from '.';
import { Form, Label } from '../form';
import { Button } from '../button';

const TestRadio2 = () => {
  const [pill, setPill] = useState('blue');
  return (
    <>
      <Form>
        <Label title="Red Pill">
          <Radio name="radio1" checked={pill === 'red'} className="checked:bg-red-500" onClick={() => setPill('red')} />
        </Label>
      </Form>
      <Form>
        <Label title="Blue Pill">
          <Radio
            name="radio1"
            checked={pill === 'blue'}
            className="checked:bg-blue-500"
            onClick={() => setPill('blue')}
          />
        </Label>
      </Form>
      <Button onClick={() => setPill('')}>Clear</Button>
    </>
  );
};

const TestRadio1 = () => {
  const [value, setValue] = useState('blue');
  return (
    <>
      <Form>
        <Label title="Red Pill">
          <Radio
            name="radio1"
            checked={value === 'red'}
            onClick={() => setValue('red')}
            className="checked:bg-red-500"
          />
        </Label>
      </Form>
    </>
  );
};

describe('Radio', () => {
  test('render Radio', () => {
    render(<Radio name="radio1" className="checked:bg-red-500" />);

    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  test('render Radio with label', () => {
    render(
      <Form>
        <Label title="Valheim">
          <Radio name="radio2" className="checked:bg-red-500" />
        </Label>
      </Form>,
    );
    expect(screen.getByLabelText(/Valheim/i)).toBeInTheDocument();
  });

  test('Radio checked', () => {
    render(
      <Form>
        <Label title="Joji">
          <Radio name="radio2" className="checked:bg-red-500" checked />
        </Label>
      </Form>,
    );
    expect(screen.getByLabelText(/Joji/i)).toBeChecked();
  });

  test('check Radio', async () => {
    const user = userEvent.setup();
    render(<TestRadio1 />);
    expect(screen.getByLabelText(/Red Pill/i)).not.toBeChecked();
    await user.click(screen.getByLabelText(/Red Pill/i));
    expect(screen.getByLabelText(/Red Pill/i)).toBeChecked();
  });

  test('clear checked Radio by button click', async () => {
    const user = userEvent.setup();
    render(<TestRadio2 />);
    expect(screen.getByLabelText(/Red Pill/i)).not.toBeChecked();
    await user.click(screen.getByLabelText(/Red Pill/i));
    expect(screen.getByLabelText(/Red Pill/i)).toBeChecked();
    await user.click(screen.getByRole('button', { name: /Clear/i }));
    expect(screen.getByLabelText(/Red Pill/i)).not.toBeChecked();
  });
});
