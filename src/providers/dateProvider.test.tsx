import React from 'react';
import { render } from '@testing-library/react';
import { DateProvider, useDate } from './dateProvider';

describe('Date context provider', () => {
  it('Date should be accessible for nested children ', () => {
    const startTime = new Date();
    const endTime = new Date();

    let start = null;
    let end = null;

    const ChildComponent = () => {
      const { startTime, endTime } = useDate();
      start = startTime;
      end = endTime;
      return <></>;
    };

    render(
      <DateProvider context={{ startTime, endTime }}>
        <ChildComponent />
      </DateProvider>
    );

    expect(start).toBe(startTime);
    expect(end).toBe(endTime);
  });
});
