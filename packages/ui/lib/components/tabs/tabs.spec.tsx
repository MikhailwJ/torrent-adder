import { render, screen } from '@testing-library/react';

import { RadioTab, Tab, Tabs } from '.';

describe('Tabs', () => {
  const tabLabel1 = 'one';
  const tabLabel2 = 'two';
  const tabContent1 = 'content one';
  const tabContent2 = 'content two';

  it('Should render tabs', () => {
    render(
      <Tabs>
        <Tab>{tabLabel1}</Tab>
        <Tab>{tabLabel2}</Tab>
      </Tabs>,
    );
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('Should render tab labels', () => {
    render(
      <Tabs>
        <Tab>{tabLabel1}</Tab>
        <Tab>{tabLabel2}</Tab>
      </Tabs>,
    );
    expect(screen.getByText(tabLabel1)).toBeInTheDocument();
    expect(screen.getByText(tabLabel2)).toBeInTheDocument();
  });

  it('Should render radio tabs', () => {
    render(
      <Tabs>
        <RadioTab name="tab" label={tabLabel1}>
          {tabContent1}
        </RadioTab>
        <RadioTab name="tab" label={tabLabel2} defaultChecked={true}>
          {tabContent2}
        </RadioTab>
      </Tabs>,
    );
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('Should render tab content', () => {
    render(
      <Tabs>
        <RadioTab name="tab" label={tabLabel1}>
          {tabContent1}
        </RadioTab>
        <RadioTab name="tab" label={tabLabel2} defaultChecked={true}>
          {tabContent2}
        </RadioTab>
      </Tabs>,
    );
    expect(screen.getByText(tabContent1)).toBeInTheDocument();
    expect(screen.getByText(tabContent2)).toBeInTheDocument();
  });
});
