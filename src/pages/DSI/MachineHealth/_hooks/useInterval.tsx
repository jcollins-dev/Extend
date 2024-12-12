import React, { createContext, useContext, useState, ReactNode } from 'react';

export const UseIntervalContext = createContext({
  interval: 'LAST_WEEK',
  setInterval: (x: string) => console.log({ x })
});

export type UseIntervalReturnProps = {
  interval: string;
  setInterval: (x: string) => void;
};

export const useInterval = (): UseIntervalReturnProps =>
  useContext<UseIntervalReturnProps>(UseIntervalContext);

export const UseIntervalProvider = ({
  children
}: {
  children: ReactNode | ReactNode[];
}): JSX.Element => {
  const [interval, setInterval] = useState('LAST_HOUR');

  return (
    <UseIntervalContext.Provider value={{ interval, setInterval }}>
      {children}
    </UseIntervalContext.Provider>
  );
};
